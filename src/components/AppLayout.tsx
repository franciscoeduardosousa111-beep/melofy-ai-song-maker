import { Link, useRouterState } from "@tanstack/react-router";
import { Music2 } from "lucide-react";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-5 py-4 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl btn-gradient">
            <Music2 className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-gradient-brand">
            Melofy
          </span>
        </Link>
        <span className="text-xs text-muted-foreground">
          {pathname === "/" ? "Início" : pathname.replace("/", "")}
        </span>
      </header>

      <main className="flex flex-1 flex-col px-5 pb-28 pt-6">{children}</main>

      <footer className="border-t border-border/40 px-5 py-4 text-center text-[11px] text-muted-foreground">
        Termos de uso e Política de privacidade
      </footer>
    </div>
  );
}
