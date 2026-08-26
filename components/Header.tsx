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
    <header className="header-shell sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* En pantallas muy estrechas el logo se oculta: "inicio" ya está
              en el menú, así que es redundante y es lo que hacía que la
              cabecera no cupiese y arrastrase scroll lateral. */}
          <Link
            href="/"
            className="hidden shrink-0 items-center gap-2 font-mono text-xs font-bold tracking-tight text-ink min-[420px]:flex sm:gap-2.5 sm:text-sm"
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-accent"
            />
            pablo-redondo.dev
          </Link>
          <nav className="flex w-full min-w-0 items-center justify-between gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[420px]:w-auto min-[420px]:justify-end">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link text-mono-cmd rounded-md px-2.5 py-1.5 ${
                    isActive
                      ? "text-accent"
                      : "text-ink-meta hover:bg-bg-panel hover:text-ink"
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
