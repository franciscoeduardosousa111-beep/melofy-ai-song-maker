import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { MUSIC_STYLES } from "./styles";

const LyricsInput = z.object({
  occasion: z.string().min(1),
  style: z.enum(MUSIC_STYLES),
  description: z.string().optional().default(""),
});

export const generateLyrics = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LyricsInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const isGospel = data.style === "Gospel";
    const gospelExtras = isGospel
      ? " A letra deve ter temática cristã, com mensagens de fé, louvor e gratidão. Inclua referências bíblicas ou expressões como 'Aleluia', 'Senhor', 'Graça'."
      : "";

    const estruturaPorOcasiao: Record<string, "Estrutura 1" | "Estrutura 2"> = {
      "Declaração de amor": "Estrutura 1",
      Casamento: "Estrutura 1",
      Motivação: "Estrutura 1",
      Aniversário: "Estrutura 2",
      Pegadinha: "Estrutura 2",
      Festa: "Estrutura 2",
      Gospel: "Estrutura 2",
    };
    const estrutura = estruturaPorOcasiao[data.occasion] ?? "Estrutura 2";
    const estruturaTexto =
      estrutura === "Estrutura 1"
        ? "Estrutura 1 (completa): Verso 1, Pré-refrão, Refrão, Verso 2, Pré-refrão, Refrão final."
        : "Estrutura 2 (direta): Verso 1, Refrão, Verso 2, Refrão.";

    const regras = [
      "1. Rimas naturais: fluidez sem forçar palavras incomuns ou inversões sintáticas estranhas. Priorize rimas consoantes e assonâncias suaves.",
      "2. Simplicidade: use palavras do dia a dia, frases curtas e diretas. Evite vocabulário rebuscado ou metáforas complexas.",
      "3. Melodia: cadência rítmica que sugira uma melodia fácil de cantar, com sílabas tônicas em posições regulares.",
      "4. Refrão marcante: no máximo 4 versos, com repetição de uma frase-chave fácil de lembrar.",
      "5. Tamanho dos versos: entre 6 e 10 sílabas poéticas (aproximadamente 4 a 7 palavras por verso).",
    ].join("\n");

    const prompt = `Crie uma letra de música no estilo ${data.style} para a ocasião ${data.occasion}. Detalhes: ${data.description || "sem detalhes adicionais"}.${gospelExtras}

Siga rigorosamente estas regras:
${regras}

A estrutura deve ser ${estruturaTexto}
Marque cada seção com um rótulo entre colchetes (ex: [Verso 1], [Pré-refrão], [Refrão], [Verso 2], [Refrão final]).
A primeira linha deve ser o título da música (sem rótulo).
Retorne apenas a letra, sem introduções ou explicações.`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt,
    });

    return { lyrics: text.trim() };
  });

const MusicInput = z.object({
  lyrics: z.string().min(1),
  style: z.string().min(1),
  title: z.string().optional(),
});

const APIFRAME_BASE = "https://api.apiframe.ai/v2";
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 180_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateMusic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MusicInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.APIFRAME_API_KEY;
    if (!apiKey) throw new Error("Missing APIFRAME_API_KEY");

    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    };

    const body = JSON.stringify({
      model: "suno",
      prompt: data.lyrics,
      sunoParams: {
        custom_mode: true,
        style: data.style,
        title: data.title || "Minha Música",
      },
    });

    console.log("[apiframe] POST", `${APIFRAME_BASE}/music/generate`, {
      headers: { "Content-Type": "application/json", "X-API-Key": "***" },
      body,
    });

    // 1. Enqueue job
    let submitRes: Response;
    try {
      submitRes = await fetch(`${APIFRAME_BASE}/music/generate`, {
        method: "POST",
        headers,
        body,
      });
    } catch (err) {
      console.error("[apiframe] submit failed", err);
      throw new Error("Não foi possível iniciar a geração da música.");
    }

    const submitText = await submitRes.text();
    console.log("[apiframe] submit response", submitRes.status, submitText);

    if (!submitRes.ok) {
      console.error("[apiframe] submit non-ok", submitRes.status, submitText);
      throw new Error("Falha ao solicitar geração da música.");
    }

    let submitJson: {
      jobId?: string;
      id?: string;
      data?: { jobId?: string; id?: string };
    };
    try {
      submitJson = JSON.parse(submitText);
    } catch {
      throw new Error("Resposta inválida do serviço de música.");
    }
    const jobId =
      submitJson.jobId ||
      submitJson.id ||
      submitJson.data?.jobId ||
      submitJson.data?.id;
    if (!jobId) {
      console.error("[apiframe] no jobId in response", submitJson);
      throw new Error("Resposta inválida do serviço de música.");
    }

    return { jobId };
  });

const CheckJobInput = z.object({
  jobId: z.string().min(1),
});

export const checkMusicJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CheckJobInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.APIFRAME_API_KEY;
    if (!apiKey) throw new Error("Missing APIFRAME_API_KEY");

    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    };

    let pollRes: Response;
    try {
      pollRes = await fetch(`${APIFRAME_BASE}/jobs/${data.jobId}`, { headers });
    } catch (err) {
      console.error("[apiframe] poll failed", err);
      throw new Error("Falha ao consultar status do job.");
    }
    if (!pollRes.ok) {
      const text = await pollRes.text().catch(() => "");
      console.error("[apiframe] poll non-ok", pollRes.status, text);
      throw new Error("Falha ao consultar status do job.");
    }

    const job = (await pollRes.json()) as {
      status?: string;
      data?: {
        status?: string;
        tracks?: Array<{ audioUrl?: string; audio_url?: string }>;
      };
      tracks?: Array<{ audioUrl?: string; audio_url?: string }>;
      error?: string;
    };
    const status = job.status || job.data?.status || "unknown";
    const tracks = job.data?.tracks || job.tracks || [];
    const audioUrl = tracks[0]?.audioUrl || tracks[0]?.audio_url || null;

    return { status, audioUrl, error: job.error || null };
  });
