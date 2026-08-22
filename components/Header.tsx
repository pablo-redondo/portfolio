"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";

const NAV_ITEMS = [
  { href: "/", label: "inicio" },
  { href: "/proyectos", label: "proyectos" },
  { href: "/sobre-mi", label: "sobre-mi" },
  { href: "/contacto", label: "contacto" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm font-bold tracking-tight text-ink"
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-accent"
            />
            pablo-redondo.dev
          </Link>
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link rounded-md px-2.5 py-1.5 font-mono text-xs ${
                    isActive ? "text-accent" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="hidden sm:inline">~/</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
}
