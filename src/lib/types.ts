export interface AccordionItem {
  q: string;
  a: string;
}

export interface NavItem {
  l: string;
  p: Page;
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
  notas: string;
}

export interface DriversFormData {
  ciudad: string;
  zonas: string;
  km: string;
  vehiculo: string;
  premium: boolean;
  nombre: string;
  whatsapp: string;
  email: string;
  notas: string;
}

export type Page = "home" | "brands" | "drivers" | "why";

/** Single source of truth for the page-setter signature. */
export type SetPage = (p: Page) => void;
