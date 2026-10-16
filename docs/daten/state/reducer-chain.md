# reducer-chain

## reducer-chain

Spiegel-Datei für `src/state/reducer-chain.js`.

## Verantwortung

Die Reihenfolge der Fach-Reducer als zwei Ketten, weil acht Imports das Cap sprengen.
Zusammengefuegt wird in `game-reducer.js`, dort steht die Reihenfolge.
Der fuenfte Zweig ist `reduceRaid`: der offene Raid als `{ ticket, instance }` im
Spielstand (D53), kein zweiter Zustand und kein zweiter Reducer-Baum.

## Schnittstellen

- keine benannten Funktionen

Aus der Migration vom 2026-10-05 hervorgegangen.
