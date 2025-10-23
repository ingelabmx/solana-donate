// src/tenants.ts
export type Tenant = {
  slug: string;                     // subdominio
  name: string;                     // nombre público
  donationAddress: string;          // wallet pública receptora
  theme?: 'dark' | 'light';
};

export const TENANTS: Record<string, Tenant> = {
  // Ejemplos: cámbialos por los tuyos
  eric: {
    slug: 'eric',
    name: 'Eric Donations',
    donationAddress: '3Cy3eg9iu3xoGYnaE1mGhTs4ubdpDWcThWzt2poif93J',
    theme: 'dark',
  },
  acme: {
    slug: 'acme',
    name: 'ACME Foundation',
    donationAddress: '3Cy3eg9iu3xoGYnaE1mGhTs4ubdpDWcThWzt2poif93J',
    theme: 'dark',
  },
};
