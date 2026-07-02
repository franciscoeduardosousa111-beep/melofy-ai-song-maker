import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Music, Mic2, Guitar, Radio, Music2, Music3, Disc3, Piano, Cross } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

export const Route = createFileRoute("/estilo")({
  component: StylePage,
});

const styles = [
  { label: "Pop BR", icon: Music },
  { label: "Trap/Rap", icon: Mic2 },
  { label: "Rock", icon: Guitar },
  { label: "Eletrônica", icon: Radio },
  { label: "Acústico", icon: Music2 },
  { label: "MPB & Alt", icon: Music3 },
  { label: "Anos 80", icon: Disc3 },
  { label: "Clássica", icon: Piano },
  { label: "Gospel", icon: Cross },
];

function StylePage() {
  const navigate = useNavigate();
  const selectedStyle = useMusicStore((s) => s.selectedStyle);
  const setSelectedStyle = useMusicStore((s) => s.setSelectedStyle);

  const handlePick = (label: string) => {
    setSelectedStyle(label);
    navigate({ to: "/processando" });
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight">
          Escolha o <span className="text-gradient-brand">estilo musical</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Cada estilo dá um clima único.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {styles.map(({ label, icon: Icon }) => {
          const active = selectedStyle === label;
          return (
            <button
              key={label}
              onClick={() => handlePick(label)}
              className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-transparent btn-gradient"
                  : "border-border/60 bg-surface hover:border-primary/50"
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${active ? "bg-white/20" : "bg-accent"}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (selectedStyle) navigate({ to: "/processando" });
        }}
        className="mt-auto w-full rounded-2xl btn-gradient py-4 text-base font-bold"
      >
        Gerar Música
      </button>
    </div>
  );
}
