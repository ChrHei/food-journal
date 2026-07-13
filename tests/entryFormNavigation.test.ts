import {
  createEditEntryFormNavigationTarget,
  createNewEntryFormNavigationTarget,
} from "@/app/navigation/entryFormNavigation";

describe("entry form navigation", () => {
  it("clears an edit route's entry id when navigating to a new entry", () => {
    const editTarget = createEditEntryFormNavigationTarget("entry-123");
    const newTarget = createNewEntryFormNavigationTarget();

    expect(editTarget).toEqual({
      name: "EntryForm",
      params: { entryId: "entry-123" },
      merge: false,
    });
    expect(newTarget).toEqual({
      name: "EntryForm",
      params: undefined,
      merge: false,
    });
  });

  it("opens edit mode with the selected entry id", () => {
    expect(createEditEntryFormNavigationTarget("entry-456")).toEqual({
      name: "EntryForm",
      params: { entryId: "entry-456" },
      merge: false,
    });
  });
});
