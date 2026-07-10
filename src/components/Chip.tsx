import { Pressable, StyleSheet, Text } from "react-native";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
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
  label: {
    color: "#6d4e3b",
    fontWeight: "600",
  },
  selectedLabel: {
    color: "#ffffff",
  },
});
