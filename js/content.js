// ============================================================
//  INHALTE – hier kannst du alles frei anpassen.
//  Mebongs Champions-League · The Virtual Race
// ============================================================

export const TITLE = 'Mebongs Champions-League';
export const SUBTITLE = 'The Virtual Race';

// Getränke
export const SHOT = 'Adios Motherfucker';
export const COCKTAILS = ['Espresso Martini', 'Basil Smash'];
export const ALC_FREE_SHOT = 'Ingwer-Shot (alkoholfrei) 🫚';

// ------------------------------------------------------------
//  RUNDE 1 – SCHÄTZMEISTER
//  q = Frage, a = Lösung (Zahl), u = Einheit, n = Hinweis bei der Auflösung
//  Pro Spiel werden 3 Fragen zufällig gezogen.
//  Die Werte sind Richtwerte aus Studien bzw. gängigen Angaben.
// ------------------------------------------------------------
export const SCHAETZ = [
  { q: 'Wie viele Minuten dauert Sex im Durchschnitt – ohne Vorspiel?', a: 5.4, u: 'Minuten', n: 'Studie mit 500 Paaren und Stoppuhr (2005). Die meisten haben sich massiv überschätzt.' },
  { q: 'Wie viele Kalorien verbrennt ein Mann bei rund 25 Minuten Sex?', a: 101, u: 'kcal', n: 'Studie der Uni Montreal (2013). Ein Bier hat etwa gleich viel – Nullsummenspiel.' },
  { q: 'Wie lang ist ein erigierter Penis im weltweiten Durchschnitt?', a: 13.1, u: 'cm', n: 'Auswertung von über 15\'000 Messungen (2015). Lineal wieder einpacken.' },
  { q: 'Wie viele Millionen Spermien enthält ein durchschnittlicher Samenerguss?', a: 255, u: 'Millionen', n: 'Richtwert der WHO-Referenzwerte. Und trotzdem fragt keiner nach dem Weg.' },
  { q: 'Wie viele Kalorien hat ein durchschnittlicher Samenerguss?', a: 6, u: 'kcal', n: 'Gängige Angabe: etwa 5 bis 7 kcal. Diät-tauglich.' },
  { q: 'Wie oft pupst ein Mensch durchschnittlich pro Tag?', a: 15, u: 'Mal', n: 'Gängige Angabe: rund 14 bis 23 Mal. Heute Abend vermutlich mehr.' },
  { q: 'Wie viele Milliarden Besuche zählte Pornhub im Jahr 2019?', a: 42, u: 'Milliarden', n: 'Laut Pornhubs eigenem Jahresrückblick 2019.' },
  { q: 'Wie viele Minuten dauert der Orgasmus eines Schweins?', a: 30, u: 'Minuten', n: 'Gängige Angabe: bis zu 30 Minuten. Respekt, Kollege.' },
  { q: 'Wie lang ist der Penis eines Blauwals?', a: 2.5, u: 'Meter', n: 'Schätzungen liegen bei rund 2,4 bis 3 Metern.' },
  { q: 'Wie viele Tausend Kondome wurden im Olympischen Dorf in Paris 2024 verteilt?', a: 300, u: 'Tausend', n: 'Rund 300\'000 Stück für etwa 14\'000 Athletinnen und Athleten.' },
  { q: 'Wie viele Gramm wiegt ein menschlicher Hoden ungefähr?', a: 20, u: 'Gramm', n: 'Richtwert: etwa 15 bis 25 Gramm pro Stück.' },
  { q: 'Wie viele Liter Bier trinkt eine Person in der Schweiz pro Jahr im Schnitt?', a: 54, u: 'Liter', n: 'Richtwert der letzten Jahre: gut 50 Liter pro Kopf. Diese Runde hebt den Schnitt.' },
  { q: 'Wie viele Tage ist eine Elefantenkuh schwanger?', a: 650, u: 'Tage', n: 'Rund 22 Monate. Und du jammerst über 9.' },
  { q: 'Wie viele Liter Speichel produziert ein Mensch pro Tag?', a: 1, u: 'Liter', n: 'Etwa 0,5 bis 1,5 Liter – beim Anblick eines Espresso Martini mehr.' },
];

// ------------------------------------------------------------
//  RUNDE 3 – BUZZER-CHAOS
//  q = Frage, o = 4 Antworten, c = Index der richtigen Antwort (0–3)
//  Pro Spiel werden 10 Fragen zufällig gezogen.
// ------------------------------------------------------------
export const BUZZER = [
  { q: 'Welcher Klub hat die Königsklasse am häufigsten gewonnen?', o: ['AC Milan', 'Bayern München', 'Real Madrid', 'Liverpool'], c: 2 },
  { q: 'In welchem Jahr wurde aus dem Europapokal der Landesmeister die Champions League?', o: ['1988', '1992', '1995', '1999'], c: 1 },
  { q: 'Wer ist Rekordtorschütze der Champions League?', o: ['Lionel Messi', 'Robert Lewandowski', 'Raúl', 'Cristiano Ronaldo'], c: 3 },
  { q: 'Wer gewann die Champions League 2025?', o: ['Paris Saint-Germain', 'Inter Mailand', 'Real Madrid', 'Arsenal'], c: 0 },
  { q: 'In welcher Stadt fand der Champions-League-Final 2025 statt?', o: ['London', 'Istanbul', 'München', 'Madrid'], c: 2 },
  { q: 'Wie heisst der Champions-League-Pokal im Volksmund?', o: ['Henkelpott', 'Silberkanne', 'Bierkrug', 'Goldene Kanne'], c: 0 },
  { q: 'Welcher Schweizer Klub spielte 2024/25 in der Champions-League-Ligaphase?', o: ['FC Basel', 'Young Boys', 'FC Zürich', 'Servette'], c: 1 },
  { q: 'Welche Spirituose gehört in einen Basil Smash?', o: ['Wodka', 'Rum', 'Gin', 'Tequila'], c: 2 },
  { q: 'Welche Spirituose gehört in einen klassischen Espresso Martini?', o: ['Wodka', 'Gin', 'Whisky', 'Grappa'], c: 0 },
  { q: 'Welche Farbe hat ein Adios Motherfucker?', o: ['Grün', 'Blau', 'Rot', 'Gelb'], c: 1 },
  { q: 'Wie viele verschiedene Spirituosen stecken klassisch in einem Adios Motherfucker?', o: ['3', '4', '5', '6'], c: 2 },
  { q: 'Aus welchem Land stammt Jägermeister?', o: ['Österreich', 'Deutschland', 'Schweiz', 'Tschechien'], c: 1 },
  { q: 'Welches Land hat den höchsten Bierkonsum pro Kopf der Welt?', o: ['Deutschland', 'Irland', 'Belgien', 'Tschechien'], c: 3 },
  { q: 'Was bedeutet «exen»?', o: ['Ein Glas in einem Zug leeren', 'Den Ex anrufen', 'Aus dem Spiel fliegen', 'Ein Glas zerbrechen'], c: 0 },
  { q: 'Welches Land wurde 2022 Fussball-Weltmeister?', o: ['Frankreich', 'Brasilien', 'Argentinien', 'Kroatien'], c: 2 },
  { q: 'Wer hat die meisten Ballon d\'Or gewonnen?', o: ['Cristiano Ronaldo', 'Lionel Messi', 'Michel Platini', 'Johan Cruyff'], c: 1 },
  { q: 'Wie viele Minuten dauert eine Verlängerung im Fussball?', o: ['15', '20', '30', '45'], c: 2 },
  { q: 'Wie viele Spieler pro Team stehen beim Eishockey regulär auf dem Eis (inkl. Goalie)?', o: ['5', '6', '7', '11'], c: 1 },
  { q: 'Welches Tier hat im Verhältnis zur Körpergrösse den längsten Penis?', o: ['Elefant', 'Esel', 'Seepocke', 'Blauwal'], c: 2 },
  { q: 'Wofür wurde Viagra ursprünglich entwickelt?', o: ['Gegen Haarausfall', 'Gegen Herzbeschwerden', 'Gegen Kater', 'Gegen Höhenangst'], c: 1 },
  { q: 'Welchen Muskel trainiert man mit Kegelübungen?', o: ['Bizeps', 'Beckenboden', 'Wadenmuskel', 'Zwerchfell'], c: 1 },
  { q: 'Wie viele Herzen hat ein Oktopus?', o: ['1', '2', '3', '8'], c: 2 },
  { q: 'Was ist die Hauptstadt von Australien?', o: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], c: 2 },
  { q: 'Wie viele Mitglieder hat der Schweizer Bundesrat?', o: ['5', '7', '9', '26'], c: 1 },
];

// ------------------------------------------------------------
//  RUNDE 4 – PANTOMIME-SPRINT
//  Kategorien können in der Lobby (Spielleiter) an/aus geschaltet werden.
// ------------------------------------------------------------
export const PANTO = [
  { id: 'fussball', name: 'Champions League & Fussball', terms: ['Schwalbe im Strafraum', 'Elfmeter in die Wolken', 'Trikottausch', 'Rote Karte', 'Ronaldos Torjubel', 'Freistoss-Mauer (Hände vor dem Schritt)', 'Trainer tobt an der Seitenlinie', 'VAR-Check', 'Pokal stemmen', 'Spieler wälzt sich verletzt', 'Kopfballtor', 'Rudelbildung'] },
  { id: 'maenner', name: 'Männernachmittag', terms: ['Grill anfeuern', 'Bierflasche mit Feuerzeug öffnen', 'IKEA-Schrank aufbauen', 'Fernbedienung suchen', 'Rasenmäher anwerfen', 'Einparken mit einer Hand', 'Bauch einziehen am Strand', 'Bierkiste schleppen', 'Schnarchen auf dem Sofa', 'Um 4 Uhr heimschleichen', 'Hantel-Selfie im Gym', 'Männerschnupfen'] },
  { id: 'frech', name: 'Schlafzimmer (frech)', terms: ['BH mit einer Hand öffnen', 'Walk of Shame', 'Dirty-Dancing-Hebefigur', 'Striptease', 'Kondom im Portemonnaie suchen', 'Morgenlatte verstecken', 'Wasserbett', 'Handschellen', 'Massage mit Öl', 'Löffelchen', 'Sexy Feuerwehrmann', 'Von den Schwiegereltern erwischt'] },
  { id: 'ausgang', name: 'Ausgang & Party', terms: ['Shot exen', 'Türsteher', 'Karaoke-Star', 'Taxi rufen um 4 Uhr', 'Tanzen wie Papa', 'Kater am Morgen', 'Bierpong-Wurf', 'Limbo', 'Polonaise', 'DJ', 'Kebab um 3 Uhr', 'Ex-Freundin anrufen'] },
  { id: 'schweiz', name: 'Typisch Schweiz', terms: ['Jodeln', 'Fondue rühren', 'Kuh melken', 'Alphorn blasen', 'Skilift verpassen', 'Schwingen', 'Zug fährt pünktlich ab', 'Steinbock', 'Raclette schaben', 'Hornussen', 'Sackmesser', 'Schoggi essen'] },
  { id: 'wintersport', name: 'Wintersport & Eishockey', terms: ['Bodycheck', 'Penalty', 'Zamboni fahren', 'Skispringen', 'Pirouette auf dem Eis', 'Curling wischen', 'Faustkampf mit Handschuhen', 'Langlauf', 'Snowboard-Sturz', 'Biathlon-Schiessen', 'Après-Ski', 'Goalie hält Puck mit dem Gesicht'] },
];

// ------------------------------------------------------------
//  RUNDE 5 – DIE BOMBE (Final)
//  Pro Explosion wird eine neue Kategorie gezogen.
// ------------------------------------------------------------
export const BOMB = [
  'Biermarken', 'Fussballklubs aus Europa', 'Schweizer Kantone', 'Spirituosen', 'Stellungen im Bett',
  'Automarken', 'Champions-League-Sieger', 'Ausdrücke für Brüste', 'Cocktails', 'Schweizer Städte',
  'Körperteile', 'Ausreden fürs Zuspätkommen', 'Eishockey-Klubs', 'Dinge, die man im Bett macht', 'Fussballer mit R',
];

// ------------------------------------------------------------
//  GLÜCKSRAD – Reihenfolge NICHT ändern (Index = Effekt), Texte schon.
// ------------------------------------------------------------
export const WHEEL = [
  { e: '🥃', s: 'Shotrunde', t: 'Shotrunde – alle trinken!' },
  { e: '👈', s: 'Links trinkt', t: 'Der Spieler links vom Letzten trinkt' },
  { e: '➕', s: '+2 Letzter', t: '+2 Punkte für den Letzten' },
  { e: '➖', s: '−2 Leader', t: '−2 Punkte für den Führenden' },
  { e: '🃏', s: 'Joker', t: 'Joker für den Letzten' },
  { e: '🍺', s: 'Exen', t: 'Der Letzte ext sein Hauptgetränk' },
];

// ------------------------------------------------------------
//  FRECHE SPRÜCHE – {n} = Name, {p} = Platz, {d} = Anzahl Plätze
// ------------------------------------------------------------
export const SAY = {
  leader: [
    '{n} marschiert durch wie Real Madrid im April.',
    '{n} poliert schon mal den Henkelpott.',
    '{n} spielt in einer eigenen Liga.',
    'Alle jagen {n}. Zeit für ein taktisches Foul?',
    '{n} grinst wie einer, der doppelte Melonen 🍈🍈 gesehen hat.',
  ],
  last: [
    'Vom Sofa direkt auf Platz {p}: {n}.',
    '{n} spielt Champions League – die der Kreisliga.',
    'Rote Laterne für {n}. Licht an, Hirn aus.',
    '{n}: Abstiegskampf mit Ansage.',
    '{n} trifft heute nur die Bar.',
  ],
  climb: [
    '{n} schiesst {d} Plätze nach vorne – Dopingkontrolle!',
    '{n} macht {d} Plätze gut. Wer hat dem was ins Glas getan?',
  ],
  fall: [
    '{n} stürzt {d} Plätze ab wie ein Stürmer im Strafraum.',
    '{n} verliert {d} Plätze – Transferliste.',
  ],
  roundWin: [
    'Melonen-Moment 🍈🍈 für {n}!',
    '{n} holt die Runde – Cocktail, bitte!',
    'Gala-Auftritt von {n}.',
  ],
  champion: '{n} ist Champion und stemmt den Henkelpott!',
  loser: '{n} trägt die Rote Laterne nach Hause.',
};

export const BOT_NAMES = ['Bot Ueli', 'Bot Röbi', 'Bot Chantal', 'Bot Bernie', 'Bot Fredi', 'Bot Mändu', 'Bot Sepp', 'Bot Jacqueline'];
