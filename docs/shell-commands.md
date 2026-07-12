# Shell-kommandon

Kort referens för npm/npx- och Expo/EAS-kommandon som används i projektet.

## npm och npx

| Kommando | Syntax | Syfte |
| --- | --- | --- |
| Installera beroenden | `npm install` | Installerar beroenden enligt `package.json` och uppdaterar vid behov låsfilen. |
| Kör test | `npm test` | Kör projektets Jest-tester. |
| Typkontroll | `npm run lint` | Kör TypeScript-kontrollen (`tsc --noEmit`). |
| Starta Expo | `npm run start` | Startar Expo-utvecklingsservern. |
| Starta Android | `npm run android` | Bygger/kör appen lokalt på Android. |
| Expo Doctor | `npx expo-doctor@latest` | Kontrollerar Expo-konfiguration och SDK-kompatibla beroenden. |
| Kontrollera Expo-paket | `npx expo install --check` | Kontrollerar om Expo-beroenden matchar den installerade SDK-versionen. |
| Rätta Expo-paket | `npx expo install --fix` | Justerar Expo-beroenden till rekommenderade SDK-versioner. Kör tester och typkontroll efteråt. |

## EAS Build

| Kommando | Syntax | Syfte |
| --- | --- | --- |
| Android preview-build | `npx eas-cli@latest build --platform android --profile preview` | Skickar en Android-build med `preview`-profilen från `eas.json` till EAS. |
| Visa builds | `eas build:list` | Visar tidigare EAS-byggen för det inloggade kontot. |
| Inspektera förberedd build | `eas build:inspect -p android -s pre-build -o <mapp>` | Skapar lokalt underlag för felsökning före Gradle-steget. |

`npm` installerar paket eller kör scripts i projektet. `npx` kör ett pakets CLI, normalt från projektets lokala beroenden och annars från en tillfällig hämtning.

## Expo-projekt

Byggar och loggar finns i [Expo-projektet Matjournal](https://expo.dev/accounts/chrillekrim/projects/matjournal).
