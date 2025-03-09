'use client';
import { Editor } from '@/components/editor';
import { useEditorStore } from '@/components/editor/editor-store';
import { ThemeSwitch } from '@/components/theme-switch';
import { useWebSocketStore } from '@/components/ws-store';
import { unpack } from 'msgpackr';
import usePartySocket from 'partysocket/react';
import { useEffect } from 'react';
import { customAlphabet } from 'nanoid';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { QRCodeSVG } from 'qrcode.react';
import { LanguageSelector } from '@/components/editor/language-selecter';
import { FileSelector } from '@/components/editor/file-selecter';
import { EditToggler } from '@/components/editor/edit-toggler';

const nanoid = customAlphabet('1234567890abcdef', 5);

export default function Home() {
  const roomId = useWebSocketStore(state => state.roomId);
  const setRoomId = useWebSocketStore(state => state.setRoomId);
  const setupWebSocket = useWebSocketStore(state => state.setupWebSocket);
  const ownerId = useWebSocketStore(state => state.ownerId);
  const setOwnerId = useWebSocketStore(state => state.setOwnerId);

  const language = useEditorStore(state => state.language);
  const setLanguage = useEditorStore(state => state.setLanguage);
  const content = useEditorStore(state => state.content);
  const setContent = useEditorStore(state => state.setContent);
  const isEditable = useEditorStore(state => state.isEditable);
  const setIsEditable = useEditorStore(state => state.setIsEditable);

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const router = useRouter();

  function getUrl() {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('r', roomId);
    return `${pathname}?${updatedSearchParams.toString()}`;
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
        const buff = await e.data.arrayBuffer();
        let json = unpack(buff as unknown as Uint8Array);
        if (json instanceof Uint8Array) {
          json = unpack(json);
        }
        console.log(json);
        const langT = json.language as string;
        const contentT = json.content as string;
        const isEditableT = json.isEditable as boolean;
        const ownerIdT = json.ownerId as string;

        if (isEditableT && isEditableT !== isEditable) {
          console.log(isEditableT);
          setIsEditable(isEditableT);
        }
        if (ownerIdT && ownerIdT !== ownerId) {
          setOwnerId(ownerIdT);
        }

        if (langT && langT !== language) {
          setLanguage(langT);
        }
        if (contentT && contentT !== content) {
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

    const roomId = searchParams.get('r') ?? randomRoomId;
    setRoomId(roomId);

    wsT.updateProperties({ room: roomId });
    wsT.reconnect();

    setOwnerId(wsT.id);
  }, [wsT, setRoomId, setOwnerId, searchParams]);

  useEffect(() => {
    if (wsT.OPEN) {
      setupWebSocket(wsT);
    }
  }, [wsT, setupWebSocket]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          SyncBin
        </h1>
        <ThemeSwitch />
      </header>
      <div className="flex flex-row items-start justify-center p-4 flex-grow">
        <Editor className="w-2/3 max-w-4xl p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg" />
        <div className="flex flex-col items-center justify-center w-1/3 ml-4 space-y-4">
          <EditToggler />
          <QRCodeSVG
            level="H"
            bgColor="bg-gray-900"
            fgColor="white"
            value={`${process.env.NEXT_PUBLIC_URL}${getUrl()}`}
            className="w-54 h-54"
          />
          <LanguageSelector className="w-full max-w-xs p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg" />
          <FileSelector className="w-full max-w-xs p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg" />
        </div>
      </div>
      <footer className="p-4 bg-white dark:bg-gray-800 shadow-md text-center">
        <p className="text-gray-900 dark:text-gray-100">Made with ❤️ by Amal</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a
            href="https://github.com/your-repo"
            className="text-gray-900 dark:text-gray-100"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
