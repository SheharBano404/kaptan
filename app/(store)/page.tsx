import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/store";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/types";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newIn = products.filter((p) => p.badge === "New").slice(0, 4);

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className="container-kl py-20">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-blood-glow">The collections</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">Find your armour</h2>
          </div>
          <Link href="/shop" className="link-underline text-sm font-semibold uppercase tracking-wider">
            View everything →
          </Link>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((c, i) => {
            const meta = CATEGORY_META[c];
            return (
              <Reveal key={c} delay={i * 0.06}>
                <Link
                  href={`/shop/${c}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-ink-line"
                >
                  <Image
                    src={meta.image}
                    alt={meta.label}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-2xl uppercase leading-none tracking-tight">
                      {meta.label}
                    </h3>
                    <p className="mt-1 text-xs text-bone-dim">{meta.blurb}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-blood-glow opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Shop now →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-ink-line bg-ink-soft/40 py-20">
        <div className="container-kl">
          <Reveal className="mb-10 text-center">
            <p className="eyebrow text-blood-glow">Hand-picked</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">Featured drops</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial */}
      <section className="container-kl py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-line">
              <Image
                src="/products/crimson-edge-1.jpeg"
                alt="Kaptan Leather craftsmanship"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-blood-glow">The craft</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              No shortcuts.<br />Only full-grain.
            </h2>
            <p className="mt-5 max-w-md text-bone-dim">
              Every Kaptan piece begins with responsibly-sourced hides, hand-cut
              panels and reinforced stress seams. From the studded biker to the
              CE-armoured race suit, we build gear that earns its scars.
            </p>
            <ul className="mt-7 grid grid-cols-3 gap-4">
              {[
                ["100%", "Full-grain leather"],
                ["CE", "Rated armour"],
                ["30d", "Easy returns"],
              ].map(([k, v]) => (
                <li key={k} className="card-surface p-4">
                  <p className="font-display text-3xl text-blood-glow">{k}</p>
                  <p className="mt-1 text-xs text-bone-dim">{v}</p>
                </li>
              ))}
            </ul>
            <Link href="/shop/leather-jackets" className="btn-primary mt-8">
              Shop the leather
            </Link>
          </Reveal>
        </div>
      </section>

      {/* New in */}
      {newIn.length > 0 && (
        <section className="border-t border-ink-line bg-ink-soft/40 py-20">
          <div className="container-kl">
            <Reveal className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow text-blood-glow">Fresh on the rack</p>
                <h2 className="display mt-2 text-4xl sm:text-5xl">New in</h2>
              </div>
              <Link href="/shop" className="link-underline text-sm font-semibold uppercase tracking-wider">
                See all →
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {newIn.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
