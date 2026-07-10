import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

type ScreenProps = PropsWithChildren<{
  footer?: ReactNode;
}>;

export function Screen({ children, footer }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.surface}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
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
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 24,
  },
  surface: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#f7f1ea",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#1f1008",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 12,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 18,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ead8c9",
    backgroundColor: "#f7f1ea",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
});
