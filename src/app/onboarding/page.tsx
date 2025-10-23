// src/app/page.tsx
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Plataforma de Donaciones en Solana</h1>
      <p className="opacity-80">
        Crea tu subdominio (p. ej., <code>mi-ong.tuapp.com</code>) y empieza a recibir donaciones en SOL y USDC.
      </p>
      <div className="mt-8 opacity-75 text-sm">
        Prueba local: <code>eric.localhost:3000</code> si añadiste el tenant <b>eric</b>.
      </div>
    </main>
  );
}
