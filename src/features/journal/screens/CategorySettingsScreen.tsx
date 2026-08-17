import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Chip } from "@/components/Chip";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import {
  DEFAULT_CATEGORY_SETTINGS,
  validateCategoryDefaultSettings,
  type CategoryDefaultSettings,
  type CategoryTimePeriod,
} from "@/domain/categoryDefaults";
import { categoryOptions, type CategoryType } from "@/domain/categories";
import { useJournalContext } from "@/features/journal/context/JournalProvider";

type Props = NativeStackScreenProps<RootStackParamList, "CategorySettings">;
type TimePickerTarget = { periodId: string; field: "startTime" | "endTime" };

export function CategorySettingsScreen({}: Props) {
  const { categorySettingsRepository, ready } = useJournalContext();
  const [settings, setSettings] = useState<CategoryDefaultSettings>(DEFAULT_CATEGORY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timePickerTarget, setTimePickerTarget] = useState<TimePickerTarget | null>(null);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let active = true;

    categorySettingsRepository
      .getSettings()
      .then((loadedSettings) => {
        if (active) {
          setSettings(loadedSettings);
          setLoading(false);
        }
      })
      .catch((loadError) => {
        console.error(loadError);
        if (active) {
          setError("Kunde inte läsa kategoriinställningarna.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [categorySettingsRepository, ready]);

  function addPeriod() {
    setSettings((current) => ({
      ...current,
      periods: [
        ...current.periods,
        {
          id: createPeriodId(),
          startTime: "06:00",
          endTime: "09:00",
          category: current.defaultCategory,
        },
      ],
    }));
    setError(null);
  }

  function updatePeriod(id: string, update: Partial<CategoryTimePeriod>) {
    setSettings((current) => ({
      ...current,
      periods: current.periods.map((period) =>
        period.id === id ? { ...period, ...update } : period,
      ),
    }));
    setError(null);
  }

  function removePeriod(id: string) {
    setSettings((current) => ({
      ...current,
      periods: current.periods.filter((period) => period.id !== id),
    }));
    setError(null);
  }

  function handleTimeChange(event: DateTimePickerEvent, selectedTime?: Date) {
    const target = timePickerTarget;
    setTimePickerTarget(null);

    if (!target || event.type !== "set" || !selectedTime) {
      return;
    }

    updatePeriod(target.periodId, {
      [target.field]: `${selectedTime.getHours()}`.padStart(2, "0") +
        `:${`${selectedTime.getMinutes()}`.padStart(2, "0")}`,
    });
  }

  async function handleSave() {
    const errors = validateCategoryDefaultSettings(settings);

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await categorySettingsRepository.saveSettings(settings);
      Alert.alert("Sparat", "Kategoriinställningarna har sparats.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kunde inte spara inställningarna.");
    } finally {
      setSaving(false);
    }
  }

  const selectedTime = timePickerTarget
    ? getTimePickerValue(
        settings.periods.find((period) => period.id === timePickerTarget.periodId)?.[
          timePickerTarget.field
        ] ?? "00:00",
      )
    : new Date();

  if (loading || !ready) {
    return (
      <Screen>
        <Text style={styles.status}>Laddar inställningar...</Text>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={saving ? "Sparar..." : "Spara inställningar"}
          disabled={saving}
          onPress={handleSave}
        />
      }
    >
      <View style={styles.intro}>
        <Text style={styles.title}>Automatisk kategori</Text>
        <Text style={styles.help}>
          Nya poster får en kategori utifrån klockslaget. Periodens starttid ingår, men
          sluttiden ingår inte.
        </Text>
      </View>

      <Field label="Standardkategori" hint="Används när ingen tidsperiod matchar.">
        <CategoryChoices
          value={settings.defaultCategory}
          onChange={(defaultCategory) => setSettings((current) => ({ ...current, defaultCategory }))}
        />
      </Field>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionCopy}>
          <Text style={styles.sectionTitle}>Tidsperioder</Text>
          <Text style={styles.help}>Perioder får passera midnatt men inte överlappa.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={addPeriod} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>+ Lägg till</Text>
        </Pressable>
      </View>

      {settings.periods.length === 0 ? (
        <Text style={styles.empty}>Inga tidsperioder har lagts till.</Text>
      ) : null}

      {settings.periods.map((period, index) => (
        <View key={period.id} style={styles.periodCard}>
          <View style={styles.periodHeader}>
            <Text style={styles.periodTitle}>Period {index + 1}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ta bort period ${index + 1}`}
              onPress={() => removePeriod(period.id)}
            >
              <Text style={styles.removeLabel}>Ta bort</Text>
            </Pressable>
          </View>

          <View style={styles.timeRow}>
            <TimeButton
              label="Start"
              value={period.startTime}
              onPress={() => setTimePickerTarget({ periodId: period.id, field: "startTime" })}
            />
            <TimeButton
              label="Slut"
              value={period.endTime}
              onPress={() => setTimePickerTarget({ periodId: period.id, field: "endTime" })}
            />
          </View>

          <Text style={styles.categoryLabel}>Kategori</Text>
          <CategoryChoices
            value={period.category}
            onChange={(category) => updatePeriod(period.id, { category })}
          />
        </View>
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {timePickerTarget ? (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          is24Hour
          onChange={handleTimeChange}
        />
      ) : null}
    </Screen>
  );
}

function CategoryChoices({
  value,
  onChange,
}: {
  value: CategoryType;
  onChange: (category: CategoryType) => void;
}) {
  return (
    <View style={styles.chipGroup}>
      {categoryOptions.map((category) => (
        <Chip
          icon={<CategoryIcon category={category} size={26} />}
          key={category}
          label={category}
          selected={value === category}
          onPress={() => onChange(category)}
        />
      ))}
    </View>
  );
}

function TimeButton({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.timeButton}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{value}</Text>
    </Pressable>
  );
}

function getTimePickerValue(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const value = new Date();
  value.setHours(hours, minutes, 0, 0);
  return value;
}

function createPeriodId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const styles = StyleSheet.create({
  intro: { gap: 6 },
  title: { color: "#2d2018", fontSize: 24, fontWeight: "800" },
  help: { color: "#6b5b50", lineHeight: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  sectionCopy: { flex: 1, gap: 3 },
  sectionTitle: { color: "#3f3024", fontSize: 18, fontWeight: "800" },
  addButton: { backgroundColor: "#f2dfce", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  addButtonLabel: { color: "#7a3d13", fontWeight: "800" },
  empty: { backgroundColor: "#fffaf5", borderRadius: 16, color: "#8d7767", padding: 16 },
  periodCard: { backgroundColor: "#fffaf5", borderColor: "#ead8c9", borderRadius: 20, borderWidth: 1, gap: 14, padding: 16 },
  periodHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  periodTitle: { color: "#3f3024", fontSize: 17, fontWeight: "800" },
  removeLabel: { color: "#a74638", fontWeight: "700" },
  timeRow: { flexDirection: "row", gap: 10 },
  timeButton: { flex: 1, minWidth: 0, backgroundColor: "#ffffff", borderColor: "#ddc8b2", borderRadius: 14, borderWidth: 1, padding: 12 },
  timeLabel: { color: "#8f715b", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  timeValue: { color: "#261a13", fontSize: 20, fontWeight: "700", marginTop: 4 },
  categoryLabel: { color: "#8f715b", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  chipGroup: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  error: { backgroundColor: "#f8e3df", borderRadius: 14, color: "#8b2f25", lineHeight: 20, padding: 14 },
  status: { color: "#7a3d13", textAlign: "center" },
});
