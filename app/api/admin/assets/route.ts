import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

/** Lists product image files available in /public/products for the admin picker. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dir = path.join(process.cwd(), "public", "products");
    const files = await fs.readdir(dir);
    const images = files
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/products/${f}`);
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}
