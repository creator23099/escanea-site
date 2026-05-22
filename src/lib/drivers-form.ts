import type { DriversFormData } from "@/lib/types";

export const DRIVERS_STEP_LABELS = [
  "Ciudad",
  "Zonas",
  "Kilómetros",
  "Vehículo",
  "Contacto",
  "Campaña",
  "Adicional",
] as const;

export const ZONES_MEDELLIN = [
  "El Poblado",
  "Laureles",
  "Envigado",
  "Sabaneta",
  "Belén",
  "La América",
  "Centro",
  "Bello",
  "Itagüí",
  "Aeropuerto / Llanogrande",
  "Otra",
] as const;

export const ZONES_BOGOTA = [
  "Chapinero",
  "Zona T / Rosales",
  "Usaquén",
  "Chicó",
  "La Candelaria",
  "Suba",
  "Centro",
  "Aeropuerto El Dorado",
  "Otra",
] as const;

export const KM_OPTIONS = [
  "Menos de 1.000 km / mes",
  "1.000 – 2.000 km / mes",
  "2.000 – 3.000 km / mes",
  "3.000 – 4.000 km / mes",
  "Más de 4.000 km / mes",
] as const;

export const PREMIUM_OPTIONS = [
  "Sí, me interesa ganar más con la campaña premium (vinilo en puertas + ventana = $400.000 COP / mes)",
  "Solo la campaña estándar (vinilo en puertas = $300.000 COP / mes)",
  "No estoy seguro — quiero saber más antes de decidir",
] as const;

export const INITIAL_DRIVERS: DriversFormData = {
  ciudad: "",
  zonas: [],
  zonasOtra: "",
  km: "",
  vehiculo: "",
  premium: "",
  nombre: "",
  whatsapp: "",
  email: "",
  notas: "",
};

export function zonesForCity(ciudad: string): readonly string[] {
  if (ciudad === "Medellín") return ZONES_MEDELLIN;
  if (ciudad === "Bogotá") return ZONES_BOGOTA;
  return [];
}

export function buildZonasPayload(fd: DriversFormData): string {
  return fd.zonas
    .map((z) => (z === "Otra" && fd.zonasOtra.trim() ? `Otra: ${fd.zonasOtra.trim()}` : z))
    .join(", ");
}

export function driversPayloadForApi(fd: DriversFormData): Record<string, string> {
  return {
    ciudad: fd.ciudad,
    zonas: buildZonasPayload(fd),
    km: fd.km,
    vehiculo: fd.vehiculo,
    premium: fd.premium,
    nombre: fd.nombre,
    whatsapp: fd.whatsapp,
    email: fd.email,
    notas: fd.notas,
  };
}
