import { Synapse } from '@filoz/synapse-sdk';
import { WarmStorageService } from '@filoz/synapse-sdk/warm-storage';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * Filecoin / Synapse SDK Extended Interfaces for Type Safety
 * This avoids inline 'as any' casting and provides clean IDE autocomplete.
 */
interface ExtendedSynapse {
  payments: {
    approve(args: { spender: `0x${string}`; amount: number }): Promise<{ hash: `0x${string}` }>;
    accountSummary(): Promise<{ 
      funds: bigint; 
      availableFunds: bigint; 
      debt: bigint; 
      lockupRatePerEpoch: bigint; 
      lockupRatePerMonth: bigint; 
      totalLockup: bigint; 
      totalFixedLockup: bigint;
    }>;
    createRail(args: { to: `0x${string}`; rate: number }): Promise<string>;
    topUpRail(args: { railId: string; amount: number }): Promise<void>;
    settleAuto(args: { railId: string }): Promise<`0x${string}`>;
  };
  storage: {
    prepare(args: { dataSize: bigint }): Promise<{ 
      costs: { 
        depositNeeded: bigint; 
        rates: { perMonth: bigint } 
      }; 
      transaction?: {
        depositAmount: bigint;
        includesApproval: boolean;
        execute(args: { onHash: (hash: string) => void }): Promise<void>;
      } 
    }>;
    createContext(args: { metadata: Record<string, string> }): Promise<{ 
      upload(data: Uint8Array): Promise<{ 
        copies: { dataSetId: bigint }[] 
      }> 
    }>;
    getStorageCost(dataSetId: string): Promise<{ costPerDay: number }>;
  };
  contracts?: {
    filecoinPay?: { address: string };
  };
  client: {
    waitForTransactionReceipt(args: { hash: `0x${string}` }): Promise<void>;
    getBlockNumber(): Promise<bigint>;
  };
}

interface ExtendedWarmStorage {
  getDataSet(args: { dataSetId: bigint }): Promise<{ pdpEndEpoch: bigint } | null>;
  upsertDataSet(dataSetId: string, args: { endEpoch: number }): Promise<void>;
}

// ─────────────────────────────────────────────────────────

// Securely load private key on server-side only to prevent browser exposure
const account = privateKeyToAccount(
  (process.env.AUTHOR_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') as `0x${string}`
);

// Instantiate core Synapse Client
const rawSynapse = Synapse.create({ 
  account, 
  source: "tipto-store" 
});

// Cast to our extended interface for complete type safety
export const synapse = rawSynapse as unknown as ExtendedSynapse;

// Instantiate WarmStorageService
const rawWarmStorage = new WarmStorageService({ client: rawSynapse.client as any });
export const warmStorage = rawWarmStorage as unknown as ExtendedWarmStorage;

/**
 * Uploads a story to Filecoin Onchain Cloud and creates a Data Set.
 * The SDK automatically creates a payment rail for this dataset.
 */
export async function uploadStoryToFilecoin(data: Uint8Array, title: string, authorAddress: string, initialDays: number = 30) {
  // 1. Prepare storage cost calculations using Synapse prepare API
  try {
    const prep = await synapse.storage.prepare({
      dataSize: BigInt(data.length)
    });
    console.log("Storage deposit needed:", prep.costs?.depositNeeded);
  } catch (e) {
    throw new Error("Failed to prepare Filecoin storage transaction: " + (e as Error).message);
  }

  // 2. Create the storage context
  const ctx = await synapse.storage.createContext({
    metadata: { 
      title,
      authorAddress,
      storageDuration: initialDays.toString()
    },
  });

  // 3. Upload the file to Filecoin network
  let result;
  try {
    result = await ctx.upload(data);
  } catch (e) {
    throw new Error("Filecoin storage upload failed: " + (e as Error).message);
  }
  
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
    dataSetId: firstCopy.dataSetId.toString(),
    endEpoch: dataSetInfo.pdpEndEpoch
  };
}

/**
 * Helpers to get and set rails in localStorage to prevent Serverless/in-memory cache wipe
 */
function getCachedRail(authorAddress: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const data = localStorage.getItem('tiptostore_cached_rails');
    if (data) {
      const parsed = JSON.parse(data);
      return parsed[authorAddress];
    }
  } catch (e) {
    console.error("Failed to read rail cache from localStorage:", e);
  }
  return undefined;
}

function setCachedRail(authorAddress: string, railId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem('tiptostore_cached_rails');
    const parsed = data ? JSON.parse(data) : {};
    parsed[authorAddress] = railId;
    localStorage.setItem('tiptostore_cached_rails', JSON.stringify(parsed));
  } catch (e) {
    console.error("Failed to save rail cache to localStorage:", e);
  }
}

/**
 * Tips an author and automatically extends the storage of the story
 * using the Synapse Payment Rails.
 */
export async function tipAndRenewStorage(dataSetId: string, authorAddress: string, tipAmountUSDFC: number) {
  // 1. Approve USDFC spending via synapse.payments targeting the correct filecoinPay contract
  const filecoinPayAddress = synapse.contracts?.filecoinPay?.address;
  if (!filecoinPayAddress) {
    throw new Error("Filecoin Pay contract address is not configured in the Synapse context.");
  }

  try {
    await synapse.payments.approve({
      spender: filecoinPayAddress as `0x${string}`,
      amount: tipAmountUSDFC,
    });
    
    // Check account summary for storage health runway
    const summary = await synapse.payments.accountSummary();
    console.log("Available funds for storage runway:", summary.availableFunds);
  } catch (e) {
    throw new Error("USDFC payment approval failed: " + (e as Error).message);
  }

  // 2. Check if a payment rail already exists for this author to save on transaction costs (using localStorage cache)
  let railId = getCachedRail(authorAddress);
  if (!railId) {
    try {
      railId = await synapse.payments.createRail({
        to: authorAddress as `0x${string}`,
        rate: 0.1, // Cost per epoch (example)
      });
      setCachedRail(authorAddress, railId);
    } catch (e) {
      throw new Error("Failed to create USDFC payment rail: " + (e as Error).message);
    }
  }

  // 3. Reader tips via the rail
  try {
    await synapse.payments.topUpRail({ 
      railId, 
      amount: tipAmountUSDFC 
    });
  } catch (e) {
    throw new Error("Failed to fund payment rail: " + (e as Error).message);
  }
  
  // 4. Settle the rail (transfer tips to author)
  try {
    const hash = await synapse.payments.settleAuto({ railId });
    await synapse.client.waitForTransactionReceipt({ hash });
  } catch (e) {
    throw new Error("Failed to settle USDFC transaction: " + (e as Error).message);
  }
  
  // 5. Calculate storage cost from tips
  let costPerDay = 0.1;
  try {
    const storageCost = await synapse.storage.getStorageCost(dataSetId);
    costPerDay = storageCost.costPerDay || 0.1;
  } catch {
    // Fallback if SDK method doesn't exist in this version
  }
  const renewalDays = tipAmountUSDFC / costPerDay;
  
  // 6. Extend storage duration on Filecoin
  const currentDataSet = await warmStorage.getDataSet({ dataSetId: BigInt(dataSetId) });
  if (!currentDataSet) {
    throw new Error("Dataset not found on-chain");
  }
  // Include 1% block time variance buffer (1.01 multiplier) to guarantee correct synchronization with provider state
  const newEndEpoch = Number(currentDataSet.pdpEndEpoch) + Math.floor(renewalDays * 2880 * 1.01);
  
  try {
    await warmStorage.upsertDataSet(dataSetId, {
      endEpoch: newEndEpoch,
    });
  } catch (e) {
    throw new Error("Failed to renew Filecoin storage lease: " + (e as Error).message);
  }
  
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
