import type { Metadata } from "next";
import { getProducts } from "@/lib/store";
import { ShopGrid } from "@/components/shop-grid";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop all" };

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="container-kl py-12 sm:py-16">
      <Reveal className="mb-10">
        <p className="eyebrow text-blood-glow">The full range</p>
        <h1 className="display mt-2 text-5xl sm:text-6xl">Shop all</h1>
      </Reveal>
      <ShopGrid products={products} />
    </div>
  );
}
