import PartySocket from 'partysocket';
import { create } from 'zustand';

export const useWebSocketStore = create<WebSockerStore>(set => ({
  ws: null,
  roomId: '',
  ownerId: '',
  setupWebSocket: ws => set(() => ({ ws: ws })),
  setRoomId: roomid => set(() => ({ roomId: roomid })),
  setOwnerId: ownerId => set(() => ({ ownerId: ownerId })),
}));

type WS = PartySocket | null;

interface WebSockerStore {
  ws: WS;
  roomId: string;
  ownerId: string;
  setOwnerId: (ownerId: string) => void;
  setupWebSocket: (ws: WS) => void;
  setRoomId: (roomId: string) => void;
}
