import type { DriversFormData } from "@/lib/types";

export const DRIVERS_STEP_LABELS = [
  "Ciudad principal donde manejas",
  "Zonas que manejas con más frecuencia",
  "Kilómetros promedio que manejas al mes",
  "Vehículo: año, marca, modelo y color",
  "Información de contacto",
  "Publicidad en tu vehículo",
  "Información adicional",
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

export const ADVERTISING_WILLINGNESS_OPTIONS = ["Sí", "No"] as const;

export const INITIAL_DRIVERS: DriversFormData = {
  ciudad: "",
  zonas: [],
  zonasOtra: "",
  km: "",
  vehiculo: "",
  dispuestoPublicidad: "",
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
    dispuestoPublicidad: fd.dispuestoPublicidad,
    nombre: fd.nombre,
    whatsapp: fd.whatsapp,
    email: fd.email,
    notas: fd.notas,
  };
}
