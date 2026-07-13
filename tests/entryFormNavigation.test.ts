import {
  createEditEntryFormNavigationTarget,
  createNewEntryFormRoute,
} from "@/app/navigation/entryFormNavigation";

describe("entry form navigation", () => {
  it("creates a fresh route without an edit entry id", () => {
    const editTarget = createEditEntryFormNavigationTarget("entry-123");
    const newRoute = createNewEntryFormRoute();

    expect(editTarget).toEqual({
      name: "EntryForm",
      params: { entryId: "entry-123" },
      merge: false,
    });
    expect(newRoute).toEqual({
      name: "EntryForm",
      key: expect.any(String),
      params: undefined,
    });
  });

  it("creates a distinct route for each new entry navigation", () => {
    expect(createNewEntryFormRoute().key).not.toEqual(createNewEntryFormRoute().key);
  });

  it("opens edit mode with the selected entry id", () => {
    expect(createEditEntryFormNavigationTarget("entry-456")).toEqual({
      name: "EntryForm",
      params: { entryId: "entry-456" },
      merge: false,
    });
  });
});
