import type { JournalEntry } from "./journal";

export function filterJournalEntriesByText(
  entries: JournalEntry[],
  searchTerm?: string,
): JournalEntry[] {
  const normalizedSearchTerm = normalizeSearchText(searchTerm ?? "").trim();

  if (!normalizedSearchTerm) {
    return entries;
  }

  return entries.filter((entry) =>
    normalizeSearchText(entry.text).includes(normalizedSearchTerm),
  );
}

function normalizeSearchText(value: string) {
  return value.normalize("NFC").toLocaleLowerCase("sv-SE");
}
