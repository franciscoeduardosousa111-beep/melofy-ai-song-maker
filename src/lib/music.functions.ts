import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const LyricsInput = z.object({
  occasion: z.string().min(1),
  style: z.string().min(1),
  description: z.string().optional().default(""),
});

export const generateLyrics = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LyricsInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const isGospel = data.style.trim().toLowerCase() === "gospel";
    const gospelExtras = isGospel
      ? " A letra deve ter temática cristã, com mensagens de fé, louvor e gratidão. Inclua referências bíblicas ou expressões como 'Aleluia', 'Senhor', 'Graça'."
      : "";
    const prompt = `Crie uma letra de música no estilo ${data.style} para a ocasião ${data.occasion}. Detalhes: ${data.description || "sem detalhes adicionais"}.${gospelExtras} A letra deve ter 2 versos e 1 refrão. A primeira linha deve ser o título da música. Retorne apenas a letra, sem comentários ou explicações.`;

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
