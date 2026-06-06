/** Public page paths — single source of truth for navigation and internal links. */
export const ROUTES = {
  home: "/",
  marcas: "/marcas",
  conductores: "/conductores",
  porQue: "/por-que",
  campaign: (slug: string) => `/c/${slug}`,
} as const;
