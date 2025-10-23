'use client';

import SiteNav from '@/components/SiteNav';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TENANTS, Tenant } from '@/tenants';

type FormData = {
  slug: string;
  name: string;
  donationAddress: string;
  description?: string;
  socials?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
};

type SavedTenant = Omit<Tenant, 'theme' | 'avatarUrl' | 'coverUrl'>;

const ROOT = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || '').trim();
const tenantUrl = (slug: string) => (ROOT ? `https://${slug}.${ROOT}` : `/sites/${slug}`);

function useMyTenants(walletAddr: string | null) {
  const [local, setLocal] = useState<SavedTenant[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tenants_local');
      setLocal(raw ? JSON.parse(raw) : []);
    } catch { setLocal([]); }
  }, []);

  const fromStatic = useMemo(
    () => (walletAddr ? Object.values(TENANTS).filter(t => t.ownerWallet === walletAddr) : []),
    [walletAddr]
  );
  const fromLocal = useMemo(
    () => (walletAddr ? local.filter(t => t.ownerWallet === walletAddr) : []),
    [walletAddr, local]
  );

  const map = new Map<string, SavedTenant>();
  [...fromStatic, ...fromLocal].forEach(t => map.set(t.slug, t as SavedTenant));
  return { list: Array.from(map.values()), refreshLocal: () => {
    try {
      const raw = localStorage.getItem('tenants_local');
      const arr: SavedTenant[] = raw ? JSON.parse(raw) : [];
      // trigger
      setLocal(arr);
    } catch {}
  }};
}

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const walletAddr = useMemo(() => publicKey?.toBase58() || null, [publicKey]);

  const { list: myTenants, refreshLocal } = useMyTenants(walletAddr);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'mine' | 'create'>('mine');
  const [saved, setSaved] = useState<string | null>(null);
  const params = useSearchParams();

  useEffect(() => setMounted(true), []);
  // Leer tabs desde la URL
  useEffect(() => {
    const wantCreate = params.get('new') === '1' || params.get('tab') === 'create';
    if (wantCreate) setTab('create');
    else if (params.get('tab') === 'mine') setTab('mine');
  }, [params]);

  // Si no tienes subdominios, sugiere "create"
  useEffect(() => {
    if (mounted && myTenants.length === 0) setTab('create');
  }, [mounted, myTenants.length]);

  const [data, setData] = useState<FormData>({
    slug: '',
    name: '',
    donationAddress: walletAddr || '',
    description: '',
    socials: { website: '', twitter: '', instagram: '', github: '' },
  });

  useEffect(() => {
    if (walletAddr) setData(d => ({ ...d, donationAddress: d.donationAddress || walletAddr }));
  }, [walletAddr]);

  const onChange = (k: keyof FormData, v: any) => setData(d => ({ ...d, [k]: v }));
  const onSocialChange = (k: keyof NonNullable<FormData['socials']>, v: string) =>
    setData(d => ({ ...d, socials: { ...(d.socials || {}), [k]: v } }));

  const saveLocalTenant = (t: SavedTenant) => {
    try {
      const raw = localStorage.getItem('tenants_local');
      const arr: SavedTenant[] = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex(x => x.slug === t.slug);
      if (idx >= 0) arr[idx] = t; else arr.push(t);
      localStorage.setItem('tenants_local', JSON.stringify(arr));
      refreshLocal();
    } catch {}
  };
  const deleteLocalTenant = (slug: string) => {
    try {
      const raw = localStorage.getItem('tenants_local');
      const arr: SavedTenant[] = raw ? JSON.parse(raw) : [];
      const next = arr.filter(x => x.slug !== slug);
      localStorage.setItem('tenants_local', JSON.stringify(next));
      refreshLocal();
    } catch {}
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddr) return alert('Conecta tu wallet.');
    if (!data.slug || !data.name || !data.donationAddress) return alert('Completa subdominio, nombre y wallet destino.');
    const payload: SavedTenant = {
      slug: data.slug.toLowerCase().trim(),
      name: data.name.trim(),
      donationAddress: data.donationAddress.trim(),
      ownerWallet: walletAddr,
      description: (data.description || '').trim(),
      socials: {
        website: data.socials?.website?.trim() || undefined,
        twitter: data.socials?.twitter?.trim() || undefined,
        instagram: data.socials?.instagram?.trim() || undefined,
        github: data.socials?.github?.trim() || undefined,
      },
    };
    // FUTURO: POST /api/tenants
    saveLocalTenant(payload);
    setSaved(JSON.stringify(payload, null, 2));
    alert(`Borrador guardado. Abre: ${tenantUrl(payload.slug)}`);
  };

  const onEdit = (t: SavedTenant) => {
    setTab('create');
    setData({
      slug: t.slug,
      name: t.name,
      donationAddress: t.donationAddress,
      description: t.description || '',
      socials: {
        website: t.socials?.website || '',
        twitter: t.socials?.twitter || '',
        instagram: t.socials?.instagram || '',
        github: t.socials?.github || '',
      },
    });
  };

  const onDelete = (t: SavedTenant) => {
    if (TENANTS[t.slug]) {
      alert('Este subdominio proviene del código (demo) y no puede borrarse aquí.');
      return;
    }
    if (confirm(`¿Eliminar ${t.slug}?`)) deleteLocalTenant(t.slug);
  };

   return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* ...tu contenido de dashboard (mis subdominios / crear nuevo)... */}
      </main>
    </>
  );
}


      