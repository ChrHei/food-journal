import {
  areEntryFormValuesEqual,
  createDefaultEntryFormValues,
  formatIngredientList,
  mapEntryToEntryFormValues,
} from "@/features/journal/utils/entryForm";

describe("entry form helpers", () => {
  it("treats a new default form as pristine", () => {
    const baseline = createDefaultEntryFormValues("2026-07-10T07:30:00.000Z");
    const current = createDefaultEntryFormValues("2026-07-10T07:30:00.000Z");

    expect(areEntryFormValuesEqual(current, baseline)).toBe(true);
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

  it("formats dictated conjunctions and comma words as list separators", () => {
    expect(formatIngredientList("äpple och banan")).toBe("äpple, banan");
    expect(formatIngredientList("äpple komma banan")).toBe("äpple, banan");
  });

  it("formats repeated separators, uppercase dictation words, and empty segments", () => {
    expect(formatIngredientList("äpple, , OCH, komma banan,, päron")).toBe("äpple, banan, päron");
  });

  it("preserves an already correctly formatted list and is idempotent", () => {
    const formatted = formatIngredientList("äpple, banan, päron");

    expect(formatted).toBe("äpple, banan, päron");
    expect(formatIngredientList(formatted)).toBe(formatted);
  });
});
