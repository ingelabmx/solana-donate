// src/app/sites/[tenant]/page.tsx
import SiteNav from '@/components/SiteNav';
import { notFound } from 'next/navigation';
import { TENANTS } from '@/tenants';
import TenantNav from '@/components/TenantNav';
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

  const socials = cfg.socials || {};

  return (
  <>
    <SiteNav />
    {/* ...contenido del subdominio... */}
  </>
);
}
