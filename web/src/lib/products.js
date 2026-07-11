import { supabase } from "./supabase";
import { PRODUCTS as SEED_PRODUCTS } from "../data/products";

const COLUMNS = "id,name,brand,category,price,tag,used,condition,description,image_url,sold,sort_order";

// In-memory cache: avoids re-fetching from Supabase every time the user
// navigates between Home/Tienda within the same visit (protects free-tier egress).
let cache = null;
let cacheAt = 0;
const CACHE_TTL_MS = 60_000;

export async function fetchProducts({ force = false } = {}) {
  if (!force && cache && Date.now() - cacheAt < CACHE_TTL_MS) return cache;

  const { data, error } = await supabase
    .from("products")
    .select(COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  cache = data;
  cacheAt = Date.now();
  return data;
}

export function invalidateProductsCache() {
  cache = null;
}

export async function createProduct(payload) {
  const { data, error } = await supabase.from("products").insert(payload).select(COLUMNS).single();
  if (error) throw error;
  invalidateProductsCache();
  return data;
}

export async function updateProduct(id, patch) {
  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select(COLUMNS).single();
  if (error) throw error;
  invalidateProductsCache();
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  invalidateProductsCache();
}

export async function toggleSold(id, sold) {
  return updateProduct(id, { sold });
}

// Comprime en el navegador antes de subir para no gastar el límite de 300KB
// por archivo ni el espacio de storage del plan free.
async function compressImage(file, maxDim = 1000, quality = 0.8) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  return blob;
}

export async function uploadProductImage(file) {
  let blob = await compressImage(file);
  // Si sigue pesando más de 300KB (límite del bucket), bajamos más la calidad.
  if (blob.size > 300 * 1024) {
    blob = await compressImage(file, 900, 0.6);
  }
  if (blob.size > 300 * 1024) {
    throw new Error("La imagen sigue pesando más de 300KB incluso comprimida. Probá con otra foto.");
  }

  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

// Carga el catálogo inicial (los productos reales ya cargados a mano en
// src/data/products.js) a la base de datos, una sola vez, desde el panel admin.
export async function seedInitialCatalog() {
  const real = SEED_PRODUCTS.filter((p) => p.image);
  const rows = real.map((p, i) => ({
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price ?? null,
    tag: p.tag,
    used: !!p.used,
    condition: p.condition ?? null,
    description: p.desc ?? "",
    image_url: p.image,
    sort_order: i,
  }));
  const { error } = await supabase.from("products").insert(rows);
  if (error) throw error;
  invalidateProductsCache();
  return rows.length;
}
