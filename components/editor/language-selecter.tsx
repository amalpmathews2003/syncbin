'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState, HTMLAttributes } from 'react';
import { useEditorStore } from './editor-store';

const languages = [
  'c',
  'c++',
  'css',
  'go',
  'html',
  'java',
  'javascript',
  'json',
  'kotlin',
  'lua',
  'markdown',
  'mysql',
  'php',
  'python',
  'rust',
  'shell',
  'typescript',
  'plaintext',
].toSorted();

const defaultLanguage = 'plaintext';

export function LanguageSelector({ ...props }: HTMLAttributes<HTMLDivElement>) {
  const [position, setPosition] = useState(defaultLanguage);
  const setLanguage = useEditorStore(state => state.setLanguage);

  const language = useEditorStore(state => state.language);

  useEffect(() => {
    if (language && language != position) {
      setPosition(language);
    }
  }, [language, setPosition, position]);

  return (
    <div {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{position}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Lanugages</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={position}
            onValueChange={language => {
              setPosition(language);
              setLanguage(language);
            }}
          >
            {languages.map((language, index) => (
              <DropdownMenuRadioItem key={index} value={language}>
                {language}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
