import { StyleSheet, View } from "react-native";

import { categoryOptions, type CategoryType } from "@/domain/categories";

import { CategoryIcon } from "./CategoryIcon";
import { Chip } from "./Chip";

export function CategoryChoices({
  value,
  onChange,
  disabled = false,
}: {
  value: CategoryType;
  onChange: (category: CategoryType) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.group}>
      {categoryOptions.map((category) => (
        <Chip
          icon={<CategoryIcon category={category} size={26} />}
          key={category}
          label={category}
          selected={value === category}
          onPress={() => onChange(category)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
