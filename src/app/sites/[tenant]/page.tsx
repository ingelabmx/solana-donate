// src/app/sites/[tenant]/page.tsx
import { notFound } from 'next/navigation';
import { TENANTS } from '@/tenants';
import DonateCard from '@/components/DonateCard';

const CLUSTER = (process.env.NEXT_PUBLIC_CLUSTER || 'devnet') as 'devnet' | 'mainnet-beta';

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const cfg = TENANTS[tenant];
  if (!cfg) return notFound();

  return (
    <main className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-center">💸 {cfg.name}</h1>
      <DonateCard destination={cfg.donationAddress} cluster={CLUSTER} />
      <div className="mt-6 text-sm text-gray-400 text-center">
        Subdominio: <code className="text-gray-300">{cfg.slug}</code>
        <br />
        Cluster: <code className="text-gray-300">{CLUSTER}</code>
      </div>
    </main>
  );
}
