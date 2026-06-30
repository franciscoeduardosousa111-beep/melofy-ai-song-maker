import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Apple } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight">
          Quase lá!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre para baixar sua música completa.
        </p>
      </div>

      <div className="my-4 grid place-items-center">
        <div className="h-24 w-24 rounded-3xl btn-gradient shadow-2xl" />
      </div>

      <button
        onClick={() => navigate({ to: "/planos" })}
        className="flex items-center justify-center gap-3 rounded-2xl bg-white py-4 text-sm font-bold text-neutral-900 shadow-lg"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar com Google
      </button>

      <button
        onClick={() => navigate({ to: "/planos" })}
        className="flex items-center justify-center gap-3 rounded-2xl border border-border/60 bg-surface py-4 text-sm font-bold"
      >
        <Apple className="h-5 w-5" /> Entrar com Apple
      </button>

      <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>

      <button className="flex items-center justify-center gap-3 rounded-2xl border border-border/60 bg-surface py-4 text-sm font-semibold text-muted-foreground">
        <Mail className="h-4 w-4" /> Mais opções de login
      </button>
    </div>
  );
}
