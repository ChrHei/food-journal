import type { CategoryType } from "@/domain/categories";

const legacyCategoryMap: Record<string, CategoryType | "IGNORE"> = {
  Frukost: "Frukost",
  Lunch: "Lunch",
  Middag: "Middag",
  Kvällsmat: "Kvällsmat",
  Dryck: "Dryck",
  Medicin: "Medicin",
  Anteckning: "Anteckning",
  Symptom: "Anteckning",
  Mellanmål: "Anteckning",
};

export function normalizeLegacyCategory(rawCategory: string) {
  const trimmed = rawCategory.trim();
  return legacyCategoryMap[trimmed] ?? "IGNORE";
}
