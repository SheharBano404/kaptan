import { NextResponse } from "next/server";
import { getProducts, upsertProduct } from "@/lib/store";
import { isAdmin } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as Partial<Product>;
  const id = body.id?.trim() || `p-${Date.now().toString(36)}`;
  const name = (body.name || "Untitled product").trim();
  const product: Product = {
    id,
    slug: body.slug?.trim() || slugify(name),
    name,
    category: body.category || "leather-jackets",
    price: Number(body.price) || 0,
    compareAt: body.compareAt ? Number(body.compareAt) : undefined,
    description: body.description || "",
    details: Array.isArray(body.details) ? body.details : [],
    images:
      Array.isArray(body.images) && body.images.length
        ? body.images
        : ["/products/rebel-classic-front.jpeg"],
    sizes:
      Array.isArray(body.sizes) && body.sizes.length
        ? body.sizes
        : ["S", "M", "L", "XL"],
    colors: Array.isArray(body.colors) ? body.colors : undefined,
    badge: body.badge?.trim() || undefined,
    featured: Boolean(body.featured),
    stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0,
  };
  await upsertProduct(product);
  return NextResponse.json(product, { status: 201 });
}
