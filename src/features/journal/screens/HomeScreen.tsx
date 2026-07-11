import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { CategoryIcon } from "@/components/CategoryIcon";
import { MenuButton } from "@/components/MenuButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SymptomBadge } from "@/components/SymptomBadge";
import type { RootStackParamList } from "@/app/navigation/types";
import { categoryOptions } from "@/domain/categories";
import { useJournalEntries } from "@/features/journal/hooks/useJournalEntries";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type HomeScreenOwnProps = {
  onOpenMenu: () => void;
};

export function HomeScreen({ navigation, onOpenMenu }: Props & HomeScreenOwnProps) {
  const { entries, loading } = useJournalEntries();
  const todayEntries = entries.filter((entry) => isSameLocalDay(entry.timestamp, new Date()));
  const categoryCounts = categoryOptions
    .map((category) => ({
      category,
      count: todayEntries.filter((entry) => entry.category === category).length,
    }))
    .filter((item) => item.count > 0);
  const symptomCount = todayEntries.filter((entry) => entry.symptomFlag).length;
  const recentEntries = entries.slice(0, 3);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formatCurrentDate(new Date())}</Text>
          <Text style={styles.title}>Min dagbok</Text>
        </View>
        <MenuButton onPress={onOpenMenu} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Idag</Text>
        {loading ? (
          <ActivityIndicator color="#fff3e6" />
        ) : (
          <>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryCount}>{todayEntries.length}</Text>
              <Text style={styles.summaryText}>registrerade inlägg</Text>
            </View>
            <View style={styles.summaryBadges}>
              <Badge label={`${todayEntries.length - symptomCount} utan symptom`} />
              <Badge label={`${symptomCount} med symptom`} accent />
            </View>
          </>
        )}
        <View style={styles.summaryOrb} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Kategorier idag</Text>
      </View>

      <View style={styles.categoryGrid}>
        {loading ? (
          <ActivityIndicator color="#c85f2c" />
        ) : categoryCounts.length > 0 ? (
          categoryCounts.map(({ category, count }) => (
            <Pressable
              key={category}
              onPress={() => navigation.navigate("JournalList", { filter: { category } })}
              style={styles.categoryCard}
            >
              <CategoryIcon category={category} size={30} />
              <Text numberOfLines={1} style={styles.categoryName}>
                {category}
              </Text>
              <View style={styles.categoryCountBadge}>
                <Text style={styles.categoryCountText}>{count}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>Inga inlägg idag</Text>
            <Text style={styles.emptyText}>Skapa dagens första post för att fylla översikten.</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Senaste inlägg</Text>
        <Pressable onPress={() => navigation.navigate("JournalList")}>
          <Text style={styles.sectionAction}>Visa alla</Text>
        </Pressable>
      </View>

      {loading ? <ActivityIndicator color="#c85f2c" /> : null}

      {!loading && recentEntries.length > 0
        ? recentEntries.map((entry) => (
            <Pressable
              key={entry.id}
              style={styles.entryCard}
              onPress={() => navigation.navigate("EntryDetail", { entryId: entry.id })}
            >
              <CategoryIcon category={entry.category} size={48} />
              <View style={styles.entryBody}>
                <View style={styles.entryTopRow}>
                  <Text style={styles.entryTitle}>{entry.category}</Text>
                  <View style={styles.entryMetaColumn}>
                    <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                    {entry.symptomFlag ? <SymptomBadge /> : null}
                  </View>
                </View>
                <Text numberOfLines={2} style={styles.entryText}>
                  {entry.text}
                </Text>
              </View>
            </Pressable>
          ))
        : null}

      <PrimaryButton label="+ Nytt inlägg" onPress={() => navigation.navigate("EntryForm")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  date: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#88715f",
    fontWeight: "600",
    fontSize: 12,
  },
  title: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "800",
    color: "#1e1713",
  },
  summaryCard: {
    overflow: "hidden",
    backgroundColor: "#c85f2c",
    borderRadius: 26,
    padding: 20,
    gap: 16,
    minHeight: 150,
  },
  summaryLabel: {
    color: "#ffe7d4",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "700",
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  summaryCount: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 52,
    lineHeight: 52,
  },
  summaryText: {
    color: "#fff3e6",
    fontSize: 20,
    lineHeight: 24,
    flexShrink: 1,
    paddingBottom: 6,
  },
  summaryBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryOrb: {
    position: "absolute",
    top: -16,
    right: -12,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255, 234, 216, 0.12)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionLabel: {
    color: "#8f715b",
    textTransform: "uppercase",
    letterSpacing: 1.15,
    fontWeight: "700",
    fontSize: 12,
  },
  sectionAction: {
    color: "#b55a2f",
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fffaf5",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8c9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#28150a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  categoryName: {
    color: "#6b4b38",
    fontWeight: "600",
  },
  categoryCountBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8ecdf",
  },
  categoryCountText: {
    color: "#b55a2f",
    fontWeight: "700",
    fontSize: 12,
  },
  emptyBlock: {
    backgroundColor: "#fffaf5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ead8c9",
    padding: 18,
    gap: 8,
    width: "100%",
  },
  emptyTitle: {
    color: "#3d2d23",
    fontWeight: "700",
    fontSize: 17,
  },
  emptyText: {
    color: "#786555",
    lineHeight: 21,
  },
  entryCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#fffdf9",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8c9",
    padding: 16,
    shadowColor: "#28150a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  entryBody: {
    flex: 1,
    gap: 6,
  },
  entryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  entryTitle: {
    color: "#2a2019",
    fontSize: 19,
    fontWeight: "700",
  },
  entryTime: {
    color: "#8e7869",
    fontSize: 13,
  },
  entryMetaColumn: {
    alignItems: "flex-end",
    gap: 6,
  },
  entryText: {
    color: "#6d5849",
    lineHeight: 21,
  },
});

function Badge({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <View style={[badgeStyles.base, accent && badgeStyles.accent]}>
      <Text style={badgeStyles.text}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  base: {
    backgroundColor: "rgba(255, 239, 228, 0.22)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  accent: {
    backgroundColor: "rgba(228, 102, 68, 0.3)",
  },
  text: {
    color: "#fff7f0",
    fontWeight: "700",
  },
});

function formatCurrentDate(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(/^\p{L}/u, (letter) => letter.toUpperCase());
}

function formatTime(isoString: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

function isSameLocalDay(isoString: string, date: Date) {
  const value = new Date(isoString);

  return (
    value.getFullYear() === date.getFullYear() &&
    value.getMonth() === date.getMonth() &&
    value.getDate() === date.getDate()
  );
}
