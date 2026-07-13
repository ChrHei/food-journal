import type { JournalFilter } from "@/domain/journal";

export type RootStackParamList = {
  Home: undefined;
  JournalList: { filter?: JournalFilter } | undefined;
  EntryForm: { entryId?: string; newEntrySessionId?: number } | undefined;
  EntryDetail: { entryId: string };
  Filter: { filter?: JournalFilter } | undefined;
};
