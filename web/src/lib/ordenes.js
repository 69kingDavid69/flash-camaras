import { createClient } from "@supabase/supabase-js";
import { supabase as supabaseTienda } from "./supabase";

// Proyecto separado para órdenes (HU-14, opción A): si el sistema de órdenes
// agota su cuota, la tienda no se entera. Sin estas variables, cae al proyecto
// de la tienda (opción B).
const url = import.meta.env.VITE_ORDENES_SUPABASE_URL;
const key = import.meta.env.VITE_ORDENES_SUPABASE_PUBLISHABLE_KEY;

const cliente =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, storageKey: "fc-ordenes" },
      })
    : supabaseTienda;

// Crockford base32: el token no usa I, L, O ni U. Si el cliente lo dicta o lo
// copia mal, se corrigen las confusiones típicas.
export function normalizarToken(texto) {
  return String(texto || "")
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
}

export const TOKEN_VALIDO = /^[0-9A-HJKMNP-TV-Z]{8}$/;

// Caché de 60 s en memoria, igual que el catálogo (lib/products.js): navegar
// y volver no vuelve a consultar. Sin polling ni Realtime (HU-10).
const cache = new Map();
const CACHE_TTL_MS = 60_000;

export async function consultarEstado(token, { force = false } = {}) {
  const t = normalizarToken(token);
  if (!TOKEN_VALIDO.test(t)) return null;
  const hit = cache.get(t);
  if (!force && hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;

  const { data, error } = await cliente.rpc("consultar_estado", { p_token: t });
  if (error) throw error;
  const fila = Array.isArray(data) ? data[0] ?? null : data;
  cache.set(t, { data: fila, at: Date.now() });
  return fila;
}

// Traducción a lenguaje de cliente (HU-09). La app ya sube el estado traducido
// a una clave pública; aquí solo se le pone texto.
export const ESTADOS = {
  recibido: { texto: "Recibido en el taller", paso: 1 },
  en_revision: { texto: "En revisión", paso: 2 },
  esperando_aprobacion: { texto: "Esperando tu aprobación", paso: 2 },
  en_reparacion: { texto: "En reparación", paso: 3 },
  esperando_repuesto: { texto: "Esperando repuesto", paso: 3 },
  listo_entrega: { texto: "¡Listo! Podés recogerlo", paso: 4 },
  entregado: { texto: "Entregado", paso: 5 },
  pasar_por_taller: { texto: "Pasá por el taller", paso: null },
};

export const PASOS = ["Recibido", "Revisión", "Reparación", "Listo", "Entregado"];
