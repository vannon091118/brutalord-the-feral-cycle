# raid-submit

## raid-submit

Spiegel-Datei für `src/ui/raid-submit.js`.

## Verantwortung

Der Aufrufer für `POST /api/raid/ticket` und `POST /api/raid` (P0-05): das Ticket
holt der Client beim Server, das Log reicht er nach dem Replay-Check ein — die
Quittung schreibt der Server. Ohne Server läuft der Feral-Raid lokal, ohne
Quittung, aber nie still.

## Schnittstellen

- `issueRaidTicket(token, { defender, heroes })` — Ticket oder Absage.
- `submitRaid(token, { ticket, actions, claimed })` — Quittung oder Absage.
- `startRaidAgainst(token, { playerseed, dunglings, defender })` — Server-Ticket oder lokaler Feral.
