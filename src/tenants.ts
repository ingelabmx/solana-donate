export type Tenant = {
  slug: string;                 // subdominio
  name: string;                 // nombre público
  donationAddress: string;      // wallet de recepción
  ownerWallet: string;          // wallet del dueño (login)
  description?: string;
  socials?: {
    instagram?: string;
    discord?: string;
    x?: string;                 // antes "twitter"
    // website?: string;        // opcional si quieres mantenerlo
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
    ownerWallet: 'CizD8893JhSMsuGLEXJPFPAYZCKKumgxPwRHFWNqmkJy',
    description: 'Ayudo a proyectos web3. Tu donación en SOL/USDC se usa para construir herramientas abiertas.',
    socials: {
      instagram: 'https://instagram.com/tu_usuario',
      discord: 'https://discord.gg/tu_invite',
      x: 'https://x.com/tu_usuario',
    },
  },
};
