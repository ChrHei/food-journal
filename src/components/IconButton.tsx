import { Pressable, StyleSheet, Text } from "react-native";

type IconButtonProps = {
  accessibilityLabel: string;
  icon: string;
  onPress: () => void;
  tone?: "default" | "danger";
};

export function IconButton({ accessibilityLabel, icon, onPress, tone = "default" }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[tone], pressed && styles.pressed]}
    >
      <Text style={[styles.icon, tone === "danger" && styles.dangerIcon]}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  default: {
    backgroundColor: "#fffaf5",
    borderColor: "#ead8c9",
  },
  danger: {
    backgroundColor: "#fff4f1",
    borderColor: "#efc3bc",
  },
  pressed: {
    opacity: 0.82,
  },
  icon: {
    color: "#6c4d3a",
    fontSize: 21,
    fontWeight: "700",
    lineHeight: 24,
  },
  dangerIcon: {
    color: "#a74638",
  },
});
