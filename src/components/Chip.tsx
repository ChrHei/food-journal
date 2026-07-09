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
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbb49b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fffaf3",
  },
  selected: {
    backgroundColor: "#7a3d13",
    borderColor: "#7a3d13",
  },
  label: {
    color: "#5c4433",
    fontWeight: "600",
  },
  selectedLabel: {
    color: "#ffffff",
  },
});
