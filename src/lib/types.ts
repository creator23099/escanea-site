export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * A top-level navigation entry. Rendered by Navbar and Footer.
 * `href` is a Next.js App Router pathname.
 */
export interface NavItem {
  l: string;
  href: string;
}

export interface BrandsFormData {
  ciudad: string;
  zonas: string;
  presupuesto: string;
  objetivo: string[];
  problema: string[];
  empresa: string;
  whatsapp: string;
  email: string;
  instagram: string;
  comments: string;
}

export interface DriversFormData {
  ciudad: string;
  zonas: string[];
  zonasOtra: string;
  km: string;
  vehiculo: string;
  premium: string;
  nombre: string;
  whatsapp: string;
  email: string;
  notas: string;
}
