import {
  CommonActions,
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MenuButton } from "@/components/MenuButton";
import { EntryDetailScreen } from "@/features/journal/screens/EntryDetailScreen";
import { EntryFormScreen } from "@/features/journal/screens/EntryFormScreen";
import { FilterScreen } from "@/features/journal/screens/FilterScreen";
import { HomeScreen } from "@/features/journal/screens/HomeScreen";
import { JournalListScreen } from "@/features/journal/screens/JournalListScreen";

import { createNewEntryFormNavigationTarget } from "./entryFormNavigation";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

const menuItems: Array<{
  label: string;
  screen: keyof RootStackParamList;
}> = [
  { label: "Start", screen: "Home" },
  { label: "Ny post", screen: "EntryForm" },
  { label: "Historik", screen: "JournalList" },
];

type AppMenuContextValue = {
  activeRoute: keyof RootStackParamList | undefined;
  handleNavigationReady: () => void;
  handleNavigationStateChange: () => void;
  openMenu: () => void;
};

const AppMenuContext = createContext<AppMenuContextValue | null>(null);

export function AppNavigation() {
  return (
    <AppMenuProvider>
      <NavigationShell />
    </AppMenuProvider>
  );
}

function NavigationShell() {
  const { handleNavigationReady, handleNavigationStateChange } = useAppMenu();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationStateChange}
    >
      <JournalStackNavigator />
    </NavigationContainer>
  );
}

function JournalStackNavigator() {
  const { openMenu } = useAppMenu();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#4b2817" },
        headerTintColor: "#f7f1ea",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#4b2817" },
        headerRight: () => <MenuButton onPress={openMenu} variant="light" />,
      }}
    >
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => <HomeScreen {...props} onOpenMenu={openMenu} />}
      </Stack.Screen>
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

function AppMenuProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [activeRoute, setActiveRoute] = useState<keyof RootStackParamList | undefined>(undefined);

  const syncActiveRoute = useCallback(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const routeName = navigationRef.getCurrentRoute()?.name;

    if (routeName) {
      setActiveRoute(routeName as keyof RootStackParamList);
    }
  }, []);

  const handleNavigationReady = useCallback(() => {
    syncActiveRoute();
  }, [syncActiveRoute]);

  const handleNavigationStateChange = useCallback(() => {
    syncActiveRoute();
  }, [syncActiveRoute]);

  const openMenu = useCallback(() => {
    setVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setVisible(false);
  }, []);

  const navigateTo = useCallback(
    (screen: keyof RootStackParamList) => {
      closeMenu();

      if (!navigationRef.isReady()) {
        return;
      }

      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes:
            screen === "EntryForm"
              ? [createNewEntryFormNavigationTarget()]
              : [{ name: screen }],
        }),
      );
    },
    [closeMenu],
  );

  const contextValue = useMemo(
    () => ({
      activeRoute,
      handleNavigationReady,
      handleNavigationStateChange,
      openMenu,
    }),
    [activeRoute, handleNavigationReady, handleNavigationStateChange, openMenu],
  );

  return (
    <AppMenuContext.Provider value={contextValue}>
      {children}
      <MenuOverlay
        activeRoute={activeRoute}
        visible={visible}
        onClose={closeMenu}
        onNavigate={navigateTo}
      />
    </AppMenuContext.Provider>
  );
}

function MenuOverlay({
  activeRoute,
  visible,
  onClose,
  onNavigate,
}: {
  activeRoute: keyof RootStackParamList | undefined;
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
}) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.overlayRoot}>
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={styles.panel}>
          <Text style={styles.panelEyebrow}>Matjournal</Text>
          <Text style={styles.panelTitle}>Meny</Text>

          {menuItems.map((item) => (
            <Pressable
              key={item.screen}
              onPress={() => onNavigate(item.screen)}
              style={[styles.menuItem, activeRoute === item.screen && styles.menuItemActive]}
            >
              <Text
                style={[
                  styles.menuItemLabel,
                  activeRoute === item.screen && styles.menuItemLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function useAppMenu() {
  const context = useContext(AppMenuContext);

  if (!context) {
    throw new Error("useAppMenu must be used within AppMenuProvider.");
  }

  return context;
}

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(30, 23, 19, 0.22)",
  },
  scrim: {
    flex: 1,
  },
  panel: {
    width: 280,
    backgroundColor: "#fff7f0",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 12,
  },
  panelEyebrow: {
    color: "#8b6c58",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontSize: 12,
    fontWeight: "700",
  },
  panelTitle: {
    color: "#2d2018",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  menuItem: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  menuItemActive: {
    backgroundColor: "#f2dfce",
  },
  menuItemLabel: {
    color: "#5b4334",
    fontSize: 16,
    fontWeight: "700",
  },
  menuItemLabelActive: {
    color: "#7a3d13",
  },
});
