import type { JournalFilter } from "@/domain/journal";

export function summarizeJournalFilter(filter?: JournalFilter) {
  if (!filter) {
    return "Alla poster";
  }

  const parts: string[] = [];
  const textSearch = filter.textSearch?.trim();

  if (textSearch) {
    parts.push(`sökning: “${textSearch}”`);
  }

  if (filter.category) {
    parts.push(filter.category);
  }

  if (filter.symptomsOnly) {
    parts.push("endast symptom");
  }

  if (filter.from) {
    parts.push(`från ${filter.from.slice(0, 10)}`);
  }

  if (filter.to) {
    parts.push(`till ${filter.to.slice(0, 10)}`);
  }

  return parts.length > 0 ? parts.join(" • ") : "Alla poster";
}
