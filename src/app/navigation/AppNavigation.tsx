import {
  CommonActions,
  NavigationContainer,
  type NavigatorScreenParams,
} from "@react-navigation/native";
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
  type DrawerContentComponentProps,
  type DrawerNavigationProp,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { MenuButton } from "@/components/MenuButton";
import { EntryDetailScreen } from "@/features/journal/screens/EntryDetailScreen";
import { EntryFormScreen } from "@/features/journal/screens/EntryFormScreen";
import { FilterScreen } from "@/features/journal/screens/FilterScreen";
import { HomeScreen } from "@/features/journal/screens/HomeScreen";
import { JournalListScreen } from "@/features/journal/screens/JournalListScreen";

import type { RootDrawerParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const drawerItems: Array<{
  label: string;
  screen: keyof RootStackParamList;
}> = [
  { label: "Start", screen: "Home" },
  { label: "Ny post", screen: "EntryForm" },
  { label: "Historik", screen: "JournalList" },
];

export function AppNavigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: "left",
          drawerType: "front",
          overlayColor: "rgba(30, 23, 19, 0.22)",
          drawerStyle: styles.drawer,
        }}
        drawerContent={(props) => <AppDrawerContent {...props} />}
      >
        <Drawer.Screen name="JournalRoot" component={JournalStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function JournalStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#4b2817" },
        headerTintColor: "#f7f1ea",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#4b2817" },
        headerRight: () => (
          <MenuButton
            onPress={() =>
              (navigation.getParent() as DrawerNavigationProp<RootDrawerParamList> | undefined)?.openDrawer()
            }
            variant="light"
          />
        ),
      })}
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
  );
}

function AppDrawerContent(props: DrawerContentComponentProps) {
  const activeRouteName = getActiveRouteName(props.state);

  function resetToScreen(screen: keyof RootStackParamList) {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "JournalRoot",
            params: { screen } as NavigatorScreenParams<RootStackParamList>,
          },
        ],
      }),
    );
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerEyebrow}>Matjournal</Text>
        <Text style={styles.drawerTitle}>Meny</Text>
      </View>

      {drawerItems.map((item) => (
        <DrawerItem
          key={item.screen}
          label={item.label}
          focused={activeRouteName === item.screen}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
          activeBackgroundColor="#f2dfce"
          inactiveBackgroundColor="transparent"
          activeTintColor="#7a3d13"
          inactiveTintColor="#5b4334"
          onPress={() => resetToScreen(item.screen)}
        />
      ))}
    </DrawerContentScrollView>
  );
}

function getActiveRouteName(state: DrawerContentComponentProps["state"]) {
  const drawerRoute = state.routes[state.index];
  const nestedState = drawerRoute.state;

  if (!nestedState || !("routes" in nestedState) || nestedState.routes.length === 0) {
    return "Home";
  }

  const nestedRoute = nestedState.routes[nestedState.index ?? nestedState.routes.length - 1];

  return nestedRoute.name as keyof RootStackParamList;
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "#fff7f0",
    width: 280,
  },
  drawerContent: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  drawerHeader: {
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 4,
  },
  drawerEyebrow: {
    color: "#8b6c58",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontSize: 12,
    fontWeight: "700",
  },
  drawerTitle: {
    color: "#2d2018",
    fontSize: 28,
    fontWeight: "800",
  },
  drawerItem: {
    borderRadius: 18,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
