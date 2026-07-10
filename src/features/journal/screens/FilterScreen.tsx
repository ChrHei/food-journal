import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { Chip } from "@/components/Chip";
import { Field } from "@/components/Field";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { categoryOptions } from "@/domain/categories";
import type { CategoryType } from "@/domain/categories";
import { localDateToUtcBoundary } from "@/features/journal/utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "Filter">;

export function FilterScreen({ navigation, route }: Props) {
  const [filter, setFilter] = React.useState({
    from: route.params?.filter?.from?.slice(0, 10) ?? "",
    to: route.params?.filter?.to?.slice(0, 10) ?? "",
    category: route.params?.filter?.category as CategoryType | undefined,
    symptomsOnly: route.params?.filter?.symptomsOnly ?? false,
  });

  return (
    <Screen>
      <Field label="Från datum" hint="YYYY-MM-DD">
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={filter.from}
          onChangeText={(from) => setFilter((current) => ({ ...current, from }))}
        />
      </Field>

      <Field label="Till datum" hint="YYYY-MM-DD">
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={filter.to}
          onChangeText={(to) => setFilter((current) => ({ ...current, to }))}
        />
      </Field>

      <Field label="Kategori">
        <View style={styles.categoryGroup}>
          <Chip
            label="Alla"
            selected={!filter.category}
            onPress={() => setFilter((current) => ({ ...current, category: undefined }))}
          />
          {categoryOptions.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={filter.category === category}
              onPress={() => setFilter((current) => ({ ...current, category }))}
            />
          ))}
        </View>
      </Field>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Visa endast symptommarkerade poster</Text>
        <Switch
          value={filter.symptomsOnly}
          onValueChange={(symptomsOnly) => setFilter((current) => ({ ...current, symptomsOnly }))}
        />
      </View>

      <PrimaryButton
        label="Använd filter"
        onPress={() =>
          navigation.replace("JournalList", {
            filter: {
              from: filter.from ? localDateToUtcBoundary(filter.from, "start") : undefined,
              to: filter.to ? localDateToUtcBoundary(filter.to, "end") : undefined,
              category: filter.category,
              symptomsOnly: filter.symptomsOnly,
            },
          })
        }
      />
      <PrimaryButton
        label="Rensa filter"
        variant="secondary"
        onPress={() => navigation.replace("JournalList")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddc8b2",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#261a13",
  },
  categoryGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  switchRow: {
    backgroundColor: "#f7efe5",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  switchLabel: {
    flex: 1,
    color: "#3f3024",
    fontWeight: "600",
  },
});
