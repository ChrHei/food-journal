import { categoryOptions, isCategoryType } from "@/domain/categories";
import { validateEntryInput } from "@/domain/validation";

describe("domain rules", () => {
  it("contains all static v1 categories", () => {
    expect(categoryOptions).toEqual([
      "Frukost",
      "Lunch",
      "Middag",
      "Mellanmål",
      "Kvällsmat",
      "Dryck",
      "Medicin",
      "Anteckning",
    ]);
  });

  it("recognizes valid categories", () => {
    expect(isCategoryType("Medicin")).toBe(true);
    expect(isCategoryType("Mellanmål")).toBe(true);
    expect(isCategoryType("Symptom")).toBe(false);
  });

  it("validates required fields", () => {
    const errors = validateEntryInput({
      timestamp: "",
      category: undefined as never,
      text: "",
      symptomFlag: undefined as never,
    });

    expect(errors).toContain("Tidpunkt krävs.");
    expect(errors).toContain("Kategori krävs.");
    expect(errors).toContain("Text krävs.");
    expect(errors).toContain("Symptomflagga krävs.");
  });
});
