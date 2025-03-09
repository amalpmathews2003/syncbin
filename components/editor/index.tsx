'use client';

import { Editor as MonacoEditor } from '@monaco-editor/react';
import { LanguageSelector } from './language-selecter';
import { useEditorStore } from './editor-store';
import { FileSelector } from './file-selecter';
import { useDebouncedCallback } from 'use-debounce';
import { useWebSockerStore } from '../ws-store';
import { pack } from 'msgpackr';

export function Editor() {
  const language = useEditorStore(state => state.language);
  const setLanguage = useEditorStore(state => state.setLanguage);
  const content = useEditorStore(state => state.content);
  const setContent = useEditorStore(state => state.setContent);

  const ws = useWebSockerStore(state => state.ws);

  const handleEditorChange = useDebouncedCallback(value => {
    const newContent = value || '';
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
      };
      const buff = pack(json);
      ws.send(buff);
    },
    500,
  );

  return (
    <div>
      <MonacoEditor
        className=""
        height="90vh"
        width="80vw"
        language={language}
        value={content}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          renderValidationDecorations: 'off',
        }}
      />
    </div>
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
