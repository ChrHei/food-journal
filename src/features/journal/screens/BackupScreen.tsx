import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { createJournalBackup, parseJournalBackup } from "@/domain/backup";
import { useJournalContext } from "@/features/journal/context/JournalProvider";

export function BackupScreen() {
  const { ready, repository, refresh } = useJournalContext();
  const [busy, setBusy] = useState(false);

  const exportBackup = async () => {
    setBusy(true);
    try {
      const entries = await repository.listEntries();
      const backup = createJournalBackup(entries);
      const filename = `matjournal-backup-v${backup.version}-${backup.exportedAt.replace(/[:.]/g, "-")}.json`;
      const uri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Det går inte att öppna systemets spara-dialog på den här enheten.");
      }

      await Sharing.shareAsync(uri, { mimeType: "application/json", dialogTitle: "Spara backup" });
    } catch (error) {
      Alert.alert("Exporten misslyckades", errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const importBackup = async () => {
    setBusy(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const contents = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
      const backup = parseJournalBackup(contents);
      const summary = await repository.importEntries(backup.entries);
      refresh();
      Alert.alert("Import klar", `Importerade: ${summary.imported}\nÖverhoppade: ${summary.skipped}`);
    } catch (error) {
      Alert.alert("Importen genomfördes inte", errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.intro}>
        <Text style={styles.title}>Säkerhetskopia</Text>
        <Text style={styles.text}>
          Exporten innehåller enbart dina journalposter. Import lägger bara till poster med nya id:n och skriver aldrig över befintliga data.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Exportera</Text>
        <Text style={styles.text}>Skapa en versionsmärkt JSON-fil och välj sedan var du vill spara eller dela den.</Text>
        <PrimaryButton label="Exportera journaldata" onPress={exportBackup} disabled={!ready || busy} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Importera</Text>
        <Text style={styles.text}>Välj en tidigare exporterad JSON-fil. Hela filen kontrolleras innan något sparas.</Text>
        <PrimaryButton label="Importera journaldata" variant="secondary" onPress={importBackup} disabled={!ready || busy} />
      </View>

      {busy ? <ActivityIndicator accessibilityLabel="Bearbetar säkerhetskopia" color="#c85f2c" /> : null}
    </Screen>
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ett okänt fel uppstod.";
}

const styles = StyleSheet.create({
  intro: { gap: 10 },
  title: { color: "#2d2018", fontSize: 30, fontWeight: "800" },
  text: { color: "#6d5849", fontSize: 16, lineHeight: 23 },
  card: { backgroundColor: "#fffaf5", borderColor: "#ead8c9", borderRadius: 20, borderWidth: 1, gap: 14, padding: 18 },
  cardTitle: { color: "#3d2d23", fontSize: 19, fontWeight: "700" },
});
