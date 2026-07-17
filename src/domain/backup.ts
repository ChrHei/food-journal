import { isCategoryType } from "./categories";
import type { JournalEntry } from "./journal";
import { validateEntryInput } from "./validation";

export const BACKUP_VERSION = 1;

export type JournalBackup = {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  entries: JournalEntry[];
};

export function createJournalBackup(entries: JournalEntry[], exportedAt = new Date().toISOString()): JournalBackup {
  return { version: BACKUP_VERSION, exportedAt, entries };
}

export function parseJournalBackup(json: string): JournalBackup {
  let value: unknown;

  try {
    value = JSON.parse(json);
  } catch {
    throw new Error("Filen innehåller inte giltig JSON.");
  }

  if (!isRecord(value) || value.version !== BACKUP_VERSION) {
    throw new Error("Backup-versionen stöds inte.");
  }

  if (!isIsoDate(value.exportedAt) || !Array.isArray(value.entries)) {
    throw new Error("Backup-filen saknar giltig metadata.");
  }

  const seenIds = new Set<string>();
  const entries = value.entries.map((entry, index) => {
    const validated = validateBackupEntry(entry, index + 1);

    if (seenIds.has(validated.id)) {
      throw new Error(`Backup-filen innehåller dubbelt id på post ${index + 1}.`);
    }

    seenIds.add(validated.id);
    return validated;
  });

  return { version: BACKUP_VERSION, exportedAt: value.exportedAt, entries };
}

function validateBackupEntry(value: unknown, position: number): JournalEntry {
  if (!isRecord(value)) {
    throw new Error(`Post ${position} är ogiltig.`);
  }

  const { id, timestamp, category, text, symptomFlag, createdAt, updatedAt } = value;

  if (typeof id !== "string" || !id.trim()) {
    throw new Error(`Post ${position} saknar giltigt id.`);
  }

  if (typeof timestamp !== "string" || typeof category !== "string" || typeof text !== "string") {
    throw new Error(`Post ${position} saknar obligatoriska fält.`);
  }

  if (!isCategoryType(category) || typeof symptomFlag !== "boolean" || !isIsoDate(createdAt) || !isIsoDate(updatedAt)) {
    throw new Error(`Post ${position} innehåller ogiltiga fält.`);
  }

  const errors = validateEntryInput({ timestamp, category, text, symptomFlag });
  if (errors.length > 0) {
    throw new Error(`Post ${position} är ogiltig: ${errors.join(" ")}`);
  }

  return { id, timestamp, category, text: text.trim(), symptomFlag, createdAt, updatedAt };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}
