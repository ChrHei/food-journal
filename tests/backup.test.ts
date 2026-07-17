import { BACKUP_VERSION, createJournalBackup, parseJournalBackup } from "@/domain/backup";

const entry = {
  id: "entry-1",
  timestamp: "2026-07-17T10:00:00.000Z",
  category: "Lunch" as const,
  text: "Soppa",
  symptomFlag: false,
  createdAt: "2026-07-17T10:00:00.000Z",
  updatedAt: "2026-07-17T10:00:00.000Z",
};

describe("journal backup", () => {
  it("creates and accepts an empty backup", () => {
    const backup = createJournalBackup([], "2026-07-17T12:00:00.000Z");
    expect(backup).toEqual({ version: BACKUP_VERSION, exportedAt: "2026-07-17T12:00:00.000Z", entries: [] });
    expect(parseJournalBackup(JSON.stringify(backup))).toEqual(backup);
  });

  it("accepts valid entries", () => {
    expect(parseJournalBackup(JSON.stringify(createJournalBackup([entry]))).entries).toEqual([entry]);
  });

  it.each([
    ["invalid JSON", "{"],
    ["unknown version", JSON.stringify({ version: 99, exportedAt: entry.createdAt, entries: [] })],
    ["missing field", JSON.stringify({ version: 1, exportedAt: entry.createdAt, entries: [{ ...entry, text: undefined }] })],
    ["invalid field", JSON.stringify({ version: 1, exportedAt: entry.createdAt, entries: [{ ...entry, category: "Okänd" }] })],
    ["duplicate id", JSON.stringify({ version: 1, exportedAt: entry.createdAt, entries: [entry, { ...entry }] })],
  ])("rejects %s", (_name, json) => {
    expect(() => parseJournalBackup(json)).toThrow();
  });
});
