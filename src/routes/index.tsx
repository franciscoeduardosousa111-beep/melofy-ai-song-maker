import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Cake, Heart, Church, Laugh, Flame, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const occasions = [
  { label: "Aniversário", icon: Cake },
  { label: "Declaração de amor", icon: Heart },
  { label: "Casamento", icon: Church },
  { label: "Pegadinha", icon: Laugh },
  { label: "Motivação", icon: Flame },
  { label: "Festa", icon: PartyPopper },
];

function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [desc, setDesc] = useState("");

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight">
          Vamos criar sua <span className="text-gradient-brand">música!</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Qual é a ocasião?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {occasions.map(({ label, icon: Icon }) => {
          const active = selected === label;
          return (
            <button
              key={label}
              onClick={() => setSelected(label)}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-transparent btn-gradient"
                  : "border-border/60 bg-surface hover:border-primary/50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-semibold leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">
          Ou descreva você mesmo
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descreva sua música..."
          rows={4}
          className="w-full resize-none rounded-2xl border border-border/60 bg-surface px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
        />
      </div>

      <button
        onClick={() => navigate({ to: "/estilo" })}
        className="mt-auto w-full rounded-2xl btn-gradient py-4 text-base font-bold"
      >
        Continuar
      </button>
    </div>
  );
}
