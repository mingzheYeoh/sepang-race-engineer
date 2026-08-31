"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Paddock" },
  { href: "/track", label: "Circuit" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="mb-5 flex gap-2">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
            path === l.href
              ? "border-amber text-amber"
              : "border-line text-muted hover:text-text"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
