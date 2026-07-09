import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigation } from "./src/app/navigation/AppNavigation";
import { JournalProvider } from "./src/features/journal/context/JournalProvider";

export default function App() {
  return (
    <SafeAreaProvider>
      <JournalProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigation />
      </JournalProvider>
    </SafeAreaProvider>
  );
}
