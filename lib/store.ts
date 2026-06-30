import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Order, Product } from "./types";
import { SEED_PRODUCTS } from "./seed";

/**
 * Storage adapter.
 *
 * - In production on Vercel with a Redis/KV integration connected
 *   (KV_REST_API_URL + KV_REST_API_TOKEN), data is stored in Upstash Redis
 *   over its REST API — no SDK required, so it survives the @vercel/kv
 *   deprecation and works with the Vercel Marketplace Redis integrations.
 * - Locally (no KV env vars), data falls back to JSON files in /.data so the
 *   admin panel is fully functional during development.
 */

const PRODUCTS_KEY = "kl:products";
const ORDERS_KEY = "kl:orders";

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const useKV = Boolean(KV_URL && KV_TOKEN);

// ───────────────────────── Upstash REST helpers ─────────────────────────
async function kvCommand<T = unknown>(command: unknown[]): Promise<T | null> {
  const res = await fetch(KV_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV command failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { result: T };
  return data.result ?? null;
}

async function kvGetJSON<T>(key: string): Promise<T | null> {
  const raw = await kvCommand<string>(["GET", key]);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function kvSetJSON<T>(key: string, value: T): Promise<void> {
  await kvCommand(["SET", key, JSON.stringify(value)]);
}

// ───────────────────────── Local JSON fallback ─────────────────────────
// On Vercel (and most serverless platforms) the deployed filesystem is
// read-only except for /tmp, so when no KV is configured we must write
// there instead of process.cwd(). Note: /tmp is ephemeral per-instance,
// so this is only a temporary fallback — connect a Redis/KV integration
// on Vercel for persistent storage in production.
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", ".data")
  : path.join(process.cwd(), ".data");

async function fileGetJSON<T>(key: string): Promise<T | null> {
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
    return JSON.parse(buf) as T;
  } catch {
    return null;
  }
}

async function fileSetJSON<T>(key: string, value: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${key}.json`),
    JSON.stringify(value, null, 2),
    "utf8"
  );
}

function safeKey(key: string) {
  return key.replace(/:/g, "_");
}

async function getJSON<T>(key: string): Promise<T | null> {
  return useKV ? kvGetJSON<T>(key) : fileGetJSON<T>(safeKey(key));
}

async function setJSON<T>(key: string, value: T): Promise<void> {
  return useKV ? kvSetJSON<T>(key, value) : fileSetJSON<T>(safeKey(key), value);
}

// ───────────────────────── Products ─────────────────────────
export async function getProducts(): Promise<Product[]> {
  const existing = await getJSON<Product[]>(PRODUCTS_KEY);
  if (existing && existing.length > 0) return existing;
  // First run — seed the store.
  await setJSON(PRODUCTS_KEY, SEED_PRODUCTS);
  return SEED_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function saveProducts(products: Product[]): Promise<void> {
  await setJSON(PRODUCTS_KEY, products);
}

export async function upsertProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.unshift(product);
  await saveProducts(products);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  await saveProducts(products.filter((p) => p.id !== id));
}

// ───────────────────────── Orders ─────────────────────────
export async function getOrders(): Promise<Order[]> {
  return (await getJSON<Order[]>(ORDERS_KEY)) ?? [];
}

export async function addOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  orders.unshift(order);
  await setJSON(ORDERS_KEY, orders);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    await setJSON(ORDERS_KEY, orders);
  }
}

export const storageMode = useKV ? "kv" : "file";
