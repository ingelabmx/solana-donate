// src/app/sites/[tenant]/page.tsx
import { notFound } from 'next/navigation';
import { TENANTS } from '@/tenants';
import SiteNav from '@/components/SiteNav';
import DonateCard from '@/components/DonateCard';

const CLUSTER = (process.env.NEXT_PUBLIC_CLUSTER || 'devnet') as 'devnet' | 'mainnet-beta';

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params; // ✅ Next 16
  const cfg = TENANTS[tenant];

  if (!cfg) return notFound();

  return (
    <>
      {/* barra global unificada */}
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{cfg.name}</h1>
          {cfg.description && (
            <p className="mt-2 text-gray-300">{cfg.description}</p>
          )}

          {/* Redes (opcionales) */}
          {(cfg.socials && Object.keys(cfg.socials).length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {cfg.socials?.instagram && (
                <a href={cfg.socials.instagram} target="_blank" className="text-gray-300 hover:text-white underline">
                  Instagram
                </a>
              )}
              {cfg.socials?.discord && (
                <a href={cfg.socials.discord} target="_blank" className="text-gray-300 hover:text-white underline">
                  Discord
                </a>
              )}
              {cfg.socials?.x && (
                <a
                  href={cfg.socials.x.startsWith('http') ? cfg.socials.x : `https://x.com/${cfg.socials.x.replace('@','')}`}
                  target="_blank"
                  className="text-gray-300 hover:text-white underline"
                >
                  X/Twitter
                </a>
              )}
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div>
            {/* Tarjeta de donación (SOL/USDC) */}
            <DonateCard destination={cfg.donationAddress} cluster={CLUSTER} />
            <p className="text-xs text-gray-500 mt-2">
              Cluster: <code className="text-gray-300">{CLUSTER}</code>
            </p>
          </div>

          <aside className="rounded-2xl border border-gray-800 bg-gray-950 p-6 h-fit">
            <h2 className="text-lg font-semibold mb-3">Sobre {cfg.name}</h2>
            <p className="text-gray-300">{cfg.description || 'Gracias por apoyar este proyecto.'}</p>
            <div className="mt-4">
              <div className="text-sm text-gray-400">Wallet destino</div>
              <code className="text-sm text-gray-300 break-all">{cfg.donationAddress}</code>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
