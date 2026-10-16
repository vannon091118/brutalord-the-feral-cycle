# raid-options

## raid-options

Spiegel-Datei für `src/domain/raid/raid-options.js`.

## Verantwortung

Die ehrlichen Knöpfe des Raids: jeder Schritt und jede Tat ist genau dann
legal, wenn `applyAction()` den Zustand bewegen würde — die Anzeige rät nicht,
sie fragt die Regel. Grabkosten kommen aus `cellCost()`.

## Schnittstellen

- `raidOptions(state, world)` — Schritte je Richtung (Zug und Hack mit Kosten) plus Taten.
