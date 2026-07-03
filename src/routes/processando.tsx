import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, AlertCircle, Music, Timer } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { generateLyrics, generateMusic, checkMusicJob } from "@/lib/music.functions";

export const Route = createFileRoute("/processando")({
  component: ProcessingPage,
});

const LYRIC_STEPS = [
  "Escolhendo as palavras certas...",
  "Ajustando a letra...",
] as const;

function ProcessingPage() {
  const navigate = useNavigate();
  const isGenerating = useMusicStore((s) => s.isGenerating);
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
  const callCheckJob = useServerFn(checkMusicJob);

  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const [lyricStepIndex, setLyricStepIndex] = useState(0);
  const [musicPhase, setMusicPhase] = useState<"idle" | "submitting" | "polling" | "done" | "error">("idle");
  const [pollCount, setPollCount] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Phase 1: generate lyrics
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        setError(null);
        setIsGenerating(true);
        setLyrics("");
        setAudioUrl(null);
        setMusicPhase("idle");
        setPollCount(0);
        setElapsedSec(0);

        setProcessingStatus(LYRIC_STEPS[0]);
        const { lyrics } = await callLyrics({
          data: {
            occasion: occasion || "Personalizada",
            style: selectedStyle || "Pop BR",
            description: customDescription,
          },
        });

        setLyricStepIndex(1);
        setProcessingStatus(LYRIC_STEPS[1]);
        setLyrics(lyrics);

        // Small visual pause before music phase
        await new Promise((r) => setTimeout(r, 600));

        // Phase 2: submit music job
        setMusicPhase("submitting");
        setProcessingStatus("Enviando letra para o estúdio...");
        const title = lyrics.split("\n")[0]?.trim() || "Minha Música";
        const { jobId } = await callMusic({
          data: { lyrics, style: selectedStyle || "Pop BR", title },
        });

        // Phase 3: poll job
        setMusicPhase("polling");
        const pollStart = Date.now();
        const maxPollMs = 180_000;
        const pollIntervalMs = 5_000;

        while (Date.now() - pollStart < maxPollMs) {
          await new Promise((r) => setTimeout(r, pollIntervalMs));
          const elapsed = Math.floor((Date.now() - pollStart) / 1000);
          setElapsedSec(elapsed);
          setPollCount((c) => c + 1);

          const check = await callCheckJob({ data: { jobId } });

          if (check.status === "completed" || check.status === "succeeded") {
            if (!check.audioUrl) {
              throw new Error("Música gerada, mas nenhum áudio foi retornado.");
            }
            setAudioUrl(check.audioUrl);
            setMusicPhase("done");
            setProcessingStatus("Música pronta!");
            setStep(4);
            setIsGenerating(false);
            setTimeout(() => navigate({ to: "/resultado" }), 800);
            return;
          }

          if (check.status === "failed" || check.status === "error") {
            throw new Error(check.error || "A geração da música falhou.");
          }

          // Still processing — rotate friendly messages
          setProcessingStatus(getPollingMessage(pollCount + 1, elapsed));
        }

        throw new Error("Tempo limite excedido ao gerar a música.");
      } catch (e) {
        setIsGenerating(false);
        setMusicPhase("error");
        setProcessingStatus("");
        setError(e instanceof Error ? e.message : "Erro ao gerar música");
      }
    })();
  }, [
    callLyrics,
    callMusic,
    callCheckJob,
    occasion,
    selectedStyle,
    customDescription,
    setLyrics,
    setAudioUrl,
    setProcessingStatus,
    setIsGenerating,
    setStep,
    navigate,
    pollCount,
  ]);

  const done = musicPhase === "done" || (!isGenerating && !!audioUrl);

  const steps = [
    { label: LYRIC_STEPS[0], done: lyricStepIndex > 0, active: lyricStepIndex === 0 && !error },
    { label: LYRIC_STEPS[1], done: lyricStepIndex > 1 || musicPhase !== "idle", active: lyricStepIndex === 1 && !error },
    {
      label: musicPhase === "submitting"
        ? "Enviando para o estúdio..."
        : musicPhase === "polling" || musicPhase === "done"
        ? getPollingMessage(pollCount, elapsedSec)
        : musicPhase === "error"
        ? "Falha na geração"
        : "Criando sua música...",
      done: done,
      active: (musicPhase === "submitting" || musicPhase === "polling") && !error,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Gerando sua música</h1>
        <p className="mt-1 text-sm text-muted-foreground">Isso pode levar até 3 minutos.</p>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((s, i) => {
          const active = s.active && !done;
          const completed = s.done;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm transition-opacity ${
                !active && !completed ? "opacity-40" : "opacity-100"
              }`}
            >
              {active && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />}
              {completed && <Sparkles className="h-4 w-4 shrink-0 text-primary" />}
              {!active && !completed && (
                <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
              )}
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      {(musicPhase === "polling" || musicPhase === "done") && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
          <Music className="h-4 w-4 shrink-0 text-primary animate-pulse" />
          <span className="flex-1">
            {musicPhase === "done" ? "Áudio recebido do estúdio" : "Suno AI está compondo a melodia e a voz..."}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            {elapsedSec}s
          </span>
        </div>
      )}

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

function getPollingMessage(attempt: number, elapsedSec: number): string {
  const messages = [
    "Analisando a letra no estúdio...",
    "Compondo a melodia...",
    "Ajustando os instrumentos...",
    "Sincronizando voz e música...",
    "Refinando os arranjos...",
    "Quase lá, finalizando o mix...",
  ];
  const idx = Math.min(attempt - 1, messages.length - 1);
  const min = Math.floor(elapsedSec / 60);
  const sec = elapsedSec % 60;
  const timeStr = min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  return `${messages[idx]} (${timeStr})`;
}
