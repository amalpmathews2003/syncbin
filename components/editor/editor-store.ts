import { create } from 'zustand';

export const useEditorStore = create<Editorstore>(set => ({
  language: 'plaintext',
  file: null,
  content: '',
  theme: 'vs-dark',
  isEditable: false,
  setLanguage: lang => set(() => ({ language: lang })),
  setFile: file => set(() => ({ file: file })),
  setContent: value => set(() => ({ content: value })),
  setTheme: theme => set(() => ({ theme: theme })),
  setIsEditable: editable => set(() => ({ isEditable: editable })),
}));

interface Editorstore {
  language: string;
  file: File | null;
  content: string;
  isEditable: boolean;
  theme: 'vs-dark' | 'light';
  setTheme: (theme: 'vs-dark' | 'light') => void;
  setContent: (content: string) => void;
  setLanguage: (lang: string) => void;
  setFile: (file: File | null) => void;
  setIsEditable: (editable: boolean) => void;
}
