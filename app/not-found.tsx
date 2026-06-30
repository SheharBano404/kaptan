import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5 text-center">
      <div>
        <p className="font-display text-[28vw] leading-none text-ink-line sm:text-[200px]">
          404
        </p>
        <h1 className="display -mt-6 text-3xl sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-bone-dim">
          This page took a wrong turn. Let’s get you back.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}
