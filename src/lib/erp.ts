/**
 * ClubKarolayJeansWeb — cliente HTTP server-side hacia RedelERP (Railway).
 * Reemplaza a Supabase (2026-07-11): la web lee y escribe DIRECTO en RedelBD
 * vía los endpoints /api/web/ de Django.
 * La key X-Web-Key nunca llega al navegador: solo la usan las API routes de Next.
 */

const ERP_URL = (process.env.REDELERP_URL || "").replace(/\/$/, "");
const WEB_KEY = process.env.WEB_API_KEY || "";

function headers() {
  return {
    "X-Web-Key": WEB_KEY,
    "Content-Type": "application/json",
  };
}

export class ErpError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(typeof body === "object" && body && "error" in body ? String((body as { error: string }).error) : `RedelERP ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function erpGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${ERP_URL}/api/web/${path}`, {
    headers: headers(),
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ErpError(res.status, body);
  return body as T;
}

export async function erpSend<T = unknown>(method: "POST" | "PATCH", path: string, data: unknown): Promise<T> {
  const res = await fetch(`${ERP_URL}/api/web/${path}`, {
    method,
    headers: headers(),
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ErpError(res.status, body);
  return body as T;
}
