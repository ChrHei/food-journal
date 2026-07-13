import type { RootStackParamList } from "./types";

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
