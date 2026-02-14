import { create } from 'zustand';

interface ActiveCallStore {
  activeChannelId: string | null;
  setActiveChannel: (id: string | null) => void;
}

export const useActiveCall = create<ActiveCallStore>((set) => ({
  activeChannelId: null,
  setActiveChannel: (id) => set({ activeChannelId: id }),
}));