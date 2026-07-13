import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { StyleSheet, Switch, Text, View } from "react-native";

import type { RootStackParamList } from "@/app/navigation/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Chip } from "@/components/Chip";
import { Field } from "@/components/Field";
import { IconButton } from "@/components/IconButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { categoryOptions } from "@/domain/categories";
import type { CategoryType } from "@/domain/categories";
import {
  fromLocalDateValue,
  localDateToUtcBoundary,
  toLocalDateValue,
} from "@/features/journal/utils/date";

type Props = NativeStackScreenProps<RootStackParamList, "Filter">;

export function FilterScreen({ navigation, route }: Props) {
  const [filter, setFilter] = React.useState({
    from: route.params?.filter?.from?.slice(0, 10) ?? "",
    to: route.params?.filter?.to?.slice(0, 10) ?? "",
    category: route.params?.filter?.category as CategoryType | undefined,
    symptomsOnly: route.params?.filter?.symptomsOnly ?? false,
  });
  const [activeDatePicker, setActiveDatePicker] = React.useState<"from" | "to" | null>(null);

  function handleDateChange(event: DateTimePickerEvent, selectedDate?: Date) {
    const field = activeDatePicker;
    setActiveDatePicker(null);

    if (event.type !== "set" || !selectedDate || !field) {
      return;
    }

    setFilter((current) => ({ ...current, [field]: toLocalDateValue(selectedDate) }));
  }

  const activeDateValue = activeDatePicker ? fromLocalDateValue(filter[activeDatePicker]) ?? new Date() : null;

  return (
    <Screen>
      <Field label="Från datum" hint="Valfritt">
        <View style={styles.dateRow}>
          <Text style={styles.dateValue}>{filter.from || "Inte valt"}</Text>
          <View style={styles.dateActions}>
            <IconButton
              accessibilityLabel="Välj från-datum"
              icon="📅"
              onPress={() => setActiveDatePicker("from")}
            />
            {filter.from ? (
              <IconButton
                accessibilityLabel="Rensa från-datum"
                icon="×"
                tone="danger"
                onPress={() => setFilter((current) => ({ ...current, from: "" }))}
              />
            ) : null}
          </View>
        </View>
      </Field>

      <Field label="Till datum" hint="Valfritt">
        <View style={styles.dateRow}>
          <Text style={styles.dateValue}>{filter.to || "Inte valt"}</Text>
          <View style={styles.dateActions}>
            <IconButton
              accessibilityLabel="Välj till-datum"
              icon="📅"
              onPress={() => setActiveDatePicker("to")}
            />
            {filter.to ? (
              <IconButton
                accessibilityLabel="Rensa till-datum"
                icon="×"
                tone="danger"
                onPress={() => setFilter((current) => ({ ...current, to: "" }))}
              />
            ) : null}
          </View>
        </View>
      </Field>

      {activeDatePicker && activeDateValue ? (
        <DateTimePicker
          value={activeDateValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      ) : null}

      <Field label="Kategori">
        <View style={styles.categoryGroup}>
          <Chip
            label="Alla"
            selected={!filter.category}
            onPress={() => setFilter((current) => ({ ...current, category: undefined }))}
          />
          {categoryOptions.map((category) => (
            <Chip
              icon={<CategoryIcon category={category} size={30} />}
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
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateValue: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddc8b2",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#261a13",
  },
  dateActions: {
    flexDirection: "row",
    gap: 8,
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
