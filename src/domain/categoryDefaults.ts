import { isCategoryType, type CategoryType } from "./categories";

export type CategoryTimePeriod = {
  id: string;
  startTime: string;
  endTime: string;
  category: CategoryType;
};

export type CategoryDefaultSettings = {
  defaultCategory: CategoryType;
  periods: CategoryTimePeriod[];
};

export const DEFAULT_CATEGORY_SETTINGS: CategoryDefaultSettings = {
  defaultCategory: "Frukost",
  periods: [],
};

type MinuteSpan = { start: number; end: number };

export function getSuggestedCategory(
  settings: CategoryDefaultSettings,
  timestampLocal: string,
): CategoryType {
  const timeMatch = timestampLocal.match(/T(\d{2}:\d{2})/);

  if (!timeMatch) {
    return settings.defaultCategory;
  }

  const minute = parseTime(timeMatch[1]);

  if (minute === null) {
    return settings.defaultCategory;
  }

  return (
    settings.periods.find((period) => periodContainsMinute(period, minute))?.category ??
    settings.defaultCategory
  );
}

export function resolveCategoryForTimestamp(
  settings: CategoryDefaultSettings,
  timestampLocal: string,
  currentCategory: CategoryType,
  manuallySelected: boolean,
) {
  return manuallySelected
    ? currentCategory
    : getSuggestedCategory(settings, timestampLocal);
}

export function validateCategoryDefaultSettings(settings: CategoryDefaultSettings) {
  const errors: string[] = [];

  if (!isCategoryType(settings.defaultCategory)) {
    errors.push("Välj en giltig standardkategori.");
  }

  const periodSpans = settings.periods.map((period, index) => {
    const start = parseTime(period.startTime);
    const end = parseTime(period.endTime);

    if (!isCategoryType(period.category)) {
      errors.push(`Period ${index + 1} saknar en giltig kategori.`);
    }

    if (start === null || end === null) {
      errors.push(`Period ${index + 1} måste ha giltiga tider i formatet TT:MM.`);
      return [];
    }

    if (start === end) {
      errors.push(`Period ${index + 1} måste ha olika start- och sluttid.`);
      return [];
    }

    return splitIntoDaySpans(start, end);
  });

  for (let left = 0; left < periodSpans.length; left += 1) {
    for (let right = left + 1; right < periodSpans.length; right += 1) {
      if (spansOverlap(periodSpans[left], periodSpans[right])) {
        errors.push(`Period ${left + 1} och ${right + 1} överlappar varandra.`);
      }
    }
  }

  return errors;
}

export function parseTime(value: string) {
  const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function periodContainsMinute(period: CategoryTimePeriod, minute: number) {
  const start = parseTime(period.startTime);
  const end = parseTime(period.endTime);

  if (start === null || end === null || start === end) {
    return false;
  }

  return start < end
    ? minute >= start && minute < end
    : minute >= start || minute < end;
}

function splitIntoDaySpans(start: number, end: number): MinuteSpan[] {
  return start < end
    ? [{ start, end }]
    : [
        { start, end: 24 * 60 },
        { start: 0, end },
      ];
}

function spansOverlap(left: MinuteSpan[], right: MinuteSpan[]) {
  return left.some((leftSpan) =>
    right.some(
      (rightSpan) => leftSpan.start < rightSpan.end && rightSpan.start < leftSpan.end,
    ),
  );
}
