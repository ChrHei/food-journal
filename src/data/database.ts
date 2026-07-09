import * as SQLite from "expo-sqlite";

export const JOURNAL_TABLE_NAME = "journal_entries";

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("matjournal.db");
  }

  return databasePromise;
}

export async function initializeDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${JOURNAL_TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      timestamp TEXT NOT NULL,
      category TEXT NOT NULL,
      text TEXT NOT NULL,
      symptom_flag INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_journal_entries_timestamp
      ON ${JOURNAL_TABLE_NAME} (timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_journal_entries_category
      ON ${JOURNAL_TABLE_NAME} (category);
  `);
}
