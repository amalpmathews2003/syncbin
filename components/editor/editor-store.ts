import { create } from 'zustand';

export const useEditorStore = create<Editorstore>(set => ({
  language: 'plaintext',
  file: null,
  content: '',
  setLanguage: lang => set(() => ({ language: lang })),
  setFile: file => set(() => ({ file: file })),
  setContent: value => set(() => ({ content: value })),
}));

interface Editorstore {
  language: string;
  file: File | null;
  content: string;
  setContent: (content: string) => void;
  setLanguage: (lang: string) => void;
  setFile: (file: File | null) => void;
}
