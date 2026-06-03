/**
 * POST /api/contact/drivers
 *
 * Mirror of the brands handler. Accepts a JSON-encoded DriversFormData,
 * server-validates, maps to the Driver Form Submissions table, and creates one record.
 *
 * See src/app/api/contact/brands/route.ts for the shared design notes.
 */

import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { toDriverRecord } from "@/lib/airtable-mappers";
import { parseDriversPayload } from "@/lib/api-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIVERS_TABLE_ID = "tblD9UJ7g8J2QbZzb"; // "Driver Form Submissions"

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseDriversPayload(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const result = await createAirtableRecord(
    DRIVERS_TABLE_ID,
    toDriverRecord(parsed.value),
    { typecast: true },
  );
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el registro. Intenta nuevamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
