import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { Chip } from "@/components/Chip";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { categoryOptions, type CategoryType } from "@/domain/categories";
import type { JournalEntryInput } from "@/domain/journal";
import { validateEntryInput } from "@/domain/validation";
import { useJournalContext } from "@/features/journal/context/JournalProvider";
import { fromLocalInputValue, toLocalInputValue } from "@/features/journal/utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "EntryForm">;

export function EntryFormScreen({ navigation, route }: Props) {
  const entryId = route.params?.entryId;
  const { ready, repository, refresh } = useJournalContext();
  const [form, setForm] = useState({
    timestampLocal: toLocalInputValue(new Date().toISOString()),
    category: "Frukost" as CategoryType,
    text: "",
    symptomFlag: false,
  });
  const [loadingEntry, setLoadingEntry] = useState(Boolean(entryId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!entryId) {
      setLoadingEntry(false);
      setLoadError(null);
      return;
    }

    if (!ready) {
      setLoadingEntry(true);
      return;
    }

    let active = true;
    setLoadingEntry(true);
    setLoadError(null);

    repository
      .getEntry(entryId)
      .then((entry) => {
        if (!active) {
          return;
        }

        if (!entry) {
          setLoadError("Posten hittades inte.");
          setLoadingEntry(false);
          return;
        }

        setForm({
          timestampLocal: toLocalInputValue(entry.timestamp),
          category: entry.category,
          text: entry.text,
          symptomFlag: entry.symptomFlag,
        });
        setLoadingEntry(false);
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setLoadError("Kunde inte läsa posten.");
          setLoadingEntry(false);
        }
      });

    return () => {
      active = false;
    };
  }, [entryId, ready, repository]);

  async function handleSave() {
    const input: JournalEntryInput = {
      timestamp: fromLocalInputValue(form.timestampLocal),
      category: form.category,
      text: form.text,
      symptomFlag: form.symptomFlag,
    };
    const errors = validateEntryInput(input);

    if (errors.length > 0) {
      Alert.alert("Valideringsfel", errors.join("\n"));
      return;
    }

    setSaving(true);

    try {
      if (entryId) {
        await repository.updateEntry(entryId, input);
      } else {
        await repository.createEntry(input);
      }

      refresh();
      navigation.navigate("JournalList");
    } catch (error) {
      Alert.alert("Kunde inte spara", error instanceof Error ? error.message : "Okänt fel");
    } finally {
      setSaving(false);
    }
  }

  if (entryId && (loadingEntry || !ready)) {
    return (
      <Screen>
        <Text>Laddar post...</Text>
      </Screen>
    );
  }

  if (loadError) {
    return (
      <Screen>
        <Text style={styles.status}>{loadError}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Field label="Tidpunkt" hint="Använd formatet YYYY-MM-DDTHH:mm, till exempel 2026-07-09T08:30">
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          value={form.timestampLocal}
          onChangeText={(timestampLocal) => setForm((current) => ({ ...current, timestampLocal }))}
        />
        <PrimaryButton
          label="Sätt till nu"
          variant="secondary"
          onPress={() =>
            setForm((current) => ({
              ...current,
              timestampLocal: toLocalInputValue(new Date().toISOString()),
            }))
          }
        />
      </Field>

      <Field label="Kategori">
        <View style={styles.chipGroup}>
          {categoryOptions.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={form.category === category}
              onPress={() => setForm((current) => ({ ...current, category }))}
            />
          ))}
        </View>
      </Field>

      <Field label="Text" hint="Max 500 tecken">
        <TextInput
          multiline
          numberOfLines={6}
          style={[styles.input, styles.textArea]}
          value={form.text}
          onChangeText={(text) => setForm((current) => ({ ...current, text }))}
          placeholder="Skriv vad du åt, drack eller tog för medicin."
        />
        <Text style={styles.counter}>{form.text.length}/500</Text>
      </Field>

      <View style={styles.switchRow}>
        <View style={styles.switchCopy}>
          <Text style={styles.switchTitle}>Markera symptom</Text>
          <Text style={styles.switchHint}>Används för att hitta reaktioner snabbare i historiken.</Text>
        </View>
        <Switch
          value={form.symptomFlag}
          onValueChange={(symptomFlag) => setForm((current) => ({ ...current, symptomFlag }))}
        />
      </View>

      <PrimaryButton
        label={saving ? "Sparar..." : "Spara"}
        disabled={saving || !ready}
        onPress={handleSave}
      />
      {!ready ? <Text style={styles.status}>Databasen startar. Försök spara om en stund.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddc8b2",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#261a13",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  counter: {
    textAlign: "right",
    color: "#6b5b50",
  },
  switchRow: {
    backgroundColor: "#f7efe5",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  switchTitle: {
    fontWeight: "700",
    color: "#3f3024",
  },
  switchHint: {
    color: "#6b5b50",
  },
  status: {
    color: "#7a3d13",
    textAlign: "center",
  },
});
