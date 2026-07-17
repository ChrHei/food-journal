import { JOURNAL_TABLE_NAME, getDatabase } from "./database";
import type { JournalEntry, JournalEntryInput, JournalFilter } from "@/domain/journal";
import { validateEntryInput } from "@/domain/validation";

export type JournalRepository = {
  createEntry: (input: JournalEntryInput) => Promise<JournalEntry>;
  updateEntry: (id: string, input: JournalEntryInput) => Promise<JournalEntry>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => Promise<JournalEntry | null>;
  listEntries: (filter?: JournalFilter) => Promise<JournalEntry[]>;
  importEntries: (entries: JournalEntry[]) => Promise<{ imported: number; skipped: number }>;
};

export function createJournalRepository(): JournalRepository {
  return {
    async createEntry(input) {
      assertValidInput(input);

      const db = await getDatabase();
      const now = new Date().toISOString();
      const entry: JournalEntry = {
        id: createId(),
        timestamp: input.timestamp,
        category: input.category,
        text: input.text.trim(),
        symptomFlag: input.symptomFlag,
        createdAt: now,
        updatedAt: now,
      };

      const params = [
        entry.id,
        entry.timestamp,
        entry.category,
        entry.text,
        entry.symptomFlag ? 1 : 0,
        entry.createdAt,
        entry.updatedAt,
      ] as const;

      await db.runAsync(
        `INSERT INTO ${JOURNAL_TABLE_NAME} (
          id, timestamp, category, text, symptom_flag, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ...params,
      );

      return entry;
    },

    async updateEntry(id, input) {
      assertValidInput(input);

      const existing = await this.getEntry(id);

      if (!existing) {
        throw new Error("Posten hittades inte.");
      }

      const db = await getDatabase();
      const updatedAt = new Date().toISOString();

      const params = [
        input.timestamp,
        input.category,
        input.text.trim(),
        input.symptomFlag ? 1 : 0,
        updatedAt,
        id,
      ] as const;

      await db.runAsync(
        `UPDATE ${JOURNAL_TABLE_NAME}
         SET timestamp = ?, category = ?, text = ?, symptom_flag = ?, updated_at = ?
         WHERE id = ?`,
        ...params,
      );

      return {
        ...existing,
        ...input,
        text: input.text.trim(),
        updatedAt,
      };
    },

    async deleteEntry(id) {
      const db = await getDatabase();
      await db.runAsync(`DELETE FROM ${JOURNAL_TABLE_NAME} WHERE id = ?`, id);
    },

    async getEntry(id) {
      const db = await getDatabase();
      const row = await db.getFirstAsync<JournalEntryRow>(
        `SELECT * FROM ${JOURNAL_TABLE_NAME} WHERE id = ?`,
        id,
      );

      return row ? mapRow(row) : null;
    },

    async listEntries(filter = {}) {
      const db = await getDatabase();
      const { query, params } = buildListEntriesQuery(filter);
      const rows = await db.getAllAsync<JournalEntryRow>(query, ...params);
      return rows.map(mapRow);
    },

    async importEntries(entries) {
      const db = await getDatabase();
      let imported = 0;
      let skipped = 0;

      await db.withExclusiveTransactionAsync(async (transaction) => {
        for (const entry of entries) {
          const existing = await transaction.getFirstAsync<{ id: string }>(
            `SELECT id FROM ${JOURNAL_TABLE_NAME} WHERE id = ?`,
            entry.id,
          );

          if (existing) {
            skipped += 1;
            continue;
          }

          await transaction.runAsync(
            `INSERT INTO ${JOURNAL_TABLE_NAME} (
              id, timestamp, category, text, symptom_flag, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            entry.id,
            entry.timestamp,
            entry.category,
            entry.text,
            entry.symptomFlag ? 1 : 0,
            entry.createdAt,
            entry.updatedAt,
          );
          imported += 1;
        }
      });

      return { imported, skipped };
    },
  };
}

type JournalEntryRow = {
  id: string;
  timestamp: string;
  category: string;
  text: string;
  symptom_flag: number;
  created_at: string;
  updated_at: string;
};

export function buildListEntriesQuery(filter: JournalFilter) {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filter.from) {
    conditions.push("timestamp >= ?");
    params.push(filter.from);
  }

  if (filter.to) {
    conditions.push("timestamp <= ?");
    params.push(filter.to);
  }

  if (filter.category) {
    conditions.push("category = ?");
    params.push(filter.category);
  }

  if (filter.symptomsOnly) {
    conditions.push("symptom_flag = 1");
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return {
    query: `SELECT * FROM ${JOURNAL_TABLE_NAME} ${whereClause} ORDER BY timestamp DESC`,
    params,
  };
}

function mapRow(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    category: row.category === "Symptom" ? "Anteckning" : (row.category as JournalEntry["category"]),
    text: row.text,
    symptomFlag: row.symptom_flag === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function assertValidInput(input: JournalEntryInput) {
  const errors = validateEntryInput(input);

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
