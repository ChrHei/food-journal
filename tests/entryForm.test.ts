import {
  areEntryFormValuesEqual,
  createDefaultEntryFormValues,
  mapEntryToEntryFormValues,
} from "@/features/journal/utils/entryForm";

describe("entry form helpers", () => {
  it("treats a new default form as pristine", () => {
    const baseline = createDefaultEntryFormValues("2026-07-10T07:30:00.000Z");
    const current = createDefaultEntryFormValues("2026-07-10T07:30:00.000Z");

    expect(areEntryFormValuesEqual(current, baseline)).toBe(true);
  });

  it("rounds a new default timestamp down to the nearest five minutes", () => {
    const form = createDefaultEntryFormValues("2026-07-10T07:34:59.999Z");

    expect(form.timestampLocal).toBe("2026-07-10T09:30");
  });

  it("detects edited fields", () => {
    const baseline = createDefaultEntryFormValues("2026-07-10T07:30:00.000Z");

    expect(
      areEntryFormValuesEqual(
        { ...baseline, text: "Ändrad text" },
        baseline,
      ),
    ).toBe(false);
    expect(
      areEntryFormValuesEqual(
        { ...baseline, category: "Middag" },
        baseline,
      ),
    ).toBe(false);
    expect(
      areEntryFormValuesEqual(
        { ...baseline, timestampLocal: "2026-07-10T09:15" },
        baseline,
      ),
    ).toBe(false);
    expect(
      areEntryFormValuesEqual(
        { ...baseline, symptomFlag: true },
        baseline,
      ),
    ).toBe(false);
  });

  it("maps an async-loaded entry into the edit baseline", () => {
    const mapped = mapEntryToEntryFormValues({
      timestamp: "2026-07-09T08:30:00.000Z",
      category: "Lunch",
      text: "Soppa",
      symptomFlag: true,
    });

    expect(mapped).toEqual({
      timestampLocal: "2026-07-09T10:30",
      category: "Lunch",
      text: "Soppa",
      symptomFlag: true,
    });
  });

  it("becomes pristine again after saving resets the baseline", () => {
    const baseline = createDefaultEntryFormValues("2026-07-10T07:30:00.000Z");
    const updated = { ...baseline, text: "Ny post" };

    expect(areEntryFormValuesEqual(updated, baseline)).toBe(false);
    expect(areEntryFormValuesEqual(updated, updated)).toBe(true);
  });
});
