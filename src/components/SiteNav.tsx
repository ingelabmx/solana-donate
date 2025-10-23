'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePathname, useRouter } from 'next/navigation';

export default function SiteNav() {
  const { publicKey } = useWallet();
  const isLogged = !!publicKey;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Si se desconecta la wallet en /dashboard, regresa a Home
  useEffect(() => {
    if (!isLogged && pathname?.startsWith('/dashboard')) {
      router.replace('/');
    }
  }, [isLogged, pathname, router]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
            <Image src="/logo.png" alt="logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-semibold tracking-wide">Solana Donations</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {isLogged && (
            <>
              <Link href="/dashboard?tab=mine" className="text-gray-300 hover:text-white">Mis subdominios</Link>
              <Link href="/dashboard?new=1" className="text-gray-300 hover:text-white">Crear nuevo</Link>
            </>
          )}
          {mounted ? (
            <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg" />
          ) : (
            <div className="h-9 w-36 rounded-lg bg-gray-800" />
          )}
        </nav>

        <button
          className="md:hidden rounded-lg border border-gray-700 px-3 py-1.5"
          onClick={() => setOpen(v => !v)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 pb-3">
          <div className="flex flex-col gap-2 py-3">
            {isLogged && (
              <>
                <Link href="/dashboard?tab=mine" className="py-1 text-gray-200">Mis subdominios</Link>
                <Link href="/dashboard?new=1" className="py-1 text-gray-200">Crear nuevo</Link>
              </>
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
