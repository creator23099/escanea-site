/**
 * Server-only Airtable client.
 *
 * Convention: this module is only imported from `src/app/api/**` route
 * handlers (Node.js runtime). It is never imported from a Client
 * Component. There is no top-level `import "server-only"` because the
 * project does not depend on that package; the boundary is enforced by
 * import discipline plus the fact that `process.env.AIRTABLE_TOKEN` is
 * undefined in the client bundle (only `NEXT_PUBLIC_*` vars are inlined).
 *
 * Reads (at request time, not import time):
 *   - process.env.AIRTABLE_BASE_ID
 *   - process.env.AIRTABLE_TOKEN
 *
 * Validating inside the function (not at import time) keeps `next build`
 * green when env vars are absent; the API route returns 502 at runtime
 * instead of crashing the build.
 */

const AIRTABLE_API = "https://api.airtable.com/v0";
const TIMEOUT_MS = 10_000;

export type AirtableResult =
  | { ok: true; id: string }
  | { ok: false; status: number; error: string };

/**
 * POSTs a single record to the named table in the configured base.
 * `tableIdOrName` may be either the table id (`tblXXXX`) or the visible
 * name. Table ids are preferred for stability against renames.
 *
 * `typecast` is intentionally false: every singleSelect value sent by the
 * mappers is pre-validated against the live schema, so an unknown value
 * should fail loudly rather than be silently coerced.
 */
export async function createAirtableRecord(
  tableIdOrName: string,
  fields: Record<string, unknown>,
): Promise<AirtableResult> {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const token = process.env.AIRTABLE_TOKEN;
  if (!baseId || !token) {
    console.error("[airtable] missing AIRTABLE_BASE_ID or AIRTABLE_TOKEN env");
    return { ok: false, status: 0, error: "Airtable credentials missing" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `${AIRTABLE_API}/${baseId}/${encodeURIComponent(tableIdOrName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields, typecast: false }),
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const body = (await res.json()) as { error?: { message?: string; type?: string } };
        if (body.error?.message) detail = body.error.message;
        if (body.error?.type) detail = `${body.error.type}: ${detail}`;
      } catch {
        // ignore JSON parse failure; status alone is enough
      }
      // Safe to log: only status + Airtable error string, never the token.
      console.error("[airtable] create failed", { status: res.status, detail });
      return { ok: false, status: res.status, error: detail };
    }

    const body = (await res.json()) as { id?: string };
    if (!body.id) {
      console.error("[airtable] create returned 2xx without id");
      return { ok: false, status: 500, error: "Malformed Airtable response" };
    }
    return { ok: true, id: body.id };
  } catch (e) {
    const isAbort = (e as { name?: string } | null)?.name === "AbortError";
    const message = isAbort
      ? "Airtable request timed out"
      : e instanceof Error
        ? e.message
        : "Unknown Airtable error";
    console.error("[airtable] network error", { message });
    return { ok: false, status: 0, error: message };
  } finally {
    clearTimeout(timer);
  }
}
