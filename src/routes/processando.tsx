import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/processando")({
  component: ProcessingPage,
});

const steps = [
  "Escolhendo as palavras certas...",
  "Ajustando a letra...",
  "Criando sua música...",
];

const lyrics = `Tua Graça Me Alcançou

Quando eu não tinha rumo, nem direção,
Veio um sopro de amor no meu coração.
A tua graça me alcançou,
E em silêncio, minha alma cantou.

Refrão:
Sou teu, sou teu, pra sempre vou cantar,
Tua graça é o meu lugar.`;

function ProcessingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Gerando sua música</h1>
        <p className="mt-1 text-sm text-muted-foreground">Isso leva alguns segundos.</p>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((s, i) => {
          const active = i === step && !done;
          const completed = i < step || done;
          return (
            <div
              key={s}
              className={`flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm transition-opacity ${
                i > step && !done ? "opacity-40" : "opacity-100"
              }`}
            >
              {active && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />}
              {completed && <Sparkles className="h-4 w-4 shrink-0 text-primary" />}
              {!active && !completed && <span className="h-4 w-4 shrink-0 rounded-full border border-border" />}
              <span>{s}</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-accent/40 to-surface p-5">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Prévia da letra
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{lyrics}</pre>
      </div>

      <button
        disabled={!done}
        onClick={() => navigate({ to: "/resultado" })}
        className="mt-auto w-full rounded-2xl btn-gradient py-4 text-base font-bold disabled:opacity-50"
      >
        {done ? "Ver resultado" : "Aguarde..."}
      </button>
    </div>
  );
}
