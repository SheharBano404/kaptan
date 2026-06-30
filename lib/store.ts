import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import type { Order, Product } from "./types";
import { SEED_PRODUCTS } from "./seed";

/**
 * Storage adapter.
 *
 * - In production on Vercel with a Postgres integration connected (Neon),
 *   data is stored in a Postgres table `kv_store(key text primary key,
 *   value jsonb)`. The table is created automatically on first use.
 * - Locally (no Postgres connection string), data falls back to JSON files
 *   in /.data so the admin panel is fully functional during development.
 */

const PRODUCTS_KEY = "kl:products";
const ORDERS_KEY = "kl:orders";

// Neon/Vercel Postgres integration exposes the connection string under one
// of these env var names depending on how it was installed.
const POSTGRES_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const usePostgres = Boolean(POSTGRES_URL);

// ───────────────────────── Postgres (Neon) helpers ─────────────────────────
const sql = usePostgres ? neon(POSTGRES_URL as string) : null;

let tableReady: Promise<void> | null = null;
async function ensureTable(): Promise<void> {
  if (!sql) return;
  if (!tableReady) {
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      )
    `.then(() => undefined);
  }
  await tableReady;
}

async function pgGetJSON<T>(key: string): Promise<T | null> {
  await ensureTable();
  const rows = await sql!`SELECT value FROM kv_store WHERE key = ${key}`;
  if (!rows || rows.length === 0) return null;
  return rows[0].value as T;
}

async function pgSetJSON<T>(key: string, value: T): Promise<void> {
  await ensureTable();
  await sql!`
    INSERT INTO kv_store (key, value)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

// ───────────────────────── Local JSON fallback ─────────────────────────
// On Vercel (and most serverless platforms) the deployed filesystem is
// read-only except for /tmp, so when no Postgres is configured we must
// write there instead of process.cwd(). Note: /tmp is ephemeral per
// instance, so this is only a temporary fallback — connect a Postgres
// (Neon) integration on Vercel for persistent storage in production.
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
  return usePostgres ? pgGetJSON<T>(key) : fileGetJSON<T>(safeKey(key));
}

async function setJSON<T>(key: string, value: T): Promise<void> {
  return usePostgres ? pgSetJSON<T>(key, value) : fileSetJSON<T>(safeKey(key), value);
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

export const storageMode = usePostgres ? "postgres" : "file";