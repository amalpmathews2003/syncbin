import PartySocket from 'partysocket';
import { create } from 'zustand';

export const useWebSockerStore = create<WebSockerStore>(set => ({
  ws: null,
  roomId: '',
  setupWebSocket: ws => set(() => ({ ws: ws })),
  setRoomId: roomid => set(() => ({ roomId: roomid })),
}));

type WS = PartySocket | null;

interface WebSockerStore {
  ws: WS;
  roomId: string;
  setupWebSocket: (ws: WS) => void;
  setRoomId: (roomId: string) => void;
}
