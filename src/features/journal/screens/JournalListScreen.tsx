import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createCopyEntryFormNavigationTarget } from "@/app/navigation/entryFormNavigation";
import type { RootStackParamList } from "@/app/navigation/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SymptomBadge } from "@/components/SymptomBadge";
import type { JournalEntry, JournalFilter } from "@/domain/journal";
import { useJournalEntries } from "@/features/journal/hooks/useJournalEntries";
import { formatDateTime } from "@/features/journal/utils/date";
import { shouldCopyFromSwipe } from "@/features/journal/utils/swipe";

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

      <PrimaryButton
        label="Ny post"
        onPress={() => navigation.push("EntryForm")}
      />

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
          onCopy={() => navigation.push("EntryForm", createCopyEntryFormNavigationTarget(entry).params)}
        />
      ))}
    </Screen>
  );
}

function EntryCard({
  entry,
  onPress,
  onCopy,
}: {
  entry: JournalEntry;
  onPress: () => void;
  onCopy: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const didCopy = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dx > 4 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => translateX.setValue(Math.max(0, gesture.dx)),
      onPanResponderRelease: (_, gesture) => {
        if (shouldCopyFromSwipe(gesture.dx, gesture.dy)) {
          didCopy.current = true;
          onCopy();
        }
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => {
          didCopy.current = false;
        });
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.copyUnderlay} pointerEvents="none">
        <Text accessibilityLabel="Kopiera post" style={styles.copyIcon}>⧉</Text>
      </View>
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <Pressable onPress={() => !didCopy.current && onPress()} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryRow}>
              <CategoryIcon category={entry.category} size={34} />
              <Text style={styles.category}>{entry.category}</Text>
            </View>
            <View style={styles.cardMeta}>
              <Text style={styles.timestamp}>{formatDateTime(entry.timestamp)}</Text>
              {entry.symptomFlag ? <SymptomBadge /> : null}
            </View>
          </View>
          <Text style={styles.text}>{entry.text}</Text>
        </Pressable>
      </Animated.View>
    </View>
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
    fontSize: 32,
    fontWeight: "800",
    color: "#1e1713",
  },
  subtitle: {
    color: "#8d7767",
  },
  emptyState: {
    backgroundColor: "#fffaf5",
    borderRadius: 20,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "#ead8c9",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3d2d23",
  },
  emptyText: {
    color: "#786555",
  },
  card: {
    backgroundColor: "#fffdf9",
    borderRadius: 18,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "#ead8c9",
  },
  swipeContainer: {
    position: "relative",
  },
  copyUnderlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#2f7ecb",
    borderRadius: 18,
    paddingLeft: 22,
  },
  copyIcon: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  category: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2a2019",
    flexShrink: 1,
  },
  cardMeta: {
    alignItems: "flex-end",
    gap: 6,
  },
  timestamp: {
    color: "#b55a2f",
    fontWeight: "600",
  },
  text: {
    color: "#6d5849",
    lineHeight: 22,
  },
});
