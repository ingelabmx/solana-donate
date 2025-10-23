import SiteNav from '@/components/SiteNav';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <SiteNav />
      {/* Hero */}
      <section className="relative">
        <div className="h-40 md:h-56 w-full bg-gradient-to-r from-indigo-800/40 to-fuchsia-700/30" />
        <div className="mx-auto max-w-6xl px-4 -mt-8 md:-mt-10">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 md:p-8 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold">Donaciones en Solana, sin custodia</h1>
            <p className="mt-3 text-gray-300 max-w-2xl">
              Crea tu página de donación con subdominio propio. Recibe aportes en SOL y USDC directo a tu wallet.
              Inicio de sesión sólo con wallet. Preparado para historial y analytics.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard?tab=mine"
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Mis subdominios
              </Link>
              <Link
                href="/dashboard?new=1"
                className="px-5 py-2 rounded-lg border border-gray-700 hover:bg-gray-900 font-medium"
              >
                Crear nuevo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <h3 className="font-semibold mb-2">Subdominios por usuario</h3>
          <p className="text-gray-400 text-sm">Cada creador/ONG tiene su propio link (p. ej. <code>tusitio.com</code> o <code>sub.tusitio.com</code>).</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <h3 className="font-semibold mb-2">SOL y USDC</h3>
          <p className="text-gray-400 text-sm">Donaciones rápidas y baratas. Sin custodios, directo a tu wallet.</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <h3 className="font-semibold mb-2">Listo para dashboard</h3>
          <p className="text-gray-400 text-sm">En el futuro: historial de donaciones (hechas/recibidas) y export.</p>
        </div>
      </section>
    </>
  );
}
