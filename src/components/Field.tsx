import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

type FieldProps = PropsWithChildren<{
  label: string;
  hint?: string;
}>;

export function Field({ label, hint, children }: FieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8f715b",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  hint: {
    fontSize: 12,
    color: "#8d7767",
  },
});
