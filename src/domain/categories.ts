export const categoryOptions = [
  "Frukost",
  "Lunch",
  "Middag",
  "Mellanmål",
  "Kvällsmat",
  "Dryck",
  "Medicin",
  "Anteckning",
] as const;

export type CategoryType = (typeof categoryOptions)[number];

export function isCategoryType(value: string): value is CategoryType {
  return categoryOptions.includes(value as CategoryType);
}
