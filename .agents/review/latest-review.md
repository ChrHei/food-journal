# Senaste kodgranskning

Datum: 2026-07-09

## Fynd

### 1. Filterdatum tolkas som UTC i stället för användarens lokala dag
Fil: `src/features/journal/screens/FilterScreen.tsx`

`from` och `to` byggs genom att lägga till `Z` på ett datum utan tidzon. Eftersom poster sparas som lokal tid som konverteras till UTC kan poster nära midnatt hamna utanför vald dag. Exempel: en post sparad `2026-07-09 00:30` lokal tid kan lagras som `2026-07-08T22:30:00Z` och filtreras bort när användaren väljer från `2026-07-09`.

Åtgärd:
- bygg daggränserna via samma lokala datumhjälpare som formuläret använder
- konvertera lokal start/slut på dagen till UTC innan query skickas

### 2. Första sparningen kan ske innan databasen är initierad
Fil: `src/features/journal/screens/EntryFormScreen.tsx`

Formuläret kan användas innan `initializeDatabase()` har blivit klar i providern. Då kan första `createEntry` eller `updateEntry` försöka skriva till `journal_entries` innan tabellen finns.

Åtgärd:
- blockera formuläret tills `ready` är `true`
- eller låt repository-lagret invänta databasinitiering innan tabellen används

### 3. Detaljvyn visar felmeddelande under laddning
Fil: `src/features/journal/screens/EntryDetailScreen.tsx`

`entry` startar som `null`, vilket gör att texten `Posten hittades inte.` visas innan asynkron hämtning har hunnit bli klar. Det ger ett felaktigt transient fel även när posten finns.

Åtgärd:
- inför separat `loading`-state
- visa `inte hittad` först när hämtningen är klar och resultatet fortfarande saknas

## Sammanfattning
De viktigaste problemen gäller korrekthet i datumfiltrering och robusthet vid kall appstart. De bör prioriteras före vidare funktionalitet.
