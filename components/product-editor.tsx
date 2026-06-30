"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Category, Product } from "@/lib/types";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/types";

interface Form {
  name: string;
  slug: string;
  category: Category;
  price: string;
  compareAt: string;
  stock: string;
  badge: string;
  featured: boolean;
  description: string;
  details: string;
  colors: string;
  sizes: string;
  images: string[];
}

function toForm(p: Product | null): Form {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "leather-jackets",
    price: p ? String(p.price) : "",
    compareAt: p?.compareAt ? String(p.compareAt) : "",
    stock: p ? String(p.stock) : "10",
    badge: p?.badge ?? "",
    featured: p?.featured ?? false,
    description: p?.description ?? "",
    details: (p?.details ?? []).join("\n"),
    colors: (p?.colors ?? []).join(", "),
    sizes: (p?.sizes ?? ["S", "M", "L", "XL", "2XL"]).join(", "),
    images: p?.images ?? [],
  };
}

export function ProductEditor({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (p: Product) => void;
}) {
  const [form, setForm] = useState<Form>(() => toForm(product));
  const [assets, setAssets] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/assets")
      .then((r) => (r.ok ? r.json() : []))
      .then(setAssets)
      .catch(() => setAssets([]));
  }, []);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleImage(src: string) {
    setForm((f) => ({
      ...f,
      images: f.images.includes(src)
        ? f.images.filter((i) => i !== src)
        : [...f.images, src],
    }));
  }

  async function handleSave() {
    setError(null);
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (form.images.length === 0) {
      setError("Select at least one image.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      category: form.category,
      price: Number(form.price) || 0,
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      stock: Number(form.stock) || 0,
      badge: form.badge.trim() || undefined,
      featured: form.featured,
      description: form.description.trim(),
      details: form.details
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: form.images,
    };
    try {
      const res = product
        ? await fetch(`/api/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Save failed");
      }
      onSaved(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 260 }}
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-ink-line bg-ink-soft"
      >
        <div className="flex items-center justify-between border-b border-ink-line px-6 py-4">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            {product ? "Edit product" : "New product"}
          </h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-line hover:border-bone"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <Row>
            <Input label="Name" value={form.name} onChange={(v) => set("name", v)} />
            <Input
              label="Slug (optional)"
              value={form.slug}
              onChange={(v) => set("slug", v)}
              placeholder="auto-generated"
            />
          </Row>

          <Row>
            <div>
              <label className="label">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as Category)}
                className="field"
              >
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Badge (optional)"
              value={form.badge}
              onChange={(v) => set("badge", v)}
              placeholder="New, Bestseller…"
            />
          </Row>

          <Row cols={3}>
            <Input label="Price (£)" type="number" value={form.price} onChange={(v) => set("price", v)} />
            <Input
              label="Compare-at (£)"
              type="number"
              value={form.compareAt}
              onChange={(v) => set("compareAt", v)}
              placeholder="optional"
            />
            <Input label="Stock" type="number" value={form.stock} onChange={(v) => set("stock", v)} />
          </Row>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="field resize-y"
            />
          </div>

          <div>
            <label className="label">Details (one per line)</label>
            <textarea
              value={form.details}
              onChange={(e) => set("details", e.target.value)}
              rows={4}
              className="field resize-y"
            />
          </div>

          <Row>
            <Input label="Colours (comma separated)" value={form.colors} onChange={(v) => set("colors", v)} />
            <Input label="Sizes (comma separated)" value={form.sizes} onChange={(v) => set("sizes", v)} />
          </Row>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-[#c1121f]"
            />
            <span className="text-sm">Feature on homepage</span>
          </label>

          <div>
            <label className="label">
              Images ({form.images.length} selected — click to add/remove)
            </label>
            <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto rounded-lg border border-ink-line p-2 sm:grid-cols-6">
              {assets.map((src) => {
                const idx = form.images.indexOf(src);
                const selected = idx >= 0;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => toggleImage(src)}
                    className={`relative aspect-[4/5] overflow-hidden rounded border-2 transition ${
                      selected ? "border-blood" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                    {selected && (
                      <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-blood text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
              {assets.length === 0 && (
                <p className="col-span-full p-3 text-xs text-bone-dim">
                  No images found in /public/products.
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-blood-glow">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-ink-line px-6 py-4">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={`grid gap-4 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}
