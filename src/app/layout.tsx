// src/app/layout.tsx
'use client';

import './globals.css';
import { ReactNode, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const cluster = (process.env.NEXT_PUBLIC_CLUSTER || 'devnet') as 'devnet' | 'mainnet-beta';

  // Usa Helius si lo tienes, si no fallback a clusterApiUrl
  const endpoint =
    (process.env.NEXT_PUBLIC_RPC_URL || '').trim() || clusterApiUrl(cluster);

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
