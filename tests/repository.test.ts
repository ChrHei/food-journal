import { buildListEntriesQuery } from "@/data/journalRepository";
import { normalizeLegacyCategory } from "@/data/excelNormalization";

describe("repository helpers", () => {
  it("builds query with all supported filters", () => {
    const result = buildListEntriesQuery({
      from: "2026-07-01T00:00:00.000Z",
      to: "2026-07-31T23:59:59.999Z",
      category: "Symptom",
      symptomsOnly: true,
    });

    expect(result.query).toContain("timestamp >= ?");
    expect(result.query).toContain("timestamp <= ?");
    expect(result.query).toContain("category = ?");
    expect(result.query).toContain("symptom_flag = 1");
    expect(result.params).toEqual([
      "2026-07-01T00:00:00.000Z",
      "2026-07-31T23:59:59.999Z",
      "Symptom",
    ]);
  });

  it("normalizes legacy excel categories", () => {
    expect(normalizeLegacyCategory(" Mellanmål ")).toBe("Anteckning");
    expect(normalizeLegacyCategory("Symptom")).toBe("Symptom");
    expect(normalizeLegacyCategory("Okänd")).toBe("IGNORE");
  });
});
