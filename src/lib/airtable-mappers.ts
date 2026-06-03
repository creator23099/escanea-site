/**
 * Pure mapping functions from the website's form payloads to the Airtable
 * record shape for the corresponding pipeline table. No I/O, no env reads,
 * no side effects — safe to unit-test by inspection.
 *
 * Driver submissions map 1:1 to the "Driver Form Submissions" table columns.
 * Ciudad and KM por mes use form values; willingness to carry ads is stored as Sí/No.
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
/* Drivers form → Driver Form Submissions table                               */
/* -------------------------------------------------------------------------- */

export function toDriverRecord(fd: DriversFormData): Record<string, unknown> {
  const dispuesto = fd.dispuestoPublicidad.trim();

  const record: Record<string, unknown> = {
    Ciudad: fd.ciudad.trim(),
    Zonas: buildZonasPayload(fd),
    "KM por mes": fd.km.trim(),
    Vehículo: fd.vehiculo.trim(),
    Nombre: fd.nombre.trim(),
    WhatsApp: fd.whatsapp.trim(),
    Email: fd.email.trim(),
    "Tipo de campaña": dispuesto,
    Estado: "Nuevo",
  };

  const notas = joinNotes([
    dispuesto ? `Dispuesto a llevar publicidad: ${dispuesto}` : null,
    fd.notas.trim() || null,
  ]);
  if (notas) record["Notas adicionales"] = notas;

  return record;
}
