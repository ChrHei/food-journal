import { Pressable, StyleSheet, Text } from "react-native";

type MenuButtonProps = {
  onPress: () => void;
  variant?: "light" | "dark";
};

export function MenuButton({ onPress, variant = "dark" }: MenuButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Öppna meny"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "light" ? styles.light : styles.dark,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.icon, variant === "light" ? styles.lightLabel : styles.darkLabel]}>☰</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  dark: {
    backgroundColor: "#efe3d5",
  },
  light: {
    backgroundColor: "rgba(255, 244, 232, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 244, 232, 0.28)",
  },
  pressed: {
    opacity: 0.82,
  },
  icon: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 20,
  },
  darkLabel: {
    color: "#7f5639",
  },
  lightLabel: {
    color: "#fff7f0",
  },
});
