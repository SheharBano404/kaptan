import { NextResponse } from "next/server";
import {
  deleteProduct,
  getProductById,
  upsertProduct,
} from "@/lib/store";
import { isAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = await getProductById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await req.json()) as Partial<Product>;
  const name = (body.name ?? existing.name).trim();
  const updated: Product = {
    ...existing,
    name,
    slug: body.slug?.trim() || slugify(name),
    category: body.category ?? existing.category,
    price: body.price != null ? Number(body.price) : existing.price,
    compareAt:
      body.compareAt === undefined
        ? existing.compareAt
        : body.compareAt
        ? Number(body.compareAt)
        : undefined,
    description: body.description ?? existing.description,
    details: Array.isArray(body.details) ? body.details : existing.details,
    images:
      Array.isArray(body.images) && body.images.length
        ? body.images
        : existing.images,
    sizes:
      Array.isArray(body.sizes) && body.sizes.length
        ? body.sizes
        : existing.sizes,
    colors: Array.isArray(body.colors) ? body.colors : existing.colors,
    badge: body.badge === undefined ? existing.badge : body.badge?.trim() || undefined,
    featured: body.featured != null ? Boolean(body.featured) : existing.featured,
    stock: body.stock != null ? Number(body.stock) : existing.stock,
  };
  await upsertProduct(updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
