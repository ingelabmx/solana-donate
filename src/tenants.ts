// src/tenants.ts
export type Tenant = {
  slug: string;                 // subdominio
  name: string;                 // nombre público a mostrar
  donationAddress: string;      // wallet SPL/SOL donde recibe donaciones
  ownerWallet: string;          // wallet del dueño (login con wallet)
  description?: string;
  socials?: {
    twitter?: string;           // url completa o @handle
    instagram?: string;
    github?: string;
    website?: string;
  };
  avatarUrl?: string;
  coverUrl?: string;
  theme?: 'dark' | 'light';
};

export const TENANTS: Record<string, Tenant> = {
  eric: {
    slug: 'eric',
    name: 'Eric Donations',
    donationAddress: 'CizD8893JhSMsuGLEXJPFPAYZCKKumgxPwRHFWNqmkJy',
    ownerWallet: 'CizD8893JhSMsuGLEXJPFPAYZCKKumgxPwRHFWNqmkJy', // por ahora igual que donationAddress
    description:
      'Ayudo a proyectos web3. Tu donación en SOL/USDC se usa para construir herramientas abiertas.',
    socials: {
      twitter: 'https://x.com/tu_usuario',
      github: 'https://github.com/ingelabmx',
      website: 'https://jerseyware.com',
    },
    coverUrl: '',
  },
};
