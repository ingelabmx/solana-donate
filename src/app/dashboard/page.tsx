'use client';

import { useEffect, useMemo, useState } from 'react';
import SiteNav from '@/components/SiteNav';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { TENANTS, Tenant } from '@/tenants';

type SavedTenant = Omit<Tenant, 'theme' | 'avatarUrl' | 'coverUrl'>;
const ROOT = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || '').trim();
const tenantUrl = (slug: string) => (ROOT ? `https://${slug}.${ROOT}` : `/sites/${slug}`);

function useMyTenants(walletAddr: string | null) {
  const [local, setLocal] = useState<SavedTenant[]>([]);
  useEffect(() => {
    try { setLocal(JSON.parse(localStorage.getItem('tenants_local') || '[]')); } catch {}
  }, []);

  const fromStatic = useMemo(
    () => (walletAddr ? Object.values(TENANTS).filter(t => t.ownerWallet === walletAddr) : []),
    [walletAddr]
  );
  const fromLocal = useMemo(
    () => (walletAddr ? local.filter(t => t.ownerWallet === walletAddr) : []),
    [walletAddr, local]
  );

  // de-dupe por slug
  const map = new Map<string, SavedTenant>();
  [...fromStatic, ...fromLocal].forEach(t => map.set(t.slug, t as SavedTenant));
  return {
    list: Array.from(map.values()),
    refreshLocal: () => {
      try { setLocal(JSON.parse(localStorage.getItem('tenants_local') || '[]')); } catch {}
    }
  };
}

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const walletAddr = useMemo(() => publicKey?.toBase58() || null, [publicKey]);

  const params = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'mine' | 'create'>('mine');
  useEffect(() => setMounted(true), []);

  // lee pestaña desde la URL (los botones viven en SiteNav)
  useEffect(() => {
    const wantCreate = params.get('new') === '1' || params.get('tab') === 'create';
    setTab(wantCreate ? 'create' : 'mine');
  }, [params]);

  const { list: myTenants, refreshLocal } = useMyTenants(walletAddr);

  // ------- Form (crear/editar) -------
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [donationAddress, setDonationAddress] = useState('');
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [x, setX] = useState('');
  const [savedJson, setSavedJson] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddr) {
      setDonationAddress((v) => v || walletAddr);
    }
  }, [walletAddr]);

  const saveLocal = (t: SavedTenant) => {
    try {
      const arr: SavedTenant[] = JSON.parse(localStorage.getItem('tenants_local') || '[]');
      const i = arr.findIndex(x => x.slug === t.slug);
      if (i >= 0) arr[i] = t; else arr.push(t);
      localStorage.setItem('tenants_local', JSON.stringify(arr));
      setSavedJson(JSON.stringify(t, null, 2));
      refreshLocal();
    } catch {}
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddr) return alert('Conecta tu wallet.');
    if (!slug || !name || !donationAddress) return alert('Completa subdominio, nombre y wallet destino.');
    const payload: SavedTenant = {
      slug: slug.toLowerCase().trim(),
      name: name.trim(),
      donationAddress: donationAddress.trim(),
      ownerWallet: walletAddr,
      description: description.trim() || undefined,
      socials: {
        instagram: instagram.trim() || undefined,
        discord: discord.trim() || undefined,
        x: x.trim() || undefined,
      },
    };
    // FUTURO: POST /api/tenants
    saveLocal(payload);
    alert(`Guardado. Abre: ${tenantUrl(payload.slug)}`);
  };

  const onEdit = (t: SavedTenant) => {
    setTab('create');
    setSlug(t.slug);
    setName(t.name);
    setDonationAddress(t.donationAddress);
    setDescription(t.description || '');
    setInstagram(t.socials?.instagram || '');
    setDiscord(t.socials?.discord || '');
    setX(t.socials?.x || '');
  };

  const onDelete = (t: SavedTenant) => {
    if (TENANTS[t.slug]) return alert('Este subdominio fue definido en el código (demo) y no puede borrarse aquí.');
    if (!confirm(`¿Eliminar ${t.slug}?`)) return;
    try {
      const arr: SavedTenant[] = JSON.parse(localStorage.getItem('tenants_local') || '[]');
      localStorage.setItem('tenants_local', JSON.stringify(arr.filter(x => x.slug !== t.slug)));
      refreshLocal();
    } catch {}
  };

  return (
    <>
      {/* Barra global (wallet + enlaces arriba) */}
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <section className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-950 p-6">
          {tab === 'mine' ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Tus subdominios</h2>

              {!mounted ? (
                <div className="h-40 rounded-xl bg-gray-900 border border-gray-800" />
              ) : !walletAddr ? (
                <p className="text-gray-300">Conecta tu wallet para ver y gestionar subdominios.</p>
              ) : myTenants.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <p className="text-gray-300">No tienes subdominios aún. Usa “Crear nuevo” arriba en la barra.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {myTenants.map((t) => {
                    const url = tenantUrl(t.slug);
                    return (
                      <div key={t.slug} className="relative rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                        {/* Icono copiar arriba-derecha */}
                        <button
                          onClick={() => navigator.clipboard.writeText(url)}
                          className="absolute right-2 top-2 rounded-md border border-gray-700 px-2 py-1 text-xs hover:bg-gray-800"
                          title="Copiar link"
                          aria-label="Copiar link"
                        >
                          ⧉
                        </button>

                        <div className="text-sm text-gray-400">Subdominio</div>
                        <div className="text-lg font-semibold mb-1">{t.slug}</div>

                        <div className="text-sm text-gray-400">Nombre</div>
                        <div className="mb-2">{t.name}</div>

                        <div className="text-sm text-gray-400">Wallet</div>
                        <div className="text-xs text-gray-300 break-all mb-3">{t.donationAddress}</div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={url}
                            target={ROOT ? '_blank' : undefined}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Abrir
                          </Link>
                          <button
                            onClick={() => onEdit(t)}
                            className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onDelete(t)}
                            className="px-3 py-1.5 rounded-lg border border-red-800 text-red-300 hover:bg-red-950/40"
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">{slug ? 'Editar link' : 'Crear tu link'}</h2>

              {!walletAddr ? (
                <p className="text-gray-300">Conecta tu wallet para registrar tu link.</p>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Subdominio</label>
                    <div className="flex items-center gap-2">
                      <input
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-56"
                        placeholder="mi-ong"
                      />
                      <span className="text-gray-400 opacity-80">.{ROOT || 'mi-dominio.com'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Nombre público</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full"
                      placeholder="Nombre de tu proyecto/ONG"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Wallet destino</label>
                    <input
                      value={donationAddress}
                      onChange={e => setDonationAddress(e.target.value)}
                      className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full"
                      placeholder="Tu wallet base58"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Descripción</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full h-24"
                      placeholder="Cuéntale a tus donantes sobre tu causa."
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Instagram</label>
                      <input
                        value={instagram}
                        onChange={e => setInstagram(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full"
                        placeholder="https://instagram.com/tuusuario"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Discord</label>
                      <input
                        value={discord}
                        onChange={e => setDiscord(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full"
                        placeholder="https://discord.gg/tu_invite"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">X (Twitter)</label>
                      <input
                        value={x}
                        onChange={e => setX(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full"
                        placeholder="https://x.com/tuusuario o @tuusuario"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
                  >
                    Guardar borrador
                  </button>
                </form>
              )}

              {savedJson && (
                <pre className="mt-4 text-xs bg-gray-900 border border-gray-800 rounded-lg p-3 overflow-auto">
{savedJson}
                </pre>
              )}
            </>
          )}
        </section>

        {/* Lateral */}
        <aside className="rounded-2xl border border-gray-800 bg-gray-950 p-6 h-fit">
          <h3 className="font-semibold mb-3">Ayuda</h3>
          <p className="text-sm text-gray-400">
            Usa los botones de la barra superior para navegar entre “Mis subdominios” y “Crear nuevo”.
          </p>
        </aside>
      </main>
    </>
  );
}
