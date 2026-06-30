"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { formatGBP } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, shipping, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const customer = {
      name: form.get("name"),
      email: form.get("email"),
      address: form.get("address"),
      city: form.get("city"),
      postcode: form.get("postcode"),
      country: form.get("country") || "United Kingdom",
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, customer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      clear();
      router.push(`/checkout/success?id=${data.id}&total=${data.total}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-kl grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="display text-5xl text-bone-dim">Nothing to check out</h1>
          <Link href="/shop" className="btn-primary mt-8">
            Shop all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-kl py-12 sm:py-16">
      <h1 className="display mb-10 text-5xl sm:text-6xl">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="mb-4 font-display text-xl uppercase tracking-tight">
              Contact
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Full name" placeholder="Jordan Vance" required />
              <Field name="email" type="email" label="Email" placeholder="you@email.com" required />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl uppercase tracking-tight">
              Delivery address
            </h2>
            <div className="grid gap-4">
              <Field name="address" label="Street address" placeholder="65 Rea Street" required />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field name="city" label="City" placeholder="Birmingham" required />
                <Field name="postcode" label="Postcode" placeholder="B5 6BB" required />
                <Field name="country" label="Country" defaultValue="United Kingdom" required />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl uppercase tracking-tight">
              Payment
            </h2>
            <div className="card-surface p-5">
              <p className="text-sm text-bone-dim">
                This is a demo store — no real payment is taken. Click “Place
                order” to simulate a successful purchase.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 opacity-60">
                <Field name="card" label="Card number" placeholder="4242 4242 4242 4242" disabled />
                <Field name="exp" label="Expiry / CVC" placeholder="12/29 · 123" disabled />
              </div>
            </div>
          </section>

          {error && (
            <p className="rounded-lg border border-blood/40 bg-blood/10 px-4 py-3 text-sm text-blood-glow">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full !py-4">
            {submitting ? "Placing order…" : `Place order · ${formatGBP(total)}`}
          </button>
        </form>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card-surface p-6">
            <h2 className="mb-4 font-display text-2xl uppercase tracking-tight">
              Order
            </h2>
            <ul className="mb-4 max-h-72 space-y-3 overflow-y-auto">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border border-ink-line">
                    <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-blood text-[10px] font-bold text-white">
                      {l.qty}
                    </span>
                  </div>
                  <div className="flex flex-1 justify-between gap-2 text-sm">
                    <span>
                      {l.name}
                      <span className="block text-xs text-bone-dim">Size {l.size}</span>
                    </span>
                    <span>{formatGBP(l.price * l.qty)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-ink-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-bone-dim">Subtotal</dt>
                <dd>{formatGBP(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-bone-dim">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatGBP(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-line pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatGBP(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  ...rest
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input id={name} name={name} className="field" {...rest} />
    </div>
  );
}
