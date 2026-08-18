import type { JournalEntry } from "@/domain/journal";
import { filterJournalEntriesByText } from "@/domain/journalSearch";
import { summarizeJournalFilter } from "@/features/journal/utils/filter";

const entries: JournalEntry[] = [
  createEntry("one", "Bananbröd till frukost", "Frukost", false),
  createEntry("two", "Åt räksmörgås", "Lunch", true),
  createEntry("three", "75% mörk choklad", "Mellanmål", false),
  createEntry("four", "kod_ord", "Anteckning", false),
];

describe("journal text search", () => {
  it("matches a partial journal text without considering case", () => {
    expect(filterJournalEntriesByText(entries, "banan").map((entry) => entry.id)).toEqual([
      "one",
    ]);
  });

  it("can be combined with entries already limited by other filters", () => {
    const filteredByDatabaseCriteria = entries.filter(
      (entry) => entry.category === "Lunch" && entry.symptomFlag,
    );

    expect(
      filterJournalEntriesByText(filteredByDatabaseCriteria, "smör").map((entry) => entry.id),
    ).toEqual(["two"]);
  });

  it("does not limit entries for an empty or whitespace-only term", () => {
    expect(filterJournalEntriesByText(entries, "")).toBe(entries);
    expect(filterJournalEntriesByText(entries, "   ")).toBe(entries);
  });

  it("matches Swedish upper- and lowercase letters", () => {
    expect(filterJournalEntriesByText(entries, "åT RÄKSMÖRGÅS").map((entry) => entry.id)).toEqual([
      "two",
    ]);
  });

  it("treats percent and underscore as literal characters", () => {
    expect(filterJournalEntriesByText(entries, "%").map((entry) => entry.id)).toEqual(["three"]);
    expect(filterJournalEntriesByText(entries, "_").map((entry) => entry.id)).toEqual(["four"]);
  });

  it("includes an active text search in the filter summary", () => {
    expect(
      summarizeJournalFilter({ textSearch: "banan", category: "Frukost", symptomsOnly: true }),
    ).toBe("sökning: “banan” • Frukost • endast symptom");
    expect(summarizeJournalFilter({ textSearch: "  " })).toBe("Alla poster");
  });
});

function createEntry(
  id: string,
  text: string,
  category: JournalEntry["category"],
  symptomFlag: boolean,
): JournalEntry {
  return {
    id,
    timestamp: "2026-07-10T08:00:00.000Z",
    category,
    text,
    symptomFlag,
    createdAt: "2026-07-10T08:00:00.000Z",
    updatedAt: "2026-07-10T08:00:00.000Z",
  };
}
