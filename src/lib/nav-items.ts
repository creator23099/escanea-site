import type { NavItem } from "@/lib/types";
import { ROUTES } from "@/lib/routes";

/**
 * Single source of truth for the top-level navigation entries.
 * Lives in its own module so both server (Footer) and client (Navbar)
 * components can import it without crossing the client boundary —
 * importing data from a "use client" file into a server component
 * makes Next.js treat the export as a client reference, which breaks
 * server-side `.map()` calls during prerender.
 */
export const NAV_ITEMS: NavItem[] = [
  { l: "Inicio",        href: ROUTES.home },
  { l: "Marcas",        href: ROUTES.marcas },
  { l: "Conductores",   href: ROUTES.conductores },
  { l: "Por Qué Ahora", href: ROUTES.porQue },
];
