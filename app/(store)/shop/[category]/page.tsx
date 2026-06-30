import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/store";
import { ShopGrid } from "@/components/shop-grid";
import { Reveal } from "@/components/reveal";
import { CATEGORY_META, CATEGORY_ORDER, type Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const meta = CATEGORY_META[params.category as Category];
  return { title: meta ? meta.label : "Shop" };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category as Category;
  if (!CATEGORY_META[category]) notFound();

  const products = (await getProducts()).filter((p) => p.category === category);
  const meta = CATEGORY_META[category];

  return (
    <div className="container-kl py-12 sm:py-16">
      <Reveal className="mb-10">
        <p className="eyebrow text-blood-glow">Collection</p>
        <h1 className="display mt-2 text-5xl sm:text-6xl">{meta.label}</h1>
        <p className="mt-3 max-w-md text-bone-dim">{meta.blurb}</p>
      </Reveal>
      <ShopGrid products={products} activeCategory={category} />
    </div>
  );
}
