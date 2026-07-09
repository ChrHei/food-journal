import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import type { RootStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Android v1</Text>
        <Text style={styles.title}>Spåra mat, dryck, medicin och symptom utan internet.</Text>
        <Text style={styles.body}>
          Fokus i första versionen är snabb registrering och enkel historik för att kunna koppla
          intag till allergiska reaktioner.
        </Text>
      </View>

      <PrimaryButton label="Ny post" onPress={() => navigation.navigate("EntryForm")} />
      <PrimaryButton
        label="Visa historik"
        variant="secondary"
        onPress={() => navigation.navigate("JournalList")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#f0e2d3",
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#7a3d13",
    fontWeight: "800",
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#261a13",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4e3c30",
  },
});
