import { useEffect, useState } from "react";

import type { JournalEntry, JournalFilter } from "@/domain/journal";
import { useJournalContext } from "@/features/journal/context/JournalProvider";

export function useJournalEntries(filter?: JournalFilter) {
  const { ready, refreshToken, repository } = useJournalContext();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!ready) {
        return;
      }

      setLoading(true);

      const nextEntries = await repository.listEntries(filter);

      if (active) {
        setEntries(nextEntries);
        setLoading(false);
      }
    }

    load().catch((error) => {
      console.error("Failed to load entries", error);
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [filter, ready, refreshToken, repository]);

  return { entries, loading };
}
