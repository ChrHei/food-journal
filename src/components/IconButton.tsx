import { Pressable, StyleSheet, Text } from "react-native";

type IconButtonProps = {
  accessibilityLabel: string;
  icon: string;
  onPress: () => void;
  tone?: "default" | "danger";
  size?: "default" | "compact";
  disabled?: boolean;
};

export function IconButton({
  accessibilityLabel,
  icon,
  onPress,
  tone = "default",
  size = "default",
  disabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === "compact" && styles.compact,
        styles[tone],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.icon,
          size === "compact" && styles.compactIcon,
          tone === "danger" && styles.dangerIcon,
        ]}
      >
        {icon}
      </Text>
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
  compact: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  danger: {
    backgroundColor: "#fff4f1",
    borderColor: "#efc3bc",
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.5,
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
  compactIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
});
