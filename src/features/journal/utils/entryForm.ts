import type { CategoryType } from "@/domain/categories";
import type { JournalEntry } from "@/domain/journal";

import { toLocalInputValue } from "./date";

export type EntryFormValues = {
  timestampLocal: string;
  category: CategoryType;
  text: string;
  symptomFlag: boolean;
};

export function createDefaultEntryFormValues(nowIso = new Date().toISOString()): EntryFormValues {
  return {
    timestampLocal: toLocalInputValue(nowIso),
    category: "Frukost",
    text: "",
    symptomFlag: false,
  };
}

export function mapEntryToEntryFormValues(
  entry: Pick<JournalEntry, "timestamp" | "category" | "text" | "symptomFlag">,
): EntryFormValues {
  return {
    timestampLocal: toLocalInputValue(entry.timestamp),
    category: entry.category,
    text: entry.text,
    symptomFlag: entry.symptomFlag,
  };
}

export function areEntryFormValuesEqual(left: EntryFormValues, right: EntryFormValues) {
  return (
    left.timestampLocal === right.timestampLocal &&
    left.category === right.category &&
    left.text === right.text &&
    left.symptomFlag === right.symptomFlag
  );
}

export function formatIngredientList(text: string) {
  return text
    .replace(/\b(?:komma|och)\b/gi, ",")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}
