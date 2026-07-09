import type { CategoryType } from "./categories";

export type JournalEntry = {
  id: string;
  timestamp: string;
  category: CategoryType;
  text: string;
  symptomFlag: boolean;
  createdAt: string;
  updatedAt: string;
};

export type JournalEntryInput = {
  timestamp: string;
  category: CategoryType;
  text: string;
  symptomFlag: boolean;
};

export type JournalFilter = {
  from?: string;
  to?: string;
  category?: CategoryType;
  symptomsOnly?: boolean;
};
