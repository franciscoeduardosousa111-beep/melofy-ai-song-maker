export const MUSIC_STYLES = [
  "Pop BR",
  "Trap/Rap",
  "Rock",
  "Eletrônica",
  "Acústico",
  "MPB & Alt",
  "Anos 80",
  "Clássica",
  "Gospel",
] as const;

export type MusicStyle = (typeof MUSIC_STYLES)[number];

export const isMusicStyle = (v: string): v is MusicStyle =>
  (MUSIC_STYLES as readonly string[]).includes(v);
