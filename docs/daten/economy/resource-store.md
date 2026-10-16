# resource-store

## resource-store

Spiegel-Datei für `src/domain/economy/resource-store.js`.

## Verantwortung

Generisches Lagerfach je Ressource: `storeCapacity()` nennt den Deckel,
`clampedStock()` hält jeden Stand darunter, `blockedOverflow()` nimmt nur an,
was noch passt — der Rest verfällt nicht still, er wird abgewiesen. Heute
trägt nur Essenz ein Fach (60); Biomasse, Aether und Blutstein bekommen hier
ihre Zeile, kein neues Feld im Spielstand.
