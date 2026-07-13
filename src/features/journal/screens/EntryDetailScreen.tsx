import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { createEditEntryFormNavigationTarget } from "@/app/navigation/entryFormNavigation";
import { CategoryIcon } from "@/components/CategoryIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SymptomBadge } from "@/components/SymptomBadge";
import type { JournalEntry } from "@/domain/journal";
import { useJournalContext } from "@/features/journal/context/JournalProvider";
import { formatDateTime } from "@/features/journal/utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "EntryDetail">;

export function EntryDetailScreen({ navigation, route }: Props) {
  const { ready, repository, refresh } = useJournalContext();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) {
      setLoading(true);
      return;
    }

    let active = true;
    setLoading(true);
    setLoadError(null);

    repository
      .getEntry(route.params.entryId)
      .then((result) => {
        if (active) {
          setEntry(result);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setLoadError("Kunde inte läsa posten.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [ready, repository, route.params.entryId]);

  async function handleDelete() {
    await repository.deleteEntry(route.params.entryId);
    refresh();
    navigation.navigate("JournalList");
  }

  if (loading) {
    return (
      <Screen>
        <Text>Laddar post...</Text>
      </Screen>
    );
  }

  if (loadError) {
    return (
      <Screen>
        <Text>{loadError}</Text>
      </Screen>
    );
  }

  if (!entry) {
    return (
      <Screen>
        <Text>Posten hittades inte.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <View style={styles.categoryRow}>
          <CategoryIcon category={entry.category} size={68} />
          <View style={styles.categoryCopy}>
            <Text style={styles.category}>{entry.category}</Text>
            <Text style={styles.timestamp}>{formatDateTime(entry.timestamp)}</Text>
            {entry.symptomFlag ? <SymptomBadge align="left" /> : null}
          </View>
        </View>
        <Text style={styles.body}>{entry.text}</Text>
      </View>

      <PrimaryButton
        label="Redigera"
        onPress={() => navigation.navigate(createEditEntryFormNavigationTarget(entry.id))}
      />
      <PrimaryButton
        label="Radera"
        variant="danger"
        onPress={() =>
          Alert.alert("Radera post", "Vill du radera posten permanent?", [
            { text: "Avbryt", style: "cancel" },
            { text: "Radera", style: "destructive", onPress: () => void handleDelete() },
          ])
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#eadbca",
    padding: 20,
    gap: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  categoryCopy: {
    flex: 1,
    gap: 4,
  },
  category: {
    fontSize: 24,
    fontWeight: "800",
    color: "#261a13",
    flexShrink: 1,
  },
  timestamp: {
    color: "#7a3d13",
    fontWeight: "700",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#312720",
  },
});
