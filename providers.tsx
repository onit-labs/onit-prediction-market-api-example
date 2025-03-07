"use client";

import React from "react";
import { WagmiProvider, createConfig, mock } from "wagmi";
import { http } from "viem";
import { foundry } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { privateKeyToAccount } from "viem/accounts";

// Default anvil account
export const localAccount = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

// Configure the mock connector with proper options
export const testConnector = mock({
  accounts: [localAccount.address],
  features: {
    defaultConnected: true,
  },
});

const config = createConfig({
  chains: [foundry],
  transports: {
    [foundry.id]: http(),
  },
  connectors: [testConnector],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
