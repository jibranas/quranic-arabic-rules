export interface Example {
  arabic: string;
  translation: string;
  explanation: string;
  surah: string;
  ayah: number;
}

export interface Rule {
  rule: string;
  examples: Example[];
}

export interface LearnedWord {
  arabic: string;
  translation: string;
  rule: string;
  surah: string;
  ayah: number;
}

export interface Word {
  arabic: string;
  translation: string;
  rule: string;
  surah: string;
  ayah: number;
  explanation: string;
} 