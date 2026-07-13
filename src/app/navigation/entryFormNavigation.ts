import type { RootStackParamList } from "./types";

type EntryFormNavigationTarget = {
  name: "EntryForm";
  params: RootStackParamList["EntryForm"];
  merge: false;
};

let newEntrySessionId = 0;

export function createNewEntryFormNavigationTarget(): EntryFormNavigationTarget {
  return {
    name: "EntryForm",
    params: { newEntrySessionId: ++newEntrySessionId },
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
