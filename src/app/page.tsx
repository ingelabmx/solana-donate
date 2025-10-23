// src/app/page.tsx
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Plataforma de Donaciones en Solana</h1>
      <p className="opacity-80">
        Crea tu subdominio (p. ej., <code>mi-ong.tuapp.com</code>) y empieza a recibir donaciones en SOL y USDC.
      </p>

      <div className="mt-10 grid gap-4 text-left">
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="font-semibold mb-2">Cómo probar en desarrollo</h2>
          <ol className="list-decimal ml-5 space-y-1 text-sm opacity-80">
            <li>Edita <code>src/tenants.ts</code> y pon tu wallet en el tenant <b>eric</b>.</li>
            <li>Abre <code>http://eric.localhost:3000</code> en tu navegador.</li>
            <li>Conecta Phantom y haz una donación (SOL o USDC).</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
