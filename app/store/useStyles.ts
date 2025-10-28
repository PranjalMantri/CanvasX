import { create } from "zustand";

interface StyleStore {
  color: string;
  setColor: (color: string) => void;
  width: number;
  setWidth: (width: number) => void;
}

export const useStyleStore = create<StyleStore>((set) => ({
  color: "#ffffff",
  setColor: (color: string) => set({ color }),
  width: 2,
  setWidth: (width: number) => set({ width }),
}));
