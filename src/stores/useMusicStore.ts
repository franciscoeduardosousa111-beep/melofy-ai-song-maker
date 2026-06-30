import { create } from "zustand";

export const MOCK_LYRICS = `Tua Graça Me Alcançou

Quando eu não tinha rumo, nem direção,
Veio um sopro de amor no meu coração.
A tua graça me alcançou,
E em silêncio, minha alma cantou.

Refrão:
Sou teu, sou teu, pra sempre vou cantar,
Tua graça é o meu lugar.`;

export const PROCESSING_STATUSES = [
  "Escolhendo as palavras certas...",
  "Ajustando a letra...",
  "Criando sua música...",
] as const;

export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number] | "";

type MusicState = {
  occasion: string;
  customDescription: string;
  selectedStyle: string;
  generatedLyrics: string;
  audioUrl: string | null;
  isGenerating: boolean;
  step: number;
  processingStatus: ProcessingStatus;

  setOccasion: (occasion: string) => void;
  setCustomDescription: (description: string) => void;
  setSelectedStyle: (style: string) => void;
  setStep: (step: number) => void;
  reset: () => void;
  generateMusic: () => Promise<void>;
};

const initialState = {
  occasion: "",
  customDescription: "",
  selectedStyle: "",
  generatedLyrics: "",
  audioUrl: null as string | null,
  isGenerating: false,
  step: 1,
  processingStatus: "" as ProcessingStatus,
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useMusicStore = create<MusicState>((set) => ({
  ...initialState,

  setOccasion: (occasion) => set({ occasion, step: 2 }),
  setCustomDescription: (customDescription) => set({ customDescription }),
  setSelectedStyle: (selectedStyle) => set({ selectedStyle, step: 3 }),
  setStep: (step) => set({ step }),
  reset: () => set({ ...initialState }),

  generateMusic: async () => {
    set({
      isGenerating: true,
      generatedLyrics: "",
      audioUrl: null,
      processingStatus: PROCESSING_STATUSES[0],
    });
    await wait(1000);
    set({ processingStatus: PROCESSING_STATUSES[1] });
    await wait(1000);
    set({ generatedLyrics: MOCK_LYRICS, processingStatus: PROCESSING_STATUSES[2] });
    await wait(2000);
    set({
      isGenerating: false,
      audioUrl: "/mock-audio.mp3",
      step: 4,
    });
  },
}));
