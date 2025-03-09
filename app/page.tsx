'use client';
import { Editor } from '@/components/editor';
import { useEditorStore } from '@/components/editor/editor-store';
import { ThemeSwitch } from '@/components/theme-switch';
import { useWebSockerStore } from '@/components/ws-store';
import { unpack } from 'msgpackr';
import usePartySocket from 'partysocket/react';
import { useEffect } from 'react';
import { customAlphabet } from 'nanoid';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { QRCodeSVG } from 'qrcode.react';
import { LanguageSelector } from '@/components/editor/language-selecter';
import { FileSelector } from '@/components/editor/file-selecter';

const nanoid = customAlphabet('1234567890abcdef', 5);

export default function Home() {
  const roomId = useWebSockerStore(state => state.roomId);
  const setRoomId = useWebSockerStore(state => state.setRoomId);

  const setupWebSocket = useWebSockerStore(state => state.setupWebSocket);

  const language = useEditorStore(state => state.language);
  const setLanguage = useEditorStore(state => state.setLanguage);
  const content = useEditorStore(state => state.content);
  const setContent = useEditorStore(state => state.setContent);

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const router = useRouter();

  function getUrl() {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('r', roomId);
    return `${
      process.env.NEXT_PUBLIC_URL
    }${pathname}?${updatedSearchParams.toString()}`;
  }

  const wsT = usePartySocket({
    startClosed: true,
    host: process.env.NEXT_PUBLIC_PARTYKIT_URL,
    onOpen() {
      console.log('connected');

      router.push(getUrl());
    },
    async onMessage(e) {
      if (e.data instanceof Blob) {
        const buff = (await e.data.arrayBuffer()) as any;
        const json = unpack(buff);
        const langT = json.language as string;
        const contentT = json.content as string;
        if (langT !== language) {
          setLanguage(langT);
        }
        if (contentT !== content) {
          setContent(contentT);
        }
      }
    },
    onClose() {
      console.log('closed');
      setupWebSocket(null);
    },
  });
  useEffect(() => {
    const randomRoomId = nanoid();

    const roomId = searchParams.get('r') || randomRoomId;
    setRoomId(roomId);

    wsT.updateProperties({ room: roomId });
    wsT.reconnect();
  }, []);

  useEffect(() => {
    if (wsT.OPEN) {
      setupWebSocket(wsT);
    }
  }, [wsT]);

  return (
    <div>
      <ThemeSwitch />
      <div className="flex ">
        <Editor />
        <div className="flex flex-col items-center justify-center">
          <QRCodeSVG value={getUrl()} />
          <LanguageSelector />
          <FileSelector />
        </div>
      </div>
    </div>
  );
}
