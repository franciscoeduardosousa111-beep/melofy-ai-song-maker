import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useMusicStore, PROCESSING_STATUSES } from "@/stores/useMusicStore";

export const Route = createFileRoute("/processando")({
  component: ProcessingPage,
});

function ProcessingPage() {
  const navigate = useNavigate();
  const isGenerating = useMusicStore((s) => s.isGenerating);
  const processingStatus = useMusicStore((s) => s.processingStatus);
  const generatedLyrics = useMusicStore((s) => s.generatedLyrics);
  const audioUrl = useMusicStore((s) => s.audioUrl);
  const generateMusic = useMusicStore((s) => s.generateMusic);

  useEffect(() => {
    generateMusic();
  }, [generateMusic]);

  const currentIndex = PROCESSING_STATUSES.indexOf(processingStatus as typeof PROCESSING_STATUSES[number]);
  const done = !isGenerating && !!audioUrl;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Gerando sua música</h1>
        <p className="mt-1 text-sm text-muted-foreground">Isso leva alguns segundos.</p>
      </div>

      <div className="flex flex-col gap-3">
        {PROCESSING_STATUSES.map((s, i) => {
          const active = i === currentIndex && !done;
          const completed = i < currentIndex || done;
          return (
            <div
              key={s}
              className={`flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm transition-opacity ${
                i > currentIndex && !done ? "opacity-40" : "opacity-100"
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

      {generatedLyrics && (
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-accent/40 to-surface p-5">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Prévia da letra
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{generatedLyrics}</pre>
        </div>
      )}

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
