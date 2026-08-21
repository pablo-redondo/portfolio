import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line py-8">
      <Container>
        <p className="font-mono text-xs text-ink-faint">
          pablo-redondo.dev — construido con Next.js
        </p>
      </Container>
    </footer>
  );
}
