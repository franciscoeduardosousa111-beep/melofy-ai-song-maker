import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useMusicStore, PROCESSING_STATUSES } from "@/stores/useMusicStore";
import { generateLyrics, generateMusic } from "@/lib/music.functions";

export const Route = createFileRoute("/processando")({
  component: ProcessingPage,
});

function ProcessingPage() {
  const navigate = useNavigate();
  const isGenerating = useMusicStore((s) => s.isGenerating);
  const processingStatus = useMusicStore((s) => s.processingStatus);
  const generatedLyrics = useMusicStore((s) => s.generatedLyrics);
  const audioUrl = useMusicStore((s) => s.audioUrl);
  const occasion = useMusicStore((s) => s.occasion);
  const selectedStyle = useMusicStore((s) => s.selectedStyle);
  const customDescription = useMusicStore((s) => s.customDescription);
  const setLyrics = useMusicStore((s) => s.setLyrics);
  const setAudioUrl = useMusicStore((s) => s.setAudioUrl);
  const setProcessingStatus = useMusicStore((s) => s.setProcessingStatus);
  const setIsGenerating = useMusicStore((s) => s.setIsGenerating);
  const setStep = useMusicStore((s) => s.setStep);

  const callLyrics = useServerFn(generateLyrics);
  const callMusic = useServerFn(generateMusic);
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        setError(null);
        setIsGenerating(true);
        setLyrics("");
        setAudioUrl(null);

        setProcessingStatus(PROCESSING_STATUSES[0]);
        const { lyrics } = await callLyrics({
          data: {
            occasion: occasion || "Personalizada",
            style: selectedStyle || "Pop BR",
            description: customDescription,
          },
        });

        setProcessingStatus(PROCESSING_STATUSES[1]);
        setLyrics(lyrics);

        setProcessingStatus(PROCESSING_STATUSES[2]);
        const title = lyrics.split("\n")[0]?.trim() || "Minha Música";
        const { audioUrl: url } = await callMusic({
          data: { lyrics, style: selectedStyle || "Pop BR", title },
        });
        setAudioUrl(url);
        setStep(4);
        setIsGenerating(false);

        setTimeout(() => navigate({ to: "/resultado" }), 800);
      } catch (e) {
        setIsGenerating(false);
        setError(e instanceof Error ? e.message : "Erro ao gerar música");
      }
    })();
  }, [
    callLyrics,
    callMusic,
    occasion,
    selectedStyle,
    customDescription,
    setLyrics,
    setAudioUrl,
    setProcessingStatus,
    setIsGenerating,
    setStep,
    navigate,
  ]);

  const currentIndex = PROCESSING_STATUSES.indexOf(
    processingStatus as (typeof PROCESSING_STATUSES)[number]
  );
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
              {!active && !completed && (
                <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
              )}
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
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {generatedLyrics}
          </pre>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
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
