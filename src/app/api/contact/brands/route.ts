/**
 * POST /api/contact/brands
 *
 * Accepts a JSON-encoded BrandsFormData payload, validates it server-side,
 * maps it into the Advertisers table shape, and creates one record via
 * the Airtable REST API. Returns `{ ok: true }` on confirmed creation,
 * `{ ok: false, error }` otherwise. The client only flips its success UI
 * after `ok: true` comes back.
 *
 * Notes:
 *   - `runtime = "nodejs"` so process.env is available and the Airtable
 *     PAT never reaches an edge runtime or the client bundle.
 *   - `dynamic = "force-dynamic"` because POST routes are inherently
 *     request-bound; this is mostly documentation since POST is never
 *     statically rendered, but it's defensive against future refactors.
 *   - Airtable-side errors are logged with status + message but the
 *     client receives a generic Spanish error to avoid leaking internals.
 */

import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { toAdvertiserRecord } from "@/lib/airtable-mappers";
import { parseBrandsPayload } from "@/lib/api-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADVERTISERS_TABLE_ID = "tblcFFcGLm3bmwSNe"; // "Advertisers"

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseBrandsPayload(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const result = await createAirtableRecord(ADVERTISERS_TABLE_ID, toAdvertiserRecord(parsed.value));
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar la solicitud. Intenta nuevamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
