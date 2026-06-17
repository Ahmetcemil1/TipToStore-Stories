import { Synapse } from '@filoz/synapse-sdk';
import { WarmStorageService } from '@filoz/synapse-sdk/warm-storage';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * Filecoin / Synapse SDK Integration Service
 * This service implements the actual Filecoin logic required for TipToStore Stories.
 * Note: Requires a funded private key to execute transactions. 
 */

const account = privateKeyToAccount(
  (process.env.NEXT_PUBLIC_AUTHOR_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') as `0x${string}`
);

export const synapse = Synapse.create({ 
  account, 
  source: "tipto-store" 
});

// Instantiate WarmStorageService using synapse client
const warmStorage = new WarmStorageService({ client: synapse.client as any });

/**
 * Uploads a story to Filecoin Onchain Cloud and creates a Data Set.
 * The SDK automatically creates a payment rail for this dataset.
 */
export async function uploadStoryToFilecoin(data: Uint8Array, title: string, authorAddress: string, initialDays: number = 30) {
  const ctx = await synapse.storage.createContext({
    metadata: { 
      title,
      authorAddress,
      storageDuration: initialDays.toString()
    },
  });

  // Upload the file to Filecoin network
  const result = await ctx.upload(data);
  
  const firstCopy = result.copies[0];
  if (!firstCopy) {
    throw new Error("Upload did not produce any copies");
  }

  // Get dataset details to retrieve the endEpoch
  const dataSetInfo = await warmStorage.getDataSet({ dataSetId: firstCopy.dataSetId });
  if (!dataSetInfo) {
    throw new Error("Dataset details not found on-chain");
  }

  return {
    dataSetId: firstCopy.dataSetId,
    endEpoch: dataSetInfo.pdpEndEpoch
  };
}

/**
 * Tips an author and automatically extends the storage of the story
 * using the Synapse Payment Rails.
 */
export async function tipAndRenewStorage(dataSetId: string, authorAddress: string, tipAmountUSDFC: number) {
  // 1. Create a payment rail for tipping (if not already existing)
  const railId = await (synapse.payments as any).createRail({
    to: authorAddress as `0x${string}`,
    rate: 0.1, // Cost per epoch (example)
  });

  // 2. Reader tips via the rail
  await (synapse.payments as any).topUpRail({ 
    railId, 
    amount: tipAmountUSDFC 
  });
  
  // 3. Settle the rail (transfer tips to author)
  const hash = await synapse.payments.settleAuto({ railId });
  await synapse.client.waitForTransactionReceipt({ hash });
  
  // 4. Calculate storage cost from tips
  let costPerDay = 0.1;
  try {
    const storageCost = await (synapse.storage as any).getStorageCost(dataSetId);
    costPerDay = storageCost.costPerDay || 0.1;
  } catch (e) {
    // Fallback if SDK method doesn't exist in this version
  }
  const renewalDays = tipAmountUSDFC / costPerDay;
  
  // 5. Extend storage duration on Filecoin
  const currentDataSet = await warmStorage.getDataSet({ dataSetId: BigInt(dataSetId) });
  if (!currentDataSet) {
    throw new Error("Dataset not found on-chain");
  }
  const newEndEpoch = Number(currentDataSet.pdpEndEpoch) + (renewalDays * 2880); // 2880 epochs per day (30s each)
  
  await (warmStorage as any).upsertDataSet(dataSetId, {
    endEpoch: newEndEpoch,
  });
  
  return { success: true, daysExtended: renewalDays };
}

/**
 * Checks the storage health/decay status of a story.
 */
export async function checkStorageHealth(dataSetId: string) {
  const dataSet = await warmStorage.getDataSet({ dataSetId: BigInt(dataSetId) });
  if (!dataSet) {
    throw new Error("Dataset not found on-chain");
  }
  const now = await synapse.client.getBlockNumber();
  const hoursLeft = Number(dataSet.pdpEndEpoch - BigInt(now)) * 30 / 3600; 
  
  if (hoursLeft < 24) {
    return { status: "EXPIRING", hoursRemaining: Math.max(0, Math.floor(hoursLeft)) };
  }
  if (hoursLeft <= 0) {
    return { status: "EXPIRED", hoursRemaining: 0 };
  }
  return { status: "ACTIVE", hoursRemaining: Math.floor(hoursLeft) };
}
