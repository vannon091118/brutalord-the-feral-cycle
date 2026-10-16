# lanes

## lanes

Spiegel-Datei für `src/domain/labour/lanes.js`.

## Verantwortung

Zwei Spuren je Kachel aus der Richtung: Gegenverkehr landet auf
verschiedenen Spuren und passiert, gleiches Ziel auf gleicher Spur wartet.
`findPath()` läuft erst in X, dann in Y — deterministisch, ganzzahlig, ohne
Weltwissen. Jede Kachel gilt heute als begehbar; Sperren für Bewegung kommen
mit echter Wegblockade, nicht hier.
