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
    <header className="border-b border-line">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-mono text-sm font-bold tracking-tight text-ink">
            pablo-redondo.dev
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-sm px-2 py-1 font-mono text-xs ${
                    isActive ? "text-accent" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  ~/{item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
}
