import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppLayout } from "../components/AppLayout";

function NotFoundComponent() {
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-extrabold text-gradient-brand">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">Página não encontrada</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl btn-gradient px-5 py-3 text-sm font-semibold">
          Voltar ao início
        </Link>
      </div>
    </AppLayout>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em alguns segundos.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-xl btn-gradient px-5 py-3 text-sm font-semibold"
        >
          Tentar de novo
        </button>
      </div>
    </AppLayout>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { name: "theme-color", content: "#1a0b2e" },
      { title: "Melofy — Gere sua música com IA" },
      { name: "description", content: "Crie músicas personalizadas com IA para qualquer ocasião." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </QueryClientProvider>
  );
}
