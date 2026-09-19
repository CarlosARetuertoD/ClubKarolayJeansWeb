/**
 * Sesión del club en el navegador (reemplaza a Supabase Auth, 2026-07-11).
 * El login/registro contra RedelERP devuelve los datos del cliente y se
 * guardan en localStorage. `id` ES el id de la fila web_clientes en RedelBD.
 */

export type ClubSession = {
  id: string;
  nombre: string;
  email: string | null;
  celular: string;
  dni: string | null;
  fecha_nacimiento: string | null;
  genero: string | null;
  auth_provider: string;
  created_at: string | null;
};

const KEY = "ckj_session_v2"; // Cache de interfaz; la identidad real está en la cookie HttpOnly.

export function getSession(): ClubSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as ClubSession;
    return s?.id ? s : null;
  } catch {
    return null;
  }
}

export function setSession(cliente: ClubSession) {
  localStorage.setItem(KEY, JSON.stringify(cliente));
  // Claves legadas que otras partes de la web ya usaban
  localStorage.setItem("ckj_cliente_id", cliente.id);
  if (cliente.nombre) localStorage.setItem("ckj_user_name", cliente.nombre);
}

export function clearSessionCache() {
  localStorage.removeItem(KEY);
  localStorage.removeItem("ckj_session");
  localStorage.removeItem("ckj_cliente_id");
  localStorage.removeItem("ckj_user_name");
  localStorage.removeItem("ckj_bio_cliente");
}

export async function clearSession() {
  const response = await fetch('/api/logout', { method: 'POST' });
  if (!response.ok) throw new Error('No se pudo cerrar sesión. Intenta nuevamente.');
  clearSessionCache();
}

export async function clubFetch(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store' });
  if (response.status === 401 && (!init?.method || init.method === 'GET')) {
    clearSessionCache();
    window.location.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    throw new Error('Tu sesión venció.');
  }
  return response;
}
