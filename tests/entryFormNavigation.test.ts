import {
  createEditEntryFormNavigationTarget,
  createNewEntryFormNavigationTarget,
} from "@/app/navigation/entryFormNavigation";

describe("entry form navigation", () => {
  it("clears an edit route's entry id and creates a new form session", () => {
    const editTarget = createEditEntryFormNavigationTarget("entry-123");
    const newTarget = createNewEntryFormNavigationTarget();

    expect(editTarget).toEqual({
      name: "EntryForm",
      params: { entryId: "entry-123" },
      merge: false,
    });
    expect(newTarget).toMatchObject({
      name: "EntryForm",
      params: { newEntrySessionId: expect.any(Number) },
      merge: false,
    });
  });

  it("creates a distinct session for each new entry navigation", () => {
    expect(createNewEntryFormNavigationTarget().params).not.toEqual(
      createNewEntryFormNavigationTarget().params,
    );
  });

  it("opens edit mode with the selected entry id", () => {
    expect(createEditEntryFormNavigationTarget("entry-456")).toEqual({
      name: "EntryForm",
      params: { entryId: "entry-456" },
      merge: false,
    });
  });
});
