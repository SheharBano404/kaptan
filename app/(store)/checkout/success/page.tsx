import Link from "next/link";
import { SuccessConfetti } from "@/components/success-confetti";
import { formatGBP } from "@/lib/utils";

export const metadata = { title: "Order confirmed" };

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string; total?: string };
}) {
  const id = searchParams.id ?? "KL-XXXXXX";
  const total = Number(searchParams.total ?? 0);

  return (
    <div className="container-kl grid min-h-[70vh] place-items-center py-20 text-center">
      <SuccessConfetti />
      <div className="max-w-lg">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blood text-white">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="display mt-7 text-5xl sm:text-6xl">Order confirmed</h1>
        <p className="mt-4 text-bone-dim">
          Thank you — your order is in. We’ve sent a confirmation to your email.
          Your gear ships within 2 working days.
        </p>
        <div className="card-surface mx-auto mt-8 max-w-xs p-5 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-bone-dim">Order number</span>
            <span className="font-semibold">{id}</span>
          </div>
          {total > 0 && (
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-bone-dim">Total paid</span>
              <span className="font-semibold">{formatGBP(total)}</span>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="btn-primary">
            Keep shopping
          </Link>
          <Link href="/" className="btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
