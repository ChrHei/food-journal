import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { CategoryChoices } from "@/components/CategoryChoices";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import {
  validateCategoryDefaultSettings,
  type CategoryDefaultSettings,
  type CategoryTimePeriod,
} from "@/domain/categoryDefaults";
import { useJournalContext } from "@/features/journal/context/JournalProvider";

type Props = NativeStackScreenProps<RootStackParamList, "CategorySettings">;

export function CategorySettingsScreen({ navigation, route }: Props) {
  const { categorySettingsRepository, ready } = useJournalContext();
  const [settings, setSettings] = useState<CategoryDefaultSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingPeriodId, setDeletingPeriodId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let active = true;
    setLoading(true);
    setLoadError(null);

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
          setSettings(null);
          setLoadError("Kunde inte läsa kategori-inställningarna.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [categorySettingsRepository, loadAttempt, ready]);

  useEffect(() => {
    if (!route.params?.updatedSettings) {
      return;
    }

    setSettings(route.params.updatedSettings);
    setError(null);
    navigation.setParams({ updatedSettings: undefined });
  }, [navigation, route.params?.updatedSettings]);

  async function handleSave() {
    if (!settings) {
      return;
    }

    const errors = validateCategoryDefaultSettings(settings);

    if (errors.length > 0) {
      const message = errors.join("\n");
      setError(message);
      Alert.alert("Kontrollera inställningarna", message);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await categorySettingsRepository.saveSettings(settings);
      Alert.alert("Sparat", "Kategori-inställningarna har sparats.");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Kunde inte spara inställningarna.";
      setError(message);
      Alert.alert("Kunde inte spara", message);
    } finally {
      setSaving(false);
    }
  }

  function confirmRemovePeriod(period: CategoryTimePeriod) {
    Alert.alert(
      "Ta bort tidsperiod",
      `Vill du ta bort ${period.category} ${period.startTime}–${period.endTime}?`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: () => void removePeriod(period.id),
        },
      ],
    );
  }

  async function removePeriod(periodId: string) {
    if (!settings) {
      return;
    }

    const nextSettings = {
      ...settings,
      periods: settings.periods.filter((period) => period.id !== periodId),
    };

    setDeletingPeriodId(periodId);
    setError(null);

    try {
      await categorySettingsRepository.saveSettings(nextSettings);
      setSettings(nextSettings);
    } catch (removeError) {
      const message =
        removeError instanceof Error ? removeError.message : "Kunde inte ta bort tidsperioden.";
      setError(message);
      Alert.alert("Kunde inte ta bort", message);
    } finally {
      setDeletingPeriodId(null);
    }
  }

  if (loading || !ready) {
    return (
      <Screen>
        <Text style={styles.status}>Laddar inställningar...</Text>
      </Screen>
    );
  }

  if (loadError || !settings) {
    return (
      <Screen
        footer={
          <PrimaryButton
            label="Försök igen"
            onPress={() => setLoadAttempt((attempt) => attempt + 1)}
          />
        }
      >
        <View style={styles.loadErrorCard}>
          <Text style={styles.loadErrorTitle}>Inställningarna kunde inte öppnas</Text>
          <Text style={styles.help}>
            {loadError ?? "Försök läsa kategori-inställningarna igen."}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={saving ? "Sparar..." : "Spara inställningar"}
          disabled={saving || deletingPeriodId !== null}
          onPress={handleSave}
        />
      }
    >
      <View style={styles.intro}>
        <Text style={styles.title}>Kategori-inställningar</Text>
        <Text style={styles.help}>
          Nya poster får en kategori utifrån klockslaget. Periodens starttid ingår, men
          sluttiden ingår inte.
        </Text>
      </View>

      <Field label="Standardkategori" hint="Används när ingen tidsperiod matchar.">
        <CategoryChoices
          disabled={deletingPeriodId !== null}
          value={settings.defaultCategory}
          onChange={(defaultCategory) => {
            setSettings((current) =>
              current ? { ...current, defaultCategory } : current,
            );
            setError(null);
          }}
        />
      </Field>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionCopy}>
          <Text style={styles.sectionTitle}>Tidsperioder</Text>
          <Text style={styles.help}>Perioder får passera midnatt men inte överlappa.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={deletingPeriodId !== null}
          onPress={() =>
            navigation.navigate("CategoryPeriodEditor", {
              settings,
              settingsRouteKey: route.key,
            })
          }
          style={[styles.addButton, deletingPeriodId !== null && styles.disabled]}
        >
          <Text style={styles.addButtonLabel}>+ Lägg till</Text>
        </Pressable>
      </View>

      {settings.periods.length === 0 ? (
        <Text style={styles.empty}>Inga tidsperioder har lagts till.</Text>
      ) : (
        <View style={styles.periodList}>
          {settings.periods.map((period, index) => (
            <PeriodRow
              busy={deletingPeriodId !== null}
              deleting={deletingPeriodId === period.id}
              index={index}
              key={period.id}
              period={period}
              onEdit={() =>
                navigation.navigate("CategoryPeriodEditor", {
                  settings,
                  settingsRouteKey: route.key,
                  periodId: period.id,
                })
              }
              onRemove={() => confirmRemovePeriod(period)}
            />
          ))}
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

function PeriodRow({
  busy,
  deleting,
  index,
  period,
  onEdit,
  onRemove,
}: {
  busy: boolean;
  deleting: boolean;
  index: number;
  period: CategoryTimePeriod;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.periodRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Redigera period ${index + 1}, ${period.category} ${period.startTime} till ${period.endTime}`}
        disabled={busy}
        onPress={onEdit}
        style={({ pressed }) => [styles.editArea, pressed && styles.pressed]}
      >
        <CategoryIcon category={period.category} size={28} />
        <View style={styles.periodCopy}>
          <Text numberOfLines={1} style={styles.periodCategory}>
            {period.category}
          </Text>
          <Text style={styles.periodTime}>
            {period.startTime}–{period.endTime}
          </Text>
        </View>
        <Text style={styles.editLabel}>Redigera ›</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ta bort period ${index + 1}`}
        disabled={busy}
        onPress={onRemove}
        style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
      >
        <Text style={styles.removeLabel}>{deleting ? "Tar bort..." : "Ta bort"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 6 },
  title: { color: "#2d2018", fontSize: 24, fontWeight: "800" },
  help: { color: "#6b5b50", lineHeight: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  sectionCopy: { flex: 1, gap: 3 },
  sectionTitle: { color: "#3f3024", fontSize: 18, fontWeight: "800" },
  addButton: {
    backgroundColor: "#f2dfce",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButtonLabel: { color: "#7a3d13", fontWeight: "800" },
  empty: { backgroundColor: "#fffaf5", borderRadius: 16, color: "#8d7767", padding: 16 },
  periodList: {
    backgroundColor: "#fffaf5",
    borderColor: "#ead8c9",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  periodRow: { borderBottomColor: "#ead8c9", borderBottomWidth: 1 },
  editArea: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  periodCopy: { flex: 1, minWidth: 0 },
  periodCategory: { color: "#3f3024", fontSize: 16, fontWeight: "800" },
  periodTime: { color: "#6b5b50", marginTop: 2 },
  editLabel: { color: "#7a3d13", fontWeight: "700" },
  removeButton: {
    alignItems: "flex-end",
    backgroundColor: "#fff6f3",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  removeLabel: { color: "#a74638", fontWeight: "700" },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  error: {
    backgroundColor: "#f8e3df",
    borderRadius: 14,
    color: "#8b2f25",
    lineHeight: 20,
    padding: 14,
  },
  status: { color: "#7a3d13", textAlign: "center" },
  loadErrorCard: { backgroundColor: "#f8e3df", borderRadius: 16, gap: 6, padding: 16 },
  loadErrorTitle: { color: "#8b2f25", fontSize: 18, fontWeight: "800" },
});
