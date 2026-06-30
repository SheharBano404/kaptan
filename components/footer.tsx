import Link from "next/link";
import { Logo } from "./logo";
import { COMPANY } from "@/lib/company";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/types";

export function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink">
      {/* big marquee */}
      <div className="overflow-hidden border-b border-ink-line py-6">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="mx-8 font-display text-5xl uppercase tracking-tight text-ink-line"
            >
              Kaptan Leather <span className="text-blood">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-kl grid grid-cols-2 gap-8 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-dim">
            Hand-finished leather, track-grade racing suits and sublimated combat
            sportswear. Built for those who lead, not follow.
          </p>
          <div className="mt-5 flex gap-3">
            {["Instagram", "TikTok", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-line text-xs text-bone-dim transition hover:border-blood hover:text-bone"
                aria-label={s}
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Shop</h3>
          <ul className="space-y-2.5 text-sm text-bone-dim">
            {CATEGORY_ORDER.map((c) => (
              <li key={c}>
                <Link href={`/shop/${c}`} className="hover:text-bone">
                  {CATEGORY_META[c].label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="hover:text-bone">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Help</h3>
          <ul className="space-y-2.5 text-sm text-bone-dim">
            <li><Link href="/shop" className="hover:text-bone">Sizing guide</Link></li>
            <li><Link href="/shop" className="hover:text-bone">Shipping & returns</Link></li>
            <li><Link href="/shop" className="hover:text-bone">Track order</Link></li>
            <li><a href={`mailto:${COMPANY.email}`} className="hover:text-bone">Contact us</a></li>
            <li><Link href="/admin" className="hover:text-bone">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Newsletter</h3>
          <p className="mb-3 text-sm text-bone-dim">
            Drops, restocks & 10% off your first order.
          </p>
          <form className="flex overflow-hidden rounded-full border border-ink-line bg-ink-soft">
            <input
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-bone-dim/60"
            />
            <button className="bg-blood px-4 text-sm font-semibold text-white hover:bg-blood-glow">
              →
            </button>
          </form>
        </div>
      </div>

      {/* Companies House / registered details */}
      <div className="border-t border-ink-line">
        <div className="container-kl py-8">
          <h3 className="eyebrow mb-4">Registered company information</h3>
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Registered name" value={COMPANY.legalName} />
            <Detail label="Company status" value={COMPANY.status} />
            <Detail label="Company type" value={COMPANY.type} />
            <Detail label="Incorporated on" value={COMPANY.incorporatedOn} />
            <Detail label="Jurisdiction" value={COMPANY.jurisdiction} />
            <Detail label="Nature of business (SIC)" value={COMPANY.sic} />
            <div className="sm:col-span-2 lg:col-span-3">
              <dt className="text-xs uppercase tracking-wider text-bone-dim">
                Registered office address
              </dt>
              <dd className="mt-0.5 text-bone">{COMPANY.registeredOffice}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-ink-line">
        <div className="container-kl flex flex-col items-center justify-between gap-3 py-6 text-xs text-bone-dim sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/shop" className="hover:text-bone">Privacy</Link>
            <Link href="/shop" className="hover:text-bone">Terms</Link>
            <span>Registered in {COMPANY.jurisdiction}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-bone-dim">{label}</dt>
      <dd className="mt-0.5 text-bone">{value}</dd>
    </div>
  );
}
