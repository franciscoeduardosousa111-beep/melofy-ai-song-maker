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
});

export const generateMusic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MusicInput.parse(input))
  .handler(async ({ data }) => {
    // Substituir pela API do Suno quando assinado.
    void data;
    return {
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    };
  });
