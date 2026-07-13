import type { RootStackParamList } from "./types";

type EntryFormNavigationTarget = {
  name: "EntryForm";
  params: RootStackParamList["EntryForm"];
  merge: false;
};

export function createNewEntryFormNavigationTarget(): EntryFormNavigationTarget {
  return {
    name: "EntryForm",
    params: undefined,
    merge: false,
  };
}

export function createEditEntryFormNavigationTarget(
  entryId: string,
): EntryFormNavigationTarget {
  return {
    name: "EntryForm",
    params: { entryId },
    merge: false,
  };
}
