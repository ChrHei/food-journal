import { isCategoryType } from "./categories";
import type { JournalEntryInput } from "./journal";

export const ENTRY_TEXT_MAX_LENGTH = 500;

export function validateEntryInput(input: Partial<JournalEntryInput>): string[] {
  const errors: string[] = [];

  if (!input.timestamp?.trim()) {
    errors.push("Tidpunkt krävs.");
  } else if (Number.isNaN(Date.parse(input.timestamp))) {
    errors.push("Tidpunkt måste vara ett giltigt ISO-datum.");
  }

  if (!input.category) {
    errors.push("Kategori krävs.");
  } else if (!isCategoryType(input.category)) {
    errors.push("Kategori är ogiltig.");
  }

  if (!input.text?.trim()) {
    errors.push("Text krävs.");
  } else if (input.text.length > ENTRY_TEXT_MAX_LENGTH) {
    errors.push(`Text får vara högst ${ENTRY_TEXT_MAX_LENGTH} tecken.`);
  }

  if (typeof input.symptomFlag !== "boolean") {
    errors.push("Symptomflagga krävs.");
  }

  return errors;
}
