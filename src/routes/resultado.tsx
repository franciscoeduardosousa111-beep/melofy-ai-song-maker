import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download, Share2, Sparkles, AlertCircle } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

export const Route = createFileRoute("/resultado")({
  component: ResultPage,
});

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ResultPage() {
  const navigate = useNavigate();
  const generatedLyrics = useMusicStore((s) => s.generatedLyrics);
  const selectedStyle = useMusicStore((s) => s.selectedStyle);
  const audioUrl = useMusicStore((s) => s.audioUrl);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const title = generatedLyrics.split("\n")[0] || "Minha Música";
  const lyricsBody = generatedLyrics.split("\n").slice(1).join("\n").trim();

  // Auto-play when audio arrives
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    setAudioError(null);
    el.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay may be blocked — user will press play manually
        setPlaying(false);
      });
  }, [audioUrl]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const t = (Number(e.target.value) / 100) * duration;
    el.currentTime = t;
    setCurrentTime(t);
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Sua música</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-gradient-brand">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estilo {selectedStyle || "Acústico"}
          {duration > 0 ? ` · ${formatTime(duration)}` : ""}
        </p>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-brand-pink/30 to-brand-violet/40 p-6">
        <div className="mx-auto aspect-square w-40 rounded-2xl btn-gradient shadow-2xl" />

        {audioUrl ? (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="auto"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
            onError={() => setAudioError("Não foi possível carregar o áudio.")}
            className="hidden"
          />
        ) : null}

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={!audioUrl}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full btn-gradient disabled:opacity-40"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
          </button>
          <div className="flex flex-1 flex-col gap-2">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${progressPct}%` }}
              />
              {audioUrl && duration > 0 && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progressPct}
                  onChange={onSeek}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Buscar posição da música"
                />
              )}
            </div>
            <div className="flex justify-between text-[11px] text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {audioError && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/20 p-2 text-xs text-white">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{audioError}</span>
          </div>
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
        <a
          href={audioUrl ?? "#"}
          download={audioUrl ? `${title}.mp3` : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!audioUrl}
          className={`flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-surface py-3 text-sm font-semibold ${
            audioUrl ? "" : "pointer-events-none opacity-40"
          }`}
        >
          <Download className="h-4 w-4" /> Baixar
        </a>
        <button
          onClick={async () => {
            if (!audioUrl) return;
            if (navigator.share) {
              try {
                await navigator.share({ title, url: audioUrl });
              } catch {
                /* user cancelled */
              }
            } else {
              await navigator.clipboard.writeText(audioUrl);
            }
          }}
          disabled={!audioUrl}
          className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-surface py-3 text-sm font-semibold disabled:opacity-40"
        >
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
