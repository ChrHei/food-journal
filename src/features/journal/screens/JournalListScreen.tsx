import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import type { JournalEntry, JournalFilter } from "@/domain/journal";
import { useJournalEntries } from "@/features/journal/hooks/useJournalEntries";
import { formatDateTime } from "@/features/journal/utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "JournalList">;

export function JournalListScreen({ navigation, route }: Props) {
  const filter = route.params?.filter;
  const { entries, loading } = useJournalEntries(filter);
  const filterSummary = useMemo(() => summarizeFilter(filter), [filter]);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Historik</Text>
          <Text style={styles.subtitle}>{filterSummary}</Text>
        </View>
        <PrimaryButton
          label="Filter"
          variant="secondary"
          onPress={() => navigation.navigate("Filter", { filter })}
        />
      </View>

      <PrimaryButton label="Ny post" onPress={() => navigation.navigate("EntryForm")} />

      {loading ? <ActivityIndicator color="#7a3d13" /> : null}

      {!loading && entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Inga poster hittades</Text>
          <Text style={styles.emptyText}>Justera filtret eller registrera en ny post.</Text>
        </View>
      ) : null}

      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onPress={() => navigation.navigate("EntryDetail", { entryId: entry.id })}
        />
      ))}
    </Screen>
  );
}

function EntryCard({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{entry.category}</Text>
        {entry.symptomFlag ? <Text style={styles.symptom}>Symptom</Text> : null}
      </View>
      <Text style={styles.timestamp}>{formatDateTime(entry.timestamp)}</Text>
      <Text style={styles.text}>{entry.text}</Text>
    </Pressable>
  );
}

function summarizeFilter(filter?: JournalFilter) {
  if (!filter) {
    return "Alla poster";
  }

  const parts: string[] = [];

  if (filter.category) {
    parts.push(filter.category);
  }

  if (filter.symptomsOnly) {
    parts.push("endast symptom");
  }

  if (filter.from) {
    parts.push(`från ${filter.from.slice(0, 10)}`);
  }

  if (filter.to) {
    parts.push(`till ${filter.to.slice(0, 10)}`);
  }

  return parts.length > 0 ? parts.join(" • ") : "Alla poster";
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#261a13",
  },
  subtitle: {
    color: "#6b5b50",
  },
  emptyState: {
    backgroundColor: "#f7efe5",
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3f3024",
  },
  emptyText: {
    color: "#6b5b50",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "#eadbca",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3f3024",
  },
  symptom: {
    color: "#9b2c2c",
    fontWeight: "700",
  },
  timestamp: {
    color: "#7a3d13",
    fontWeight: "600",
  },
  text: {
    color: "#312720",
    lineHeight: 22,
  },
});
