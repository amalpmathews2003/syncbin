'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        className="flex dark:hidden"
        variant="outline"
        size="icon"
        onClick={() => setTheme('dark')}
      >
        <Moon className="item-center justify-center" />
      </Button>
      <Button
        className="hidden dark:flex"
        variant="outline"
        size="icon"
        onClick={() => setTheme('light')}
      >
        <Sun />
      </Button>
    </>
  );
}
