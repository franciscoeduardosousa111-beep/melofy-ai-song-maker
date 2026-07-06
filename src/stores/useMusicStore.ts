import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MusicStyle } from "@/lib/styles";

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

export type ProcessingStatus = string;

type MusicState = {
  occasion: string;
  customDescription: string;
  selectedStyle: MusicStyle | "";
  generatedLyrics: string;
  audioUrl: string | null;
  pendingJobId: string | null;
  isGenerating: boolean;
  step: number;
  processingStatus: ProcessingStatus;
  selectedPlan: string;
  isLoggedIn: boolean;

  setOccasion: (occasion: string) => void;
  setCustomDescription: (description: string) => void;
  setSelectedStyle: (style: MusicStyle) => void;
  setSelectedPlan: (plan: string) => void;
  setLoggedIn: (v: boolean) => void;
  setStep: (step: number) => void;
  setLyrics: (lyrics: string) => void;
  setAudioUrl: (url: string | null) => void;
  setPendingJobId: (id: string | null) => void;
  setProcessingStatus: (status: ProcessingStatus) => void;
  setIsGenerating: (v: boolean) => void;
  reset: () => void;
};

const initialState: Pick<
  MusicState,
  | "occasion"
  | "customDescription"
  | "selectedStyle"
  | "generatedLyrics"
  | "audioUrl"
  | "isGenerating"
  | "step"
  | "processingStatus"
  | "selectedPlan"
  | "isLoggedIn"
> = {
  occasion: "",
  customDescription: "",
  selectedStyle: "",
  generatedLyrics: "",
  audioUrl: null,
  isGenerating: false,
  step: 1,
  processingStatus: "",
  selectedPlan: "5",
  isLoggedIn: false,
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      ...initialState,

      setOccasion: (occasion) => set({ occasion, step: 2 }),
      setCustomDescription: (customDescription) => set({ customDescription }),
      setSelectedStyle: (selectedStyle) => set({ selectedStyle, step: 3 }),
      setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setStep: (step) => set({ step }),
      setLyrics: (generatedLyrics) => set({ generatedLyrics }),
      setAudioUrl: (audioUrl) => set({ audioUrl }),
      setProcessingStatus: (processingStatus) => set({ processingStatus }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "melofy-music-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        occasion: state.occasion,
        customDescription: state.customDescription,
        selectedStyle: state.selectedStyle,
        generatedLyrics: state.generatedLyrics,
        audioUrl: state.audioUrl,
        selectedPlan: state.selectedPlan,
        isLoggedIn: state.isLoggedIn,
        step: state.step,
      }),
    }
  )
);
