# Mebongs Champions-League · The Virtual Race

Handy-Partyspiel für 7 Spieler, 5 Runden, max. 50 Minuten. Jeder spielt auf seinem eigenen Handy, ein Spieler ist Spielleiter (spielt aber mit). Am Ende gibt es eine Schlusstabelle von Platz 1 bis 7, einen Champion (Henkelpott + Cocktail) und eine Rote Laterne (Final-Shot + zahlt die nächste Runde).

| Runde | Stufe | Spiel |
| --- | --- | --- |
| 1 | Gruppenphase | 🧮 Schätzmeister |
| 2 | Achtelfinal | ⏱️ Stopp bei 10.00 |
| 3 | Viertelfinal | 🚨 Buzzer-Chaos |
| 4 | Halbfinal | 🎭 Pantomime-Sprint |
| 5 | Final (doppelte Punkte) | 💣 Die Bombe |

Punkte pro Runde: 10 · 8 · 6 · 4 · 3 · 2 · 1 (im Final doppelt).
Rundensieger: Espresso Martini oder Basil Smash und darf einen Shot verteilen. Rundenletzter: 1 × Adios Motherfucker und dreht das Glücksrad. Jeder startet mit einem Joker.

---

## 1. Schnell testen (ohne Firebase)

Ohne Firebase läuft das Spiel im **Demo-Modus**: alles im selben Browser.

```bash
cd mebong-cl
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen → «Turnier eröffnen» → in der Lobby «🤖 Testspieler hinzufügen» (Bots spielen automatisch mit). Für einen zweiten «menschlichen» Spieler einfach einen zweiten Tab öffnen und mit dem Raum-Code beitreten.

**Zeitraffer:** `http://localhost:8000/?speed=10` lässt alle Timer 10× schneller laufen – praktisch, um einmal alles durchzuklicken.

> Die Seite muss über einen Webserver laufen (nicht per Doppelklick auf `index.html`), weil sie JavaScript-Module nutzt.

## 2. Firebase einrichten (für das echte Spiel mit allen Handys)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Projekt hinzufügen** (z.B. `mebong-cl`).
2. Links **Build → Realtime Database → Datenbank erstellen**, Standort `europe-west1`, im **gesperrten Modus** starten.
3. Tab **Regeln**: Inhalt von `database.rules.json` einfügen → **Veröffentlichen**.
4. **Projekteinstellungen (Zahnrad) → Meine Apps → Web-App `</>`** registrieren (Hosting nicht nötig).
5. Die angezeigte `firebaseConfig` in `js/config.js` einfügen – wichtig ist `databaseURL`.

Sobald `databaseURL` gesetzt ist, verschwindet der Demo-Hinweis und alle Handys spielen über Firebase zusammen.

## 3. Auf GitHub Pages veröffentlichen

```bash
cd mebong-cl
git init
git add .
git commit -m "Mebongs Champions-League"
git branch -M main
git remote add origin https://github.com/<DEIN-USER>/mebong-cl.git
git push -u origin main
```

Auf GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**. Nach 1–2 Minuten läuft das Spiel unter `https://<DEIN-USER>.github.io/mebong-cl/`.

Optional in Firebase unter **Authentication → Einstellungen → Autorisierte Domains** `<DEIN-USER>.github.io` eintragen.

## 4. Am Spielabend

1. Spielleiter öffnet die Seite → **Turnier eröffnen** → Name + Avatar.
2. Die anderen scannen den QR-Code oder öffnen den geteilten Link und wählen Name + Avatar. Jeder bekommt automatisch eine feste Farbe.
3. Spielleiter sortiert die **Sitzordnung** (▲▼). Alle setzen sich im Uhrzeigersinn so hin – «links» heisst im Spiel immer: der Nächste in der Liste.
4. Wer alkoholfrei trinkt, schaltet den Schalter in der Lobby ein (Ingwer-Shot statt Adios Motherfucker). Shot-Limit ist einstellbar (Standard 5, danach Wasser).
5. **Anpfiff ▶**. Ab dann steuert der Spielleiter über die Leiste unten: Weiter, +1 Minute, Runde beenden, ☰ Menü (Punkte korrigieren, neu starten).

Tipps: Ton auf den Handys an (🔊 oben rechts), Bildschirm bleibt dank Wake Lock an. Fliegt jemand raus (Akku, Browser zu), einfach Link öffnen und mit **genau demselben Namen** wieder beitreten – Punkte bleiben erhalten. Lädt der Spielleiter die Seite neu, läuft das Spiel weiter.

## 5. Die Bombe – Beispiel mit 2 Durchgängen

Sitzordnung: Mebong → Röbi → Ueli → Patrik → Sepp → Fredi → Bernie (→ wieder Mebong).

**Durchgang 1** – Kategorie «Biermarken». Die Bombe startet zufällig bei Ueli. Sein Handy zeigt die Bombe und einen grossen Knopf «WEITER ➜ Patrik». Ueli ruft «Feldschlösschen!» und drückt WEITER. Jetzt hat Patrik die Bombe: «Heineken!» → weiter zu Sepp: «Quöllfrisch!» → Fredi: «Calanda!» → Bernie stottert … «Äh … Kronenbourg!» → Mebong: «Eichhof!» → Röbi … *💥 BOOM* (nach geheimen 15–45 Sekunden). Röbi fliegt raus, landet auf Platz 7 und trinkt sofort einen Adios Motherfucker.

**Durchgang 2** – neue Kategorie «Stellungen im Bett». Die Bombe startet beim Nächsten nach Röbi, also Ueli. Röbi ist raus und wird übersprungen. Es geht wieder reihum, bis es knallt – z.B. bei Fredi: Platz 6, Shot.

So geht es weiter, bis nur noch einer übrig ist – der holt Platz 1 im Final (mit doppelten Punkten). Doppelte Begriffe oder zu langes Zögern bestraft die Gruppe: Wer keinen gültigen Begriff hat, darf nicht weiterdrücken.

## 6. Inhalte anpassen

Alles in **`js/content.js`**:

- `SCHAETZ` – Schätzfragen (Frage, Lösung, Einheit, Hinweis). Pro Spiel werden 3 gezogen.
- `BUZZER` – Quizfragen mit 4 Antworten, `c` = Index der richtigen Antwort (0–3). Pro Spiel 10.
- `PANTO` – Pantomime-Kategorien mit Begriffen (in der Lobby an/abschaltbar).
- `BOMB` – Kategorien für die Bombe.
- `WHEEL` – Texte des Glücksrads (Reihenfolge nicht ändern, sie bestimmt den Effekt).
- `SAY` – freche Sprüche für Tabelle und Siegerehrung.
- `SHOT`, `COCKTAILS` – Getränke.

Die Schätz-Lösungen sind Richtwerte aus Studien und gängigen Angaben – bei Bedarf vor dem Abend anpassen.

## Projektaufbau

```
index.html            Einstieg
css/style.css         Design (Champions-Night-Look, Handy zuerst)
js/app.js             Oberfläche aller Handys
js/host.js            Spiellogik (läuft nur beim Spielleiter)
js/db.js              Firebase bzw. Demo-Modus
js/content.js         Fragen, Begriffe, Sprüche
js/shared.js          Runden, Punkte, Helfer
js/sound.js, fx.js    Sounds (synthetisch) und Konfetti
js/config.js          Firebase-Konfiguration
database.rules.json   Regeln für die Realtime Database
```

Keine Build-Tools, keine Abhängigkeiten ausser Firebase (per CDN), Google Fonts und einer kleinen QR-Code-Bibliothek.
