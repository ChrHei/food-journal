import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { CommonActions } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { CategoryChoices } from "@/components/CategoryChoices";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import {
  upsertCategoryTimePeriod,
  validateCategoryDefaultSettings,
  type CategoryTimePeriod,
} from "@/domain/categoryDefaults";
import { useJournalContext } from "@/features/journal/context/JournalProvider";

type Props = NativeStackScreenProps<RootStackParamList, "CategoryPeriodEditor">;
type TimeField = "startTime" | "endTime";

export function CategoryPeriodEditorScreen({ navigation, route }: Props) {
  const { categorySettingsRepository } = useJournalContext();
  const { settings, settingsRouteKey, periodId } = route.params;
  const existingPeriod = periodId
    ? settings.periods.find((candidate) => candidate.id === periodId)
    : undefined;
  const [period, setPeriod] = useState<CategoryTimePeriod>(() =>
    existingPeriod ?? {
      id: createPeriodId(),
      startTime: "06:00",
      endTime: "09:00",
      category: settings.defaultCategory,
    },
  );
  const [timeField, setTimeField] = useState<TimeField | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTimeChange(event: DateTimePickerEvent, selectedTime?: Date) {
    const selectedField = timeField;
    setTimeField(null);

    if (!selectedField || event.type !== "set" || !selectedTime) {
      return;
    }

    setPeriod((current) => ({
      ...current,
      [selectedField]: formatTime(selectedTime),
    }));
    setError(null);
  }

  async function handleSave() {
    const nextSettings = upsertCategoryTimePeriod(settings, period);
    const errors = validateCategoryDefaultSettings(nextSettings);

    if (errors.length > 0) {
      const message = errors.join("\n");
      setError(message);
      Alert.alert("Kontrollera tidsperioden", message);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await categorySettingsRepository.saveSettings(nextSettings);
      navigation.dispatch({
        ...CommonActions.setParams({ updatedSettings: nextSettings }),
        source: settingsRouteKey,
      });
      navigation.goBack();
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Kunde inte spara tidsperioden.";
      setError(message);
      Alert.alert("Kunde inte spara", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={saving ? "Sparar..." : "Spara tidsperiod"}
          disabled={saving}
          onPress={handleSave}
        />
      }
    >
      <View style={styles.intro}>
        <Text style={styles.title}>{periodId ? "Redigera tidsperiod" : "Ny tidsperiod"}</Text>
        <Text style={styles.help}>
          Starttiden ingår i perioden, men sluttiden ingår inte. Perioden får passera midnatt.
        </Text>
      </View>

      <View style={styles.timeRow}>
        <TimeButton
          label="Start"
          value={period.startTime}
          onPress={() => setTimeField("startTime")}
        />
        <TimeButton
          label="Slut"
          value={period.endTime}
          onPress={() => setTimeField("endTime")}
        />
      </View>

      <Field label="Kategori">
        <CategoryChoices
          value={period.category}
          onChange={(category) => {
            setPeriod((current) => ({ ...current, category }));
            setError(null);
          }}
        />
      </Field>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {timeField ? (
        <DateTimePicker
          value={getTimePickerValue(period[timeField])}
          mode="time"
          display="default"
          is24Hour
          onChange={handleTimeChange}
        />
      ) : null}
    </Screen>
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

function formatTime(value: Date) {
  return `${`${value.getHours()}`.padStart(2, "0")}:${`${value.getMinutes()}`.padStart(2, "0")}`;
}

function createPeriodId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const styles = StyleSheet.create({
  intro: { gap: 6 },
  title: { color: "#2d2018", fontSize: 24, fontWeight: "800" },
  help: { color: "#6b5b50", lineHeight: 20 },
  timeRow: { flexDirection: "row", gap: 10 },
  timeButton: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#ffffff",
    borderColor: "#ddc8b2",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  timeLabel: {
    color: "#8f715b",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timeValue: { color: "#261a13", fontSize: 20, fontWeight: "700", marginTop: 4 },
  error: {
    backgroundColor: "#f8e3df",
    borderRadius: 14,
    color: "#8b2f25",
    lineHeight: 20,
    padding: 14,
  },
});
