import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { initializeDatabase } from "@/data/database";
import { createJournalRepository, type JournalRepository } from "@/data/journalRepository";

type JournalContextValue = {
  repository: JournalRepository;
  ready: boolean;
  refreshToken: number;
  refresh: () => void;
};

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: PropsWithChildren) {
  const repository = useMemo(() => createJournalRepository(), []);
  const [ready, setReady] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    initializeDatabase()
      .then(() => setReady(true))
      .catch((error) => {
        console.error("Database init failed", error);
      });
  }, []);

  const value = useMemo(
    () => ({
      repository,
      ready,
      refreshToken,
      refresh: () => setRefreshToken((current) => current + 1),
    }),
    [ready, refreshToken, repository],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournalContext() {
  const context = useContext(JournalContext);

  if (!context) {
    throw new Error("useJournalContext must be used within JournalProvider.");
  }

  return context;
}
