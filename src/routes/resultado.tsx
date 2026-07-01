import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Pause, Download, Share2, Sparkles } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

export const Route = createFileRoute("/resultado")({
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const generatedLyrics = useMusicStore((s) => s.generatedLyrics);
  const selectedStyle = useMusicStore((s) => s.selectedStyle);
  const audioUrl = useMusicStore((s) => s.audioUrl);

  const title = generatedLyrics.split("\n")[0] || "Tua Graça Me Alcançou";
  const lyricsBody = generatedLyrics.split("\n").slice(1).join("\n").trim();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Sua música</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-gradient-brand">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estilo {selectedStyle || "Acústico"} · 2:34
        </p>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-brand-pink/30 to-brand-violet/40 p-6">
        <div className="mx-auto aspect-square w-40 rounded-2xl btn-gradient shadow-2xl" />
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full btn-gradient"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
          </button>
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div className={`h-full rounded-full bg-white transition-all ${playing ? "w-2/3" : "w-1/4"}`} />
            </div>
            <div className="flex justify-between text-[11px] text-white/70">
              <span>{playing ? "1:32" : "0:00"}</span>
              <span>2:34</span>
            </div>
          </div>
        </div>
        {audioUrl && (
          <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/60">
            Prévia · 30s
          </p>
        )}
      </div>

      {lyricsBody && (
        <div className="rounded-2xl border border-border/60 bg-surface p-5">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Letra
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{lyricsBody}</pre>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-surface py-3 text-sm font-semibold">
          <Download className="h-4 w-4" /> Prévia
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-surface py-3 text-sm font-semibold">
          <Share2 className="h-4 w-4" /> Compartilhar
        </button>
      </div>

      <button
        onClick={() => navigate({ to: "/login" })}
        className="mt-auto w-full rounded-2xl btn-gradient py-4 text-base font-bold"
      >
        Obter Música Completa
      </button>
    </div>
  );
}
