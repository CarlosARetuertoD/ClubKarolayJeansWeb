/**
 * Redel — Anti fuerza bruta del login (lockout progresivo).
 *
 * Política:
 *   - 3 intentos fallidos → bloqueo de 15 minutos.
 *   - Al expirar el bloqueo los intentos se reinician, pero el "nivel" persiste:
 *     si vuelve a fallar 3 veces, el bloqueo se DUPLICA (30 min → 1 h → 2 h …,
 *     tope 24 h). Un login exitoso limpia todo.
 *   - Se traquea por USUARIO (protege una cuenta atacada desde muchas IPs) y
 *     por IP con umbral más alto (frena el barrido de muchos usuarios desde
 *     una misma IP sin castigar el typo de un solo empleado).
 *
 * Estado en memoria del proceso (igual que src/lib/cache.ts): válido para el
 * despliegue actual de una sola instancia. Si Redel pasa a múltiples réplicas,
 * mover este estado a la BD/Redis — y la defensa definitiva debe vivir también
 * en Django (ver hardening pendiente), porque Railway es alcanzable directo.
 */

interface LockEntry {
  fails: number;        // fallos desde el último bloqueo/reset
  level: number;        // cuántas veces ya se bloqueó (escala la duración)
  blockedUntil: number; // epoch ms; 0 = no bloqueado
  updatedAt: number;    // para limpieza de entradas viejas
}

const store = new Map<string, LockEntry>();

const BASE_BLOCK_MS = 15 * 60 * 1000;       // primer bloqueo: 15 min
const MAX_BLOCK_MS = 24 * 60 * 60 * 1000;   // tope: 24 h
const ENTRY_TTL_MS = 48 * 60 * 60 * 1000;   // olvidar historial tras 48 h sin actividad
const CLEANUP_EVERY = 50;                   // limpieza perezosa cada N accesos

export const MAX_INTENTOS_USUARIO = 3;
export const MAX_INTENTOS_IP = 10;

let accessCount = 0;
function lazyCleanup() {
  if (++accessCount % CLEANUP_EVERY !== 0) return;
  const now = Date.now();
  // forEach en vez de for...of: compatible con target TS < es2015 (Next 14)
  store.forEach((e, k) => {
    if (now - e.updatedAt > ENTRY_TTL_MS && e.blockedUntil < now) store.delete(k);
  });
}

function getEntry(key: string): LockEntry {
  let e = store.get(key);
  if (!e) {
    e = { fails: 0, level: 0, blockedUntil: 0, updatedAt: Date.now() };
    store.set(key, e);
  }
  return e;
}

function blockDurationMs(level: number): number {
  return Math.min(BASE_BLOCK_MS * 2 ** Math.max(0, level - 1), MAX_BLOCK_MS);
}

export interface EstadoBloqueo {
  bloqueado: boolean;
  restanteMs: number;
  intentosRestantes: number;
}

/** ¿Está bloqueado este key ahora mismo? (no consume intento) */
export function estadoBloqueo(key: string, maxIntentos: number): EstadoBloqueo {
  lazyCleanup();
  const e = store.get(key);
  const now = Date.now();
  if (!e) return { bloqueado: false, restanteMs: 0, intentosRestantes: maxIntentos };
  if (e.blockedUntil > now) {
    return { bloqueado: true, restanteMs: e.blockedUntil - now, intentosRestantes: 0 };
  }
  // Bloqueo vencido: los intentos se reinician, el nivel se conserva.
  if (e.blockedUntil !== 0) {
    e.blockedUntil = 0;
    e.fails = 0;
    e.updatedAt = now;
  }
  return { bloqueado: false, restanteMs: 0, intentosRestantes: Math.max(0, maxIntentos - e.fails) };
}

/** Registra un intento fallido. Devuelve el estado resultante. */
export function registrarFallo(key: string, maxIntentos: number): EstadoBloqueo {
  const e = getEntry(key);
  const now = Date.now();
  e.updatedAt = now;
  e.fails++;
  if (e.fails >= maxIntentos) {
    e.level++;
    e.blockedUntil = now + blockDurationMs(e.level);
    e.fails = 0;
    return { bloqueado: true, restanteMs: e.blockedUntil - now, intentosRestantes: 0 };
  }
  return { bloqueado: false, restanteMs: 0, intentosRestantes: maxIntentos - e.fails };
}

/** Login exitoso: limpia historial y nivel. */
export function registrarExito(...keys: string[]) {
  keys.forEach((k) => store.delete(k));
}

/** Texto humano del tiempo restante ("14 min", "1 h 30 min"). */
export function formatearRestante(ms: number): string {
  const totalMin = Math.ceil(ms / 60000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}
