import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/store";
import { ProductView } from "@/components/product-view";
import { ProductCard } from "@/components/product-card";
import { CATEGORY_META } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-kl py-8 sm:py-12">
      <nav className="mb-8 flex items-center gap-2 text-xs text-bone-dim">
        <Link href="/" className="hover:text-bone">Home</Link>
        <span>/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-bone">
          {CATEGORY_META[product.category].label}
        </Link>
        <span>/</span>
        <span className="text-bone">{product.name}</span>
      </nav>

      <ProductView product={product} />

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="display mb-8 text-3xl sm:text-4xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
