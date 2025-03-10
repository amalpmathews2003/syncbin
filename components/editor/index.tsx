'use client';

import { EditorProps, Editor as MonacoEditor } from '@monaco-editor/react';
import { useEditorStore } from './editor-store';
import { useDebouncedCallback } from 'use-debounce';
import { useWebSocketStore } from '../ws-store';
import { pack } from 'msgpackr';

export function Editor({ ...props }: EditorProps) {
  const language = useEditorStore(state => state.language);
  const setLanguage = useEditorStore(state => state.setLanguage);
  const content = useEditorStore(state => state.content);
  const setContent = useEditorStore(state => state.setContent);
  const theme = useEditorStore(state => state.theme);
  const isEditable = useEditorStore(state => state.isEditable);

  const ws = useWebSocketStore(state => state.ws);
  const ownerId = useWebSocketStore(state => state.ownerId);

  const handleEditorChange = useDebouncedCallback(value => {
    const newContent = value ?? '';
    if (newContent !== content) {
      setContent(newContent);
      const detectedLang = detectLanguage(newContent);
      if (detectedLang !== language) {
        setLanguage(detectedLang);
      }
      broadcastContent(detectedLang, newContent);
    }
  }, 200);

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

  return (
    <MonacoEditor
      height="90vh"
      width="80vw"
      language={language}
      value={content}
      theme={theme}
      onChange={handleEditorChange}
      options={{
        renderValidationDecorations: 'off',
        readOnly: isEditable,
      }}
      {...props}
    />
  );
}

const detectLanguage = (code: string): string => {
  if (/^\s*#include\s+/m.test(code)) return 'cpp';
  if (/\b(class|interface|extends|implements)\b/.test(code)) return 'java';
  if (/^\s*def\s+\w+\s*\(/.test(code) || /\bimport\s+\w+/.test(code))
    return 'python';
  if (/^\s*(function|const|let|var)\s+\w+\s*=/.test(code)) return 'javascript';
  if (/\bexport\s+default\b|\bimport\b/.test(code)) return 'typescript';
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(code))
    return 'sql';
  if (/^\s*(body|div|span|h1|p|\.class|#id)\s*\{/.test(code)) return 'css';
  if (/^\s*<!DOCTYPE html>|<html>|<head>|<body>/.test(code)) return 'html';
  if (/^\s*@\w+\s*\{/.test(code) || /\bcolor\s*:\s*\w+/.test(code))
    return 'scss';
  if (/\bfn\s+\w+\s*\(/.test(code) || /\blet\s+\w+\s*=\s*mut\b/.test(code))
    return 'rust';
  return 'plaintext'; // Default
};
