'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function TenantNav({ ownerAddress }: { ownerAddress: string }) {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const isOwner = useMemo(() => {
    if (!publicKey || !ownerAddress) return false;
    return publicKey.toBase58() === ownerAddress;
  }, [publicKey, ownerAddress]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
            <Image src="/kindralogo.png" alt="logo" width={50} height={50} className="object-cover" />
          </div>
          <span className="font-semibold tracking-wide">Kindra</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isOwner && (
            <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
          )}
          {mounted ? (
            <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg" />
          ) : (
            <div className="h-9 w-36 rounded-lg bg-gray-800" />
          )}
        </nav>

        <button
          className="md:hidden rounded-lg border border-gray-700 px-3 py-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open Menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 pb-3">
          <div className="flex flex-col gap-2 py-3">
            {isOwner && (
              <Link href="/dashboard" className="py-1 text-gray-200">Dashboard</Link>
            )}
            {mounted ? (
              <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg w-full" />
            ) : (
              <div className="h-10 w-full rounded-lg bg-gray-800" />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
