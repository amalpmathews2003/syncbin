import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditorStore } from './editor-store';
import { ChangeEventHandler, HTMLAttributes } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useWebSocketStore } from '../ws-store';
import { pack } from 'msgpackr';

export function FileSelector({ ...props }: HTMLAttributes<HTMLDivElement>) {
  const setFile = useEditorStore(state => state.setFile);
  const setContent = useEditorStore(state => state.setContent);
  const language = useEditorStore(state => state.language);
  const content = useEditorStore(state => state.content);
  const isEditable = useEditorStore(state => state.isEditable);
  const setLanguage = useEditorStore(state => state.setLanguage);

  const ws = useWebSocketStore(state => state.ws);
  const ownerId = useWebSocketStore(state => state.ownerId);

  const broadcastContent = useDebouncedCallback(
    (langT: string, contT: string) => {
      if (!ws) return;
      const json = {
        language: langT,
        content: contT,
        isEditable: isEditable,
        ownerId: ownerId,
      };
      const buff = pack(json);
      ws.send(buff);
    },
    500,
  );

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = event => {
    if (!event.target.files || event.target.files.length === 0) {
      console.warn('No file selected');
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const detectedLang = getLanguageFromExtension(fileExt);
      if (detectedLang !== language) {
        setLanguage(detectedLang);
      }
      setFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        const contentT = e.target?.result as string;
        if (contentT !== content) {
          console.log('dfdf');
          setContent(contentT);
          broadcastContent(detectedLang, contentT);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div {...props} className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">File</Label>
      <Input id="picture" type="file" onChange={handleFileChange} />
    </div>
  );
}

const getLanguageFromExtension = (ext: string): string => {
  const langMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    cs: 'csharp',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sql: 'sql',
    json: 'json',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sh: 'shell',
    rb: 'ruby',
    rs: 'rust',
    go: 'go',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
  };

  return langMap[ext] || 'plaintext';
};
