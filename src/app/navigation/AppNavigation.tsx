import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EntryDetailScreen } from "@/features/journal/screens/EntryDetailScreen";
import { EntryFormScreen } from "@/features/journal/screens/EntryFormScreen";
import { FilterScreen } from "@/features/journal/screens/FilterScreen";
import { HomeScreen } from "@/features/journal/screens/HomeScreen";
import { JournalListScreen } from "@/features/journal/screens/JournalListScreen";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#4b2817" },
          headerTintColor: "#f7f1ea",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#4b2817" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="JournalList"
          component={JournalListScreen}
          options={{ title: "Historik" }}
        />
        <Stack.Screen
          name="EntryForm"
          component={EntryFormScreen}
          options={{ title: "Registrera post" }}
        />
        <Stack.Screen
          name="EntryDetail"
          component={EntryDetailScreen}
          options={{ title: "Detaljer" }}
        />
        <Stack.Screen name="Filter" component={FilterScreen} options={{ title: "Filter" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
