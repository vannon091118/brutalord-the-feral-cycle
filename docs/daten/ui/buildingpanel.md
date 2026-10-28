# BuildingPanel

## buildingpanel

Spiegel-Datei für `src/ui/BuildingPanel.jsx`.

## Verantwortung

Ein ausgewähltes Bauwerk: was es ist, wie weit es ist und — beim Extraktor — wer daran
arbeitet. Zuweisen und Freigeben sind die einzigen Befehle hier. Nur der Extraktor
beschäftigt Dunglinge — nur dort gibt es die Bedienung.

Für Hilfstechnik heißt der Plus-Knopf `Dungling zuweisen`: `aria-label` und `title`
tragen denselben Namen, der sichtbare Text bleibt `+ Dungling`. Wer mit dem Screenreader
durch das Panel tabbt, hört den Zweck des Knopfes statt eines Pluszeichens, und die
Baumenü-Fahrt im Browser greift denselben Namen als Selektor.

## Schnittstellen

- `stateText()`
- `PanelHeader()`
- `WorkerControls()`
- `WorkerSection()`
- `LabEntry()`
- `LabView()`
- `BuildingPanel()`

Aus der Migration vom 2026-10-05 hervorgegangen.

## Lager-Stand

Wege, Spuren, Lagerwahl und Raumbewertung wandern mit.
