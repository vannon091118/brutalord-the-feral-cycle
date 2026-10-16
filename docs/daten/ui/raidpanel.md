# raidpanel

## raidpanel

Spiegel-Datei für `src/ui/RaidPanel.jsx`.

## Verantwortung

Der spielbare Raid (P0-04): Start gegen den Feral-Hive über `cadreRule()` und
`ticketFrom()`, live nur legale Knöpfe aus `raidOptions()`, am Ende die
Abrechnung aus `lastRaid`. Die Anzeige rät nichts — jeder Knopf fragt die Regel.
Seit P0-05 holt der Start das Ticket per `startRaidAgainst()` beim Server und
reicht das Log beim Sichern per `submitRaid()` ein — die Quittung steht danach
in der Ergebniszeile.

## Schnittstellen

- `RaidPanel({ game, actions, playerseed })` — Start, Kampf und Ergebnis in einem Panel.
