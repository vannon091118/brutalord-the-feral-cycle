# client-storage

## client-storage

Spiegel-Datei für `src/state/client-storage.js`.

## Verantwortung

Der einzige Griff des Clients in den `localStorage`: Rohtext lesen und
schreiben, JSON lesen und schreiben, Schlüssel entfernen. Ohne Fenster oder
bei vollem Speicher kommt `null` oder `false` zurück statt einer Ausnahme —
Aufrufer prüfen Rückgaben, kein Aufrufer fängt selbst. Snapshot und Sitzung
teilen sich diesen Weg statt je eigener Zugriffe.
