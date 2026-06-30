const MESSAGES = [
  "Free UK delivery over £150",
  "Hand-finished full-grain leather",
  "30-day easy returns",
  "Track-grade CE armour",
  "Sublimated combat sportswear",
];

export function AnnouncementBar() {
  const row = [...MESSAGES, ...MESSAGES];
  return (
    <div className="relative z-[60] overflow-hidden border-b border-ink-line bg-blood text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2">
        {row.map((m, i) => (
          <span
            key={i}
            className="mx-6 text-[11px] font-semibold uppercase tracking-ultra"
          >
            {m}
            <span className="ml-12 opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
