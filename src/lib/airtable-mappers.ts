/**
 * Pure mapping functions from the website's form payloads to the Airtable
 * record shape for the corresponding pipeline table. No I/O, no env reads,
 * no side effects — safe to unit-test by inspection.
 *
 * Locked decisions (documented inline below) match the mapping plan that
 * was shown before implementation:
 *
 *   - Bogotá → Zone="Bogotá Otra"  (form doesn't ask sub-zone)
 *   - km "1.000 – 2.500 km" → Avg KM/month="1000-2000"  (lossy)
 *   - km "2.500 – 5.000 km" → Avg KM/month="3000-4000"  (lossy)
 *   - Drivers email → Notes only  (no Email column on Drivers in live schema)
 *   - premium choice → Notes only   (Vehicle Type left blank for ops)
 *
 * The raw form values are preserved in Notes so any future schema fix is
 * reversible without data loss.
 */

import { buildZonasPayload } from "@/lib/drivers-form";
import type { BrandsFormData, DriversFormData } from "@/lib/types";

const todayISO = (): string => new Date().toISOString().slice(0, 10);

const joinNotes = (lines: (string | null)[]): string =>
  lines.filter((l): l is string => Boolean(l && l.length)).join("\n");

/* -------------------------------------------------------------------------- */
/* Brands form → Advertisers table                                            */
/* -------------------------------------------------------------------------- */

export function toAdvertiserRecord(fd: BrandsFormData): Record<string, unknown> {
  const empresa = fd.empresa.trim();
  const whatsapp = fd.whatsapp.trim();
  const email = fd.email.trim();
  const zonas = fd.zonas.trim();
  const instagram = fd.instagram.trim();
  const comments = fd.comments.trim();

  const record: Record<string, unknown> = {
    "Company Name": empresa,
    "Contact WhatsApp": whatsapp,
    "Contact Email": email,
    Status: "Lead",
    Source: "Inbound",
    "First Contact Date": todayISO(),
  };

  if (zonas) record["Zone of Interest"] = zonas;

  const notes = joinNotes([
    fd.ciudad ? `Ciudad: ${fd.ciudad}` : null,
    fd.presupuesto ? `Presupuesto: ${fd.presupuesto}` : null,
    fd.objetivo.length ? `Objetivo: ${fd.objetivo.join(", ")}` : null,
    fd.problema.length ? `Problema: ${fd.problema.join(", ")}` : null,
    instagram ? `Instagram: ${instagram}` : null,
    comments ? `Comentarios:\n${comments}` : null,
  ]);
  if (notes) record.Notes = notes;

  return record;
}

/* -------------------------------------------------------------------------- */
/* Drivers form → Drivers table                                               */
/* -------------------------------------------------------------------------- */

const DRIVER_ZONE_MAP: Record<string, string> = {
  // Form doesn't collect a Bogotá sub-zone; ops team refines from Notes.
  "Bogotá": "Bogotá Otra",
  "Medellín": "Medellín",
};

const DRIVER_KM_MAP: Record<string, string> = {
  "Menos de 1.000 km / mes": "<1000",
  "1.000 – 2.000 km / mes": "1000-2000",
  "2.000 – 3.000 km / mes": "2000-3000",
  "3.000 – 4.000 km / mes": "3000-4000",
  "Más de 4.000 km / mes": "4000+",
};

export function toDriverRecord(fd: DriversFormData): Record<string, unknown> {
  const nombre = fd.nombre.trim();
  const whatsapp = fd.whatsapp.trim();
  const email = fd.email.trim();
  const vehiculo = fd.vehiculo.trim();
  const zonas = buildZonasPayload(fd);
  const notas = fd.notas.trim();

  const record: Record<string, unknown> = {
    "Driver Name": nombre,
    WhatsApp: whatsapp,
    Status: "Waitlist",
    Source: "Form",
    "Sign-up Date": todayISO(),
  };

  if (vehiculo) record["Vehicle Make/Model"] = vehiculo;

  const zone = DRIVER_ZONE_MAP[fd.ciudad];
  if (zone) record.Zone = zone;

  const km = DRIVER_KM_MAP[fd.km];
  if (km) record["Avg KM/month"] = km;

  const notes = joinNotes([
    fd.ciudad ? `Ciudad: ${fd.ciudad}` : null,
    zonas ? `Zonas: ${zonas}` : null,
    fd.km ? `KM/mes (form): ${fd.km}` : null,
    email ? `Email: ${email}` : null,
    fd.premium ? `Campaña: ${fd.premium}` : null,
    notas ? `Notas:\n${notas}` : null,
  ]);
  if (notes) record.Notes = notes;

  return record;
}
