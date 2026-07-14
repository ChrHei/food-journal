import type { RootStackParamList } from "./types";
import type { JournalEntry } from "@/domain/journal";

type NewEntryFormRoute = {
  name: "EntryForm";
  key: string;
  params: RootStackParamList["EntryForm"];
};

type EditEntryFormNavigationTarget = {
  name: "EntryForm";
  params: RootStackParamList["EntryForm"];
  merge: false;
};

let newEntryRouteId = 0;

export function createNewEntryFormRoute(): NewEntryFormRoute {
  return {
    name: "EntryForm",
    key: `new-entry-${++newEntryRouteId}`,
    params: undefined,
  };
}

export function createEditEntryFormNavigationTarget(
  entryId: string,
): EditEntryFormNavigationTarget {
  return {
    name: "EntryForm",
    params: { entryId },
    merge: false,
  };
}

export function createCopyEntryFormNavigationTarget(
  entry: Pick<JournalEntry, "category" | "text">,
): EditEntryFormNavigationTarget {
  return {
    name: "EntryForm",
    params: { copy: { category: entry.category, text: entry.text } },
    merge: false,
  };
}
