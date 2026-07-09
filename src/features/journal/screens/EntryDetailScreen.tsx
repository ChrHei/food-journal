import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import type { JournalEntry } from "@/domain/journal";
import { useJournalContext } from "@/features/journal/context/JournalProvider";
import { formatDateTime } from "@/features/journal/utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "EntryDetail">;

export function EntryDetailScreen({ navigation, route }: Props) {
  const { repository, refresh } = useJournalContext();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    repository.getEntry(route.params.entryId).then(setEntry).catch(console.error);
  }, [repository, route.params.entryId]);

  async function handleDelete() {
    await repository.deleteEntry(route.params.entryId);
    refresh();
    navigation.navigate("JournalList");
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
        <Text style={styles.category}>{entry.category}</Text>
        <Text style={styles.timestamp}>{formatDateTime(entry.timestamp)}</Text>
        <Text style={styles.body}>{entry.text}</Text>
        <Text style={styles.meta}>Symptommarkerad: {entry.symptomFlag ? "Ja" : "Nej"}</Text>
      </View>

      <PrimaryButton
        label="Redigera"
        onPress={() => navigation.navigate("EntryForm", { entryId: entry.id })}
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
  category: {
    fontSize: 24,
    fontWeight: "800",
    color: "#261a13",
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
  meta: {
    color: "#6b5b50",
  },
});
