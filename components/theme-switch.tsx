'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { useEditorStore } from './editor/editor-store';
export function ThemeSwitch({}: HTMLAttributes<HTMLButtonElement>) {
  const { setTheme } = useTheme();

  const setEditorTheme = useEditorStore(state => state.setTheme);

  return (
    <>
      <Button
        className="flex dark:hidden"
        variant="outline"
        size="icon"
        onClick={() => {
          setTheme('dark');
          setEditorTheme('vs-dark');
        }}
      >
        <Moon className="item-center justify-center" />
      </Button>
      <Button
        className="hidden dark:flex"
        variant="outline"
        size="icon"
        onClick={() => {
          setTheme('light');
          setEditorTheme('light');
        }}
      >
        <Sun />
      </Button>
    </>
  );
}
