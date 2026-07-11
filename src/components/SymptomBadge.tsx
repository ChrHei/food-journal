import { StyleSheet, Text, View } from "react-native";

import { CategoryIcon } from "@/components/CategoryIcon";

type SymptomBadgeProps = {
  align?: "left" | "right";
};

export function SymptomBadge({ align = "right" }: SymptomBadgeProps) {
  return (
    <View
      accessibilityLabel="Symptom"
      style={[styles.badge, align === "left" && styles.alignLeft]}
    >
      <CategoryIcon category="Symptom" size={22} />
      <Text style={styles.label}>Symptom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e8c7bd",
    backgroundColor: "#fff3ee",
    paddingLeft: 3,
    paddingRight: 9,
    paddingVertical: 3,
  },
  alignLeft: {
    alignSelf: "flex-start",
  },
  label: {
    color: "#9a3932",
    fontSize: 12,
    fontWeight: "700",
  },
});
