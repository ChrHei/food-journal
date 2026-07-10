import type { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 540;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.shell, isWideLayout && styles.shellWide]}>
        <ScrollView
          style={styles.surface}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4b2817",
  },
  shell: {
    flex: 1,
  },
  shellWide: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  surface: {
    flex: 1,
    backgroundColor: "#f7f1ea",
    borderRadius: 28,
    marginHorizontal: 14,
    marginVertical: 12,
    shadowColor: "#1f1008",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 12,
    maxWidth: 430,
    width: "100%",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 18,
  },
});
