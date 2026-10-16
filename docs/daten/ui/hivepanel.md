# hivepanel

## hivepanel

Spiegel-Datei für `src/ui/HivePanel.jsx`.

## Verantwortung

Bestellschalter des Hive: zeigt Bestand mit Deckel, belegten und freien
Wohnraum und je Dungling Zustand, Auftrag und Stimmung. Die Stimmung stammt
aus `dunglingMood()`, also aus echtem Auftrag und echter Liste — kein
Bedürfnis wird erfunden. Bestellt wird über `DUNGLING_ORDERED`, der Reducer
prüft Kosten und Wohnraum, das Panel zeigt nur den Grund als Hinweis.
