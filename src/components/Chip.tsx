import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ChipProps = {
  icon?: ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ icon, label, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      {icon ? <View style={[styles.icon, selected && styles.selectedIcon]}>{icon}</View> : null}
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8c9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fffaf5",
    shadowColor: "#28150a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  selected: {
    backgroundColor: "#c85f2c",
    borderColor: "#c85f2c",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: {
    opacity: 0.96,
  },
  label: {
    color: "#6d4e3b",
    fontWeight: "600",
  },
  selectedLabel: {
    color: "#ffffff",
  },
});
