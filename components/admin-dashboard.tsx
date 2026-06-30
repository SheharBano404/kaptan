"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, Order, Product } from "@/lib/types";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { Logo } from "./logo";
import { ProductEditor } from "./product-editor";

type Tab = "products" | "orders";

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const [p, o] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
    ]);
    setProducts(p);
    setOrders(o);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function setOrderStatus(id: string, status: Order["status"]) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const lowStock = products.filter((p) => p.stock <= 5).length;
    return { products: products.length, orders: orders.length, revenue, lowStock };
  }, [products, orders]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink-line bg-ink/90 backdrop-blur-xl">
        <div className="container-kl flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full border border-ink-line px-3 py-1 text-[11px] uppercase tracking-ultra text-bone-dim sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost !py-2 text-xs">
              View store
            </Link>
            <button onClick={logout} className="btn-ghost !py-2 text-xs">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-kl py-10">
        <h1 className="display text-5xl">Dashboard</h1>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Products" value={String(stats.products)} />
          <Stat label="Orders" value={String(stats.orders)} />
          <Stat label="Revenue" value={formatGBP(stats.revenue)} accent />
          <Stat label="Low stock" value={String(stats.lowStock)} />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex items-center justify-between border-b border-ink-line">
          <div className="flex gap-1">
            {(["products", "orders"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-3 text-sm font-semibold uppercase tracking-wider transition ${
                  tab === t ? "text-bone" : "text-bone-dim hover:text-bone"
                }`}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="admin-tab"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-blood"
                  />
                )}
              </button>
            ))}
          </div>
          {tab === "products" && (
            <button onClick={() => setCreating(true)} className="btn-primary !py-2 text-xs">
              + Add product
            </button>
          )}
        </div>

        {loading ? (
          <p className="py-16 text-center text-bone-dim">Loading…</p>
        ) : tab === "products" ? (
          <ProductsTable
            products={products}
            onEdit={setEditing}
            onDelete={deleteProduct}
          />
        ) : (
          <OrdersTable orders={orders} onStatus={setOrderStatus} />
        )}
      </div>

      <AnimatePresence>
        {(editing || creating) && (
          <ProductEditor
            product={editing}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSaved={(saved) => {
              setProducts((prev) => {
                const idx = prev.findIndex((p) => p.id === saved.id);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = saved;
                  return next;
                }
                return [saved, ...prev];
              });
              setEditing(null);
              setCreating(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card-surface p-5">
      <p className="text-xs uppercase tracking-wider text-bone-dim">{label}</p>
      <p className={`mt-2 font-display text-3xl ${accent ? "text-blood-glow" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function ProductsTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const list = products.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          All ({products.length})
        </Chip>
        {CATEGORY_ORDER.map((c) => (
          <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
            {CATEGORY_META[c].label}
          </Chip>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-line">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-dim">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 overflow-hidden rounded border border-ink-line">
                      <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-bone-dim">
                  {CATEGORY_META[p.category].label}
                </td>
                <td className="px-4 py-3">{formatGBP(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 5 ? "text-brass" : ""}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  {p.featured && (
                    <span className="mr-1 rounded-full bg-blood/15 px-2 py-0.5 text-[10px] uppercase text-blood-glow">
                      Featured
                    </span>
                  )}
                  {p.badge && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase text-bone-dim">
                      {p.badge}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-full border border-ink-line px-3 py-1.5 text-xs hover:border-bone"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="rounded-full border border-ink-line px-3 py-1.5 text-xs text-blood-glow hover:border-blood"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTable({
  orders,
  onStatus,
}: {
  orders: Order[];
  onStatus: (id: string, status: Order["status"]) => void;
}) {
  if (orders.length === 0) {
    return (
      <p className="py-16 text-center text-bone-dim">
        No orders yet. They’ll appear here after checkout.
      </p>
    );
  }
  const STATUSES: Order["status"][] = ["pending", "paid", "shipped", "cancelled"];
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-line">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-dim">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-line">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
              <td className="px-4 py-3">
                <span className="block font-medium">{o.customer.name}</span>
                <span className="text-xs text-bone-dim">{o.customer.email}</span>
              </td>
              <td className="px-4 py-3 text-bone-dim">
                {o.items.reduce((s, i) => s + i.qty, 0)}
              </td>
              <td className="px-4 py-3 font-semibold">{formatGBP(o.total)}</td>
              <td className="px-4 py-3 text-bone-dim">
                {new Date(o.createdAt).toLocaleDateString("en-GB")}
              </td>
              <td className="px-4 py-3">
                <select
                  value={o.status}
                  onChange={(e) => onStatus(o.id, e.target.value as Order["status"])}
                  className="rounded-full border border-ink-line bg-ink-soft px-3 py-1.5 text-xs outline-none focus:border-blood"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-blood bg-blood text-white"
          : "border-ink-line text-bone-dim hover:border-bone hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}
