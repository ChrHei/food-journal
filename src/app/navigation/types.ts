import type { CategoryType } from "@/domain/categories";
import type { CategoryDefaultSettings } from "@/domain/categoryDefaults";
import type { JournalFilter } from "@/domain/journal";

export type RootStackParamList = {
  Home: undefined;
  JournalList: { filter?: JournalFilter } | undefined;
  EntryForm:
    | {
        entryId?: string;
        copy?: { category: CategoryType; text: string };
      }
    | undefined;
  EntryDetail: { entryId: string };
  Filter: { filter?: JournalFilter } | undefined;
  Backup: undefined;
  CategorySettings: { updatedSettings?: CategoryDefaultSettings } | undefined;
  CategoryPeriodEditor: {
    settings: CategoryDefaultSettings;
    settingsRouteKey: string;
    periodId?: string;
  };
};
