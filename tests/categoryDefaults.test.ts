import {
  getSuggestedCategory,
  resolveCategoryForTimestamp,
  validateCategoryDefaultSettings,
  type CategoryDefaultSettings,
} from "@/domain/categoryDefaults";

const settings: CategoryDefaultSettings = {
  defaultCategory: "Anteckning",
  periods: [
    { id: "breakfast", startTime: "06:00", endTime: "09:00", category: "Frukost" },
    { id: "evening", startTime: "22:00", endTime: "02:00", category: "Kvällsmat" },
  ],
};

describe("time-based category defaults", () => {
  it("includes the start time and excludes the end time", () => {
    expect(getSuggestedCategory(settings, "2026-07-10T06:00")).toBe("Frukost");
    expect(getSuggestedCategory(settings, "2026-07-10T08:59")).toBe("Frukost");
    expect(getSuggestedCategory(settings, "2026-07-10T09:00")).toBe("Anteckning");
  });

  it("matches periods that pass midnight", () => {
    expect(getSuggestedCategory(settings, "2026-07-10T23:30")).toBe("Kvällsmat");
    expect(getSuggestedCategory(settings, "2026-07-11T01:59")).toBe("Kvällsmat");
    expect(getSuggestedCategory(settings, "2026-07-11T02:00")).toBe("Anteckning");
  });

  it("uses the default category when no period matches", () => {
    expect(getSuggestedCategory(settings, "2026-07-10T15:00")).toBe("Anteckning");
  });

  it("recalculates until the category has been manually selected", () => {
    expect(resolveCategoryForTimestamp(settings, "2026-07-10T06:30", "Lunch", false)).toBe(
      "Frukost",
    );
    expect(resolveCategoryForTimestamp(settings, "2026-07-10T06:30", "Lunch", true)).toBe(
      "Lunch",
    );
  });

  it("rejects ordinary and midnight-crossing overlaps", () => {
    expect(
      validateCategoryDefaultSettings({
        defaultCategory: "Frukost",
        periods: [
          { id: "one", startTime: "06:00", endTime: "09:00", category: "Frukost" },
          { id: "two", startTime: "08:30", endTime: "10:00", category: "Lunch" },
        ],
      }),
    ).toContain("Period 1 och 2 överlappar varandra.");

    expect(
      validateCategoryDefaultSettings({
        defaultCategory: "Frukost",
        periods: [
          { id: "one", startTime: "22:00", endTime: "02:00", category: "Kvällsmat" },
          { id: "two", startTime: "01:00", endTime: "03:00", category: "Mellanmål" },
        ],
      }),
    ).toContain("Period 1 och 2 överlappar varandra.");
  });

  it("allows adjacent periods and rejects invalid zero-length periods", () => {
    expect(
      validateCategoryDefaultSettings({
        defaultCategory: "Frukost",
        periods: [
          { id: "one", startTime: "06:00", endTime: "09:00", category: "Frukost" },
          { id: "two", startTime: "09:00", endTime: "12:00", category: "Lunch" },
        ],
      }),
    ).toEqual([]);

    expect(
      validateCategoryDefaultSettings({
        defaultCategory: "Frukost",
        periods: [
          { id: "one", startTime: "06:00", endTime: "06:00", category: "Frukost" },
        ],
      }),
    ).toContain("Period 1 måste ha olika start- och sluttid.");
  });
});
