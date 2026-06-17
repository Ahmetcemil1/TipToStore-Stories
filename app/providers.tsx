'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { filecoinCalibration, filecoin } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  console.warn(
    'Warning: NEXT_PUBLIC_REOWN_PROJECT_ID is not set in environment variables. Falling back to default ID.'
  );
}

const config = getDefaultConfig({
  appName: 'TipToStore Stories',
  projectId: projectId || '3fbb6b16d4835a2cf82256c8d281d8ec',
  chains: [filecoinCalibration, filecoin],
  ssr: true,
  walletConnectParameters: {
    telemetryEnabled: false, // Disables WalletConnect telemetry to prevent origin/allowlist console errors in development
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
