# raid-reducer

## raid-reducer

Spiegel-Datei für `src/state/reducers/raid-reducer.js`.

## Verantwortung

Der laufende Raid als Zweig der einen Kette (D53): `state.raid` trägt Ticket
plus Instanz, die Welt baut der Reducer je Aktion aus dem Ticket-Seed nach.

## Schnittstellen

- `reduceRaid(state, action)` — STARTED öffnet, ACTION spielt, ENDED rechnet ab
  und schließt mit `lastRaid` für die Anzeige.
