"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Game } from "@/lib/data";

type GameModalState = {
  game: Game | null;
  open: (game: Game) => void;
  close: () => void;
};

const GameModalContext = createContext<GameModalState | null>(null);

export function GameModalProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game | null>(null);

  const open = useCallback((g: Game) => setGame(g), []);
  const close = useCallback(() => setGame(null), []);

  const value = useMemo(() => ({ game, open, close }), [game, open, close]);

  return (
    <GameModalContext.Provider value={value}>
      {children}
    </GameModalContext.Provider>
  );
}

export function useGameModal() {
  const ctx = useContext(GameModalContext);
  if (!ctx) {
    throw new Error("useGameModal must be used within a GameModalProvider");
  }
  return ctx;
}
