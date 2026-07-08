/**
 * Server-side payload parsers for the public form API routes.
 *
 * The client validators in src/lib/validation.ts are per-step UX helpers
 * and can be bypassed (any client can POST anything to our routes). These
 * functions are the source of truth on the server: type-check every field,
 * cap text length defensively, enforce required fields, and validate email
 * shape. They return a typed `BrandsFormData` / `DriversFormData` ready
 * for the mappers.
 */

import { ADVERTISING_WILLINGNESS_OPTIONS } from "@/lib/drivers-form";
import type { BrandsFormData, DriversFormData } from "@/lib/types";

const MAX_TEXT = 5000;
const MAX_SHORT = 300;
const MAX_TINY = 100;
const EMAIL_RE = /\S+@\S+\.\S+/;

const isString = (v: unknown): v is string => typeof v === "string";
const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

const pickString = (raw: Record<string, unknown>, key: string, max: number): string => {
  const v = raw[key];
  return isString(v) ? v.slice(0, max) : "";
};

const pickStringArray = (raw: Record<string, unknown>, key: string): string[] => {
  const v = raw[key];
  if (!isArray(v)) return [];
  return v.filter(isString).slice(0, 20).map((s) => s.slice(0, MAX_TINY));
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v);

/* -------------------------------------------------------------------------- */
/* Brands payload                                                             */
/* -------------------------------------------------------------------------- */

export function parseBrandsPayload(raw: unknown): ParseResult<BrandsFormData> {
  if (!isPlainObject(raw)) return { ok: false, error: "Payload inválido." };

  const value: BrandsFormData = {
    ciudad: pickString(raw, "ciudad", MAX_TINY),
    zonas: pickString(raw, "zonas", MAX_TEXT),
    presupuesto: pickString(raw, "presupuesto", MAX_TINY),
    objetivo: pickStringArray(raw, "objetivo"),
    problema: pickStringArray(raw, "problema"),
    empresa: pickString(raw, "empresa", MAX_SHORT),
    whatsapp: pickString(raw, "whatsapp", MAX_TINY),
    email: pickString(raw, "email", MAX_SHORT),
    instagram: pickString(raw, "instagram", MAX_TINY),
    comments: pickString(raw, "comments", MAX_TEXT),
  };

  if (!value.empresa.trim()) return { ok: false, error: "El nombre de la empresa es obligatorio." };
  if (!value.whatsapp.trim()) return { ok: false, error: "El número de WhatsApp es obligatorio." };
  if (!value.email.trim() || !EMAIL_RE.test(value.email)) {
    return { ok: false, error: "Por favor ingresa un correo electrónico válido." };
  }

  return { ok: true, value };
}

/* -------------------------------------------------------------------------- */
/* Drivers payload                                                            */
/* -------------------------------------------------------------------------- */

export function parseDriversPayload(raw: unknown): ParseResult<DriversFormData> {
  if (!isPlainObject(raw)) return { ok: false, error: "Payload inválido." };

  const zonasStr = pickString(raw, "zonas", MAX_TEXT);
  const dispuestoRaw = raw.dispuestoPublicidad ?? raw.premium;
  let dispuestoPublicidad = "";
  if (isString(dispuestoRaw)) {
    dispuestoPublicidad = dispuestoRaw.slice(0, MAX_TEXT);
  } else if (dispuestoRaw === true) {
    dispuestoPublicidad = ADVERTISING_WILLINGNESS_OPTIONS[0];
  }

  const value: DriversFormData = {
    ciudad: pickString(raw, "ciudad", MAX_TINY),
    zonas: zonasStr ? [zonasStr] : [],
    zonasOtra: "",
    km: pickString(raw, "km", MAX_TINY),
    vehiculo: pickString(raw, "vehiculo", MAX_SHORT),
    dispuestoPublicidad,
    nombre: pickString(raw, "nombre", MAX_SHORT),
    whatsapp: pickString(raw, "whatsapp", MAX_TINY),
    email: pickString(raw, "email", MAX_SHORT),
    notas: pickString(raw, "notas", MAX_TEXT),
  };

  if (value.ciudad !== "Medellín" && value.ciudad !== "Bogotá") {
    return { ok: false, error: "Por favor selecciona tu ciudad." };
  }
  if (!zonasStr.trim()) return { ok: false, error: "Por favor indica al menos una zona." };
  if (!value.km.trim()) return { ok: false, error: "Por favor selecciona tus kilómetros promedio al mes." };
  if (!value.nombre.trim()) return { ok: false, error: "Por favor ingresa tu nombre." };
  if (!value.whatsapp.trim()) return { ok: false, error: "Por favor ingresa tu número de WhatsApp." };
  if (!value.email.trim() || !EMAIL_RE.test(value.email)) {
    return { ok: false, error: "Por favor ingresa un correo electrónico válido." };
  }
  if (!value.vehiculo.trim()) return { ok: false, error: "Por favor ingresa los datos de tu vehículo." };
  if (!value.dispuestoPublicidad.trim()) {
    return { ok: false, error: "Por favor selecciona una opción." };
  }
  if (
    !ADVERTISING_WILLINGNESS_OPTIONS.includes(
      value.dispuestoPublicidad as (typeof ADVERTISING_WILLINGNESS_OPTIONS)[number]
    )
  ) {
    return { ok: false, error: "Por favor selecciona Sí o No." };
  }

  return { ok: true, value };
}
