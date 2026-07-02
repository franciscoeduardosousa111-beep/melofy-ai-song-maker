import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Music, Mic2, Guitar, Radio, Music2, Music3, Disc3, Piano, Cross } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { MUSIC_STYLES, type MusicStyle } from "@/lib/styles";

export const Route = createFileRoute("/estilo")({
  component: StylePage,
});

const STYLE_ICONS: Record<MusicStyle, typeof Music> = {
  "Pop BR": Music,
  "Trap/Rap": Mic2,
  Rock: Guitar,
  "Eletrônica": Radio,
  "Acústico": Music2,
  "MPB & Alt": Music3,
  "Anos 80": Disc3,
  "Clássica": Piano,
  Gospel: Cross,
};

const styles = MUSIC_STYLES.map((label) => ({ label, icon: STYLE_ICONS[label] }));

function StylePage() {
  const navigate = useNavigate();
  const selectedStyle = useMusicStore((s) => s.selectedStyle);
  const setSelectedStyle = useMusicStore((s) => s.setSelectedStyle);

  const handlePick = (label: MusicStyle) => {
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
