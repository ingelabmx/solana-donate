// middleware.ts (RAÍZ)
import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // No interceptar rutas internas/estáticas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/sites') ||  // evita loop
    pathname.startsWith('/api') ||
    /\.\w+$/.test(pathname)           // archivos con extensión
  ) {
    return NextResponse.next();
  }

  // Hostname real (maneja proxies)
  const hostHeader = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  const hostNoPort = hostHeader.split(':')[0].toLowerCase();   // ej: "eric.localhost"
  const labels = hostNoPort.split('.');

  let sub = '';

  // Dev: *.localhost → subdominio
  if (labels.at(-1) === 'localhost' && labels.length >= 2) {
    sub = labels[0]; // "eric" en "eric.localhost"
  }

  // Alternativas útiles de testing: *.nip.io o *.sslip.io
  const last2 = labels.slice(-2).join('.');
  if ((last2 === 'nip.io' || last2 === 'sslip.io') && labels.length >= 4) {
    // eric.127.0.0.1.nip.io → "eric"
    sub = labels[0];
  }

  // Producción: si usas un dominio real
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || '').toLowerCase(); // ej: "tuapp.com"
  if (root && (hostNoPort === root || hostNoPort.endsWith(`.${root}`))) {
    const s = hostNoPort.replace(`.${root}`, '');
    if (s && s !== root) sub = s;
  }

  if (sub && sub !== 'www') {
    url.pathname = `/sites/${sub}${pathname}`; // reescribe a /sites/<sub>/*
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a todo excepto _next, sites, api y archivos
  matcher: ['/((?!_next|sites|api|.*\\..*).*)'],
};
