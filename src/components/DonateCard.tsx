// src/components/DonateCard.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

const USDC_MINT_MAINNET = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDC_MINT_DEVNET  = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

function safePubkey(raw?: string): PublicKey | null {
  if (!raw) return null;
  try { return new PublicKey(raw.trim()); } catch { return null; }
}

export default function DonateCard({
  destination,
  cluster,
}: {
  destination: string;
  cluster: 'devnet' | 'mainnet-beta';
}) {
  const [mounted, setMounted] = useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const DESTINATION = useMemo(() => safePubkey(destination), [destination]);
  const USDC_MINT   = useMemo(
    () => (cluster === 'mainnet-beta' ? USDC_MINT_MAINNET : USDC_MINT_DEVNET),
    [cluster]
  );

  const [asset, setAsset] = useState<'SOL' | 'USDC'>('SOL');
  const [amountSOL, setAmountSOL] = useState('0.1');
  const [amountUSDC, setAmountUSDC] = useState('1');
  const [txSig, setTxSig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div suppressHydrationWarning className="h-48 w-full rounded-2xl bg-gray-900 border border-gray-800" />;

  const donateSOL = async () => {
    if (!publicKey) return alert('Conecta tu wallet primero.');
    if (!DESTINATION) return alert('Destino inválido.');
    const lamports = Math.round(Number(amountSOL) * LAMPORTS_PER_SOL);
    if (!Number.isFinite(lamports) || lamports <= 0) return alert('Cantidad SOL inválida.');

    const tx = new Transaction().add(SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: DESTINATION,
      lamports,
    }));
    const sig = await sendTransaction(tx, connection);
    await connection.confirmTransaction(sig, 'confirmed');
    return sig;
  };

  const donateUSDC = async () => {
    if (!publicKey) return alert('Conecta tu wallet primero.');
    if (!DESTINATION) return alert('Destino inválido.');
    const units = Math.round(Number(amountUSDC) * 1e6);
    if (!Number.isFinite(units) || units <= 0) return alert('Cantidad USDC inválida.');

    const fromATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
    const toATA   = await getAssociatedTokenAddress(USDC_MINT, DESTINATION);

    const tx = new Transaction();
    const toInfo = await connection.getAccountInfo(toATA);
    if (!toInfo) {
      tx.add(createAssociatedTokenAccountInstruction(
        publicKey, // payer
        toATA,
        DESTINATION,
        USDC_MINT
      ));
    }
    tx.add(createTransferInstruction(fromATA, toATA, publicKey, units));
    const sig = await sendTransaction(tx, connection);
    await connection.confirmTransaction(sig, 'confirmed');
    return sig;
  };

  const onDonate = async () => {
    try {
      setLoading(true);
      setTxSig(null);
      const sig = await (asset === 'SOL' ? donateSOL() : donateUSDC());
      if (sig) setTxSig(sig);
    } catch (e) {
      console.error(e);
      alert('❌ Error al enviar la donación. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-800 bg-gray-950/60 p-6 shadow-xl">
      {/* Wallet button dentro de la tarjeta también (opcional) */}
      <div className="mb-4 flex justify-end">
        <WalletMultiButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg" />
      </div>

      {/* Selector de activo */}
      <div className="flex gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800 mb-4">
        <button
          onClick={() => setAsset('SOL')}
          className={`px-4 py-2 rounded-lg ${asset === 'SOL' ? 'bg-gray-800' : ''}`}
        >
          SOL
        </button>
        <button
          onClick={() => setAsset('USDC')}
          className={`px-4 py-2 rounded-lg ${asset === 'USDC' ? 'bg-gray-800' : ''}`}
        >
          USDC
        </button>
      </div>

      {asset === 'SOL' ? (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number" min="0" step="0.001"
            value={amountSOL} onChange={e => setAmountSOL(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-40 text-center"
          />
          <span className="opacity-80">SOL</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number" min="0" step="0.1"
            value={amountUSDC} onChange={e => setAmountUSDC(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-40 text-center"
          />
          <span className="opacity-80">USDC</span>
        </div>
      )}

      <button
        onClick={onDonate} disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 px-5 py-2 rounded-lg font-medium"
      >
        {loading ? 'Enviando…' : 'Donate'}
      </button>

      {txSig && (
        <a
          href={`https://explorer.solana.com/tx/${txSig}?cluster=${cluster}`}
          target="_blank" rel="noreferrer"
          className="block text-center text-indigo-400 hover:underline mt-3"
        >
          Ver transacción en Solana Explorer
        </a>
      )}
    </div>
  );
}
