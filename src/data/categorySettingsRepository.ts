import {
  DEFAULT_CATEGORY_SETTINGS,
  validateCategoryDefaultSettings,
  type CategoryDefaultSettings,
} from "@/domain/categoryDefaults";
import { isCategoryType } from "@/domain/categories";

import {
  CATEGORY_PERIODS_TABLE_NAME,
  CATEGORY_SETTINGS_TABLE_NAME,
  getDatabase,
} from "./database";

export type CategorySettingsRepository = {
  getSettings: () => Promise<CategoryDefaultSettings>;
  saveSettings: (settings: CategoryDefaultSettings) => Promise<void>;
};

export function createCategorySettingsRepository(): CategorySettingsRepository {
  return {
    async getSettings() {
      const db = await getDatabase();
      const settingsRow = await db.getFirstAsync<{ default_category: string }>(
        `SELECT default_category FROM ${CATEGORY_SETTINGS_TABLE_NAME} WHERE id = 1`,
      );
      const rows = await db.getAllAsync<CategoryPeriodRow>(
        `SELECT id, start_time, end_time, category
         FROM ${CATEGORY_PERIODS_TABLE_NAME}
         ORDER BY sort_order, start_time`,
      );

      return {
        defaultCategory:
          settingsRow && isCategoryType(settingsRow.default_category)
            ? settingsRow.default_category
            : DEFAULT_CATEGORY_SETTINGS.defaultCategory,
        periods: rows
          .filter((row) => isCategoryType(row.category))
          .map((row) => ({
            id: row.id,
            startTime: row.start_time,
            endTime: row.end_time,
            category: row.category as CategoryDefaultSettings["defaultCategory"],
          })),
      };
    },

    async saveSettings(settings) {
      const errors = validateCategoryDefaultSettings(settings);

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      const db = await getDatabase();

      await db.withExclusiveTransactionAsync(async (transaction) => {
        await transaction.runAsync(
          `INSERT INTO ${CATEGORY_SETTINGS_TABLE_NAME} (id, default_category)
           VALUES (1, ?)
           ON CONFLICT(id) DO UPDATE SET default_category = excluded.default_category`,
          settings.defaultCategory,
        );
        await transaction.runAsync(`DELETE FROM ${CATEGORY_PERIODS_TABLE_NAME}`);

        for (const [index, period] of settings.periods.entries()) {
          await transaction.runAsync(
            `INSERT INTO ${CATEGORY_PERIODS_TABLE_NAME}
             (id, start_time, end_time, category, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            period.id,
            period.startTime,
            period.endTime,
            period.category,
            index,
          );
        }
      });
    },
  };
}

type CategoryPeriodRow = {
  id: string;
  start_time: string;
  end_time: string;
  category: string;
};
