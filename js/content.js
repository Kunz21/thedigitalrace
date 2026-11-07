// ============================================================
//  INHALTE – hier kannst du alles frei anpassen.
//  Mebongs Champions-League · The Virtual Race
// ============================================================

export const TITLE = 'Mebongs Champions-League';
export const SUBTITLE = 'The Virtual Race';

// Getränke
export const SHOT = 'Adios Motherfucker';
export const COCKTAILS = ['Espresso Martini', 'Basil Smash'];

// ------------------------------------------------------------
//  RUNDE 1 – SCHÄTZMEISTER
//  q = Frage, a = Lösung (Zahl), u = Einheit, n = Hinweis bei der Auflösung
//  Pro Spiel werden 12 Fragen gezogen – zuerst die, die noch nicht dran waren.
//  Die Werte sind Richtwerte aus Studien bzw. gängigen Angaben.
// ------------------------------------------------------------
export const SCHAETZ = [
  { q: 'Wie viele Minuten dauert Sex im Durchschnitt – ohne Vorspiel?', a: 5.4, u: 'Minuten', n: 'Studie mit 500 Paaren und Stoppuhr (2005). Die meisten haben sich massiv überschätzt.' },
  { q: 'Wie viele Kalorien verbrennt ein Mann bei rund 25 Minuten Sex?', a: 101, u: 'kcal', n: 'Studie der Uni Montreal (2013). Ein Bier hat etwa gleich viel – Nullsummenspiel.' },
  { q: 'Wie lang ist ein erigierter Penis im weltweiten Durchschnitt?', a: 13.1, u: 'cm', n: 'Auswertung von über 15\'000 Messungen (2015). Lineal wieder einpacken.' },
  { q: 'Wie viele Millionen Spermien enthält ein durchschnittlicher Samenerguss?', a: 255, u: 'Millionen', n: 'Richtwert der WHO-Referenzwerte. Und trotzdem fragt keiner nach dem Weg.' },
  { q: 'Wie viele Kalorien hat ein durchschnittlicher Samenerguss?', a: 6, u: 'kcal', n: 'Gängige Angabe: etwa 5 bis 7 kcal. Diät-tauglich.' },
  { q: 'Wie viele Spermien produziert ein Mann pro Sekunde?', a: 1500, u: 'Spermien', n: 'Gängige Angabe: rund 1500 pro Sekunde. Während dieser Frage also ein paar Tausend.' },
  { q: 'Wie viele Spermien braucht es, um eine Eizelle zu befruchten?', a: 1, u: 'Spermium', n: 'Genau eins. Die anderen 254 Millionen sind Statisten.' },
  { q: 'Wie viele Nervenenden hat die Klitoris?', a: 10000, u: 'Nervenenden', n: 'Studie von 2022: rund 10\'000. Früher hiess es 8\'000. Die meisten Männer finden trotzdem keine.' },
  { q: 'Wie oft am Tag denkt ein Mann laut einer Studie an Sex?', a: 19, u: 'Mal', n: 'Ohio State University (2011): im Schnitt rund 19 Mal. Heute Abend deutlich öfter.' },
  { q: 'Wie hoch steigt der Puls beim Orgasmus ungefähr?', a: 140, u: 'Schläge/Min.', n: 'Richtwert: etwa 110 bis 180. Also wie beim Penaltyschiessen.' },
  { q: 'Wie oft paart sich ein Löwe in der Paarungszeit pro Tag?', a: 40, u: 'Mal', n: 'Gängige Angabe: 20 bis 50 Mal pro Tag – mehrere Tage am Stück. König der Tiere eben.' },
  { q: 'Wie viele Penisse hat eine Schlange?', a: 2, u: 'Stück', n: 'Zwei (Hemipenis). Und benutzt trotzdem nur einen aufs Mal.' },
  { q: 'Wie viele Minuten dauert der Orgasmus eines Schweins?', a: 30, u: 'Minuten', n: 'Gängige Angabe: bis zu 30 Minuten. Respekt, Kollege.' },
  { q: 'Wie lang ist der Penis eines Blauwals?', a: 2.5, u: 'Meter', n: 'Schätzungen liegen bei rund 2,4 bis 3 Metern.' },
  { q: 'Wie viele Zitzen hat eine Kuh?', a: 4, u: 'Zitzen', n: 'Vier. Wer «zwei» gesagt hat, war noch nie auf einem Bauernhof.' },
  { q: 'Wie lang ist die Zunge einer Giraffe?', a: 50, u: 'cm', n: 'Rund 45 bis 50 cm. Kein Kommentar.' },
  { q: 'Wie viele Male pupst ein Mensch durchschnittlich pro Tag?', a: 15, u: 'Mal', n: 'Gängige Angabe: rund 14 bis 23 Mal. Heute Abend vermutlich mehr.' },
  { q: 'Wie viele Milliarden Besuche zählte Pornhub im Jahr 2019?', a: 42, u: 'Milliarden', n: 'Laut Pornhubs eigenem Jahresrückblick 2019.' },
  { q: 'Wie viele Tausend Kondome wurden im Olympischen Dorf in Paris 2024 verteilt?', a: 300, u: 'Tausend', n: 'Rund 300\'000 Stück für etwa 14\'000 Athletinnen und Athleten.' },
  { q: 'Wie viele Jahre alt sind die ältesten gefundenen Kondome ungefähr?', a: 380, u: 'Jahre', n: 'Gefunden im Dudley Castle in England, um 1640, aus Tierdarm. Mehrweg!' },
  { q: 'Wie viele Gramm wiegt ein menschlicher Hoden ungefähr?', a: 20, u: 'Gramm', n: 'Richtwert: etwa 15 bis 25 Gramm pro Stück.' },
  { q: 'Wie viele Kilo wiegt das Gehirn eines Mannes ungefähr?', a: 1.4, u: 'kg', n: 'Rund 1,4 kg. Genutzt wird heute Abend deutlich weniger.' },
  { q: 'Wie viele Liter Bier trinkt eine Person in der Schweiz pro Jahr im Schnitt?', a: 54, u: 'Liter', n: 'Richtwert der letzten Jahre: gut 50 Liter pro Kopf. Diese Runde hebt den Schnitt.' },
  { q: 'Wie viele Kalorien hat ein Liter Lagerbier ungefähr?', a: 430, u: 'kcal', n: 'Rund 420 bis 450 kcal. Der Bauch kommt nicht vom Salat.' },
  { q: 'Wie viele Millionen Mass Bier wurden am Oktoberfest 2023 getrunken?', a: 7, u: 'Millionen Mass', n: 'Rund 7 Millionen Mass. Ein guter Anfang.' },
  { q: 'Wie viele Tage ist eine Elefantenkuh schwanger?', a: 650, u: 'Tage', n: 'Rund 22 Monate. Und du jammerst über 9.' },
  { q: 'Wie viele Tore erzielte Cristiano Ronaldo in der Champions League?', a: 140, u: 'Tore', n: '140 Tore – Rekord. Mehr Treffer als du je haben wirst.' },
  { q: 'Wie viele Kilogramm wiegt der Champions-League-Pokal?', a: 7.5, u: 'kg', n: 'Rund 7,5 kg. Das schwerste, was manche heute hochkriegen.' },
  { q: 'Wie hoch ist der Henkelpott?', a: 73.5, u: 'cm', n: '73,5 cm – also gut fünfmal so lang wie der Durchschnitt im Hosenbereich.' },
  { q: 'Wie viele Millionen Euro bezahlte PSG 2017 für Neymar?', a: 222, u: 'Mio. Euro', n: '222 Millionen – bis heute Rekord. Dafür hat er viel gelegen.' },
  { q: 'Wie viele Kilometer läuft ein Profi-Fussballer pro Spiel im Schnitt?', a: 11, u: 'km', n: 'Rund 10 bis 12 km. Ihr schafft heute knapp den Weg zur Bar.' },
  { q: 'Wie oft pro Jahr haben Schweizer laut der Durex-Umfrage 2005 Sex?', a: 103, u: 'Mal', n: 'Weltweiter Schnitt ebenfalls 103. Also zweimal pro Woche – theoretisch.' },
  { q: 'Wie viele Sexualpartner hat ein Mensch laut Durex-Umfrage im Leben durchschnittlich?', a: 9, u: 'Partner', n: 'Weltweiter Schnitt 2005. Bei manchen hier am Tisch eher Wunschdenken.' },
  { q: 'In welchem Alter haben Jugendliche in der Schweiz im Schnitt das erste Mal Sex?', a: 17, u: 'Jahre', n: 'Schweizer Studien: rund 17. Ein paar von euch waren wohl Spätzünder.' },
  { q: 'Wie viele Stellungen beschreibt das Kamasutra?', a: 64, u: 'Stellungen', n: 'Die meisten hier kennen davon zwei.' },
  { q: 'Wie viele Millimeter pro Minute schwimmt ein Spermium?', a: 3, u: 'mm/Minute', n: 'Rund 1 bis 4 mm. Gemütlich wie ein Sonntagsspaziergang.' },
  { q: 'Mit wie vielen km/h tritt ein Samenerguss ungefähr aus?', a: 45, u: 'km/h', n: 'Oft zitierte Angabe. Schneller als ein Velo in der Stadt.' },
  { q: 'Wie lang ist der Penis eines afrikanischen Elefanten?', a: 1.5, u: 'Meter', n: 'Gängige Angabe: rund 1,5 m.' },
  { q: 'Wie alt wurde Playboy-Gründer Hugh Hefner?', a: 91, u: 'Jahre', n: '1926 bis 2017. Im Pyjama bis zum Schluss.' },
  { q: 'In welchem Jahr erschien die erste Playboy-Ausgabe?', a: 1953, u: '', n: 'Mit Marilyn Monroe auf dem Titel.' },
];

// ------------------------------------------------------------
//  RUNDE 3 – BUZZER-CHAOS
//  q = Frage, o = 4 Antworten, c = Index der richtigen Antwort (0–3)
//  Pro Spiel werden 16 Fragen gezogen – zuerst die, die noch nicht dran waren.
// ------------------------------------------------------------
export const BUZZER = [
  { q: 'Welcher Klub hat die Königsklasse am häufigsten gewonnen?', o: ['AC Milan', 'Bayern München', 'Real Madrid', 'Liverpool'], c: 2 },
  { q: 'In welchem Jahr wurde aus dem Europapokal der Landesmeister die Champions League?', o: ['1988', '1992', '1995', '1999'], c: 1 },
  { q: 'Wer ist Rekordtorschütze der Champions League?', o: ['Lionel Messi', 'Robert Lewandowski', 'Raúl', 'Cristiano Ronaldo'], c: 3 },
  { q: 'Wer gewann die Champions League 2025?', o: ['Paris Saint-Germain', 'Inter Mailand', 'Real Madrid', 'Arsenal'], c: 0 },
  { q: 'In welcher Stadt fand der Champions-League-Final 2025 statt?', o: ['London', 'Istanbul', 'München', 'Madrid'], c: 2 },
  { q: 'Wie heisst der Champions-League-Pokal im Volksmund?', o: ['Henkelpott', 'Silberkanne', 'Bierkrug', 'Goldene Kanne'], c: 0 },
  { q: 'Welcher Klub holte 2005 das «Wunder von Istanbul»?', o: ['AC Milan', 'Liverpool', 'Chelsea', 'Juventus'], c: 1 },
  { q: 'Welcher Trainer hat die Champions League am häufigsten gewonnen?', o: ['Pep Guardiola', 'Zinédine Zidane', 'Carlo Ancelotti', 'José Mourinho'], c: 2 },
  { q: 'Aus welchem Land kommen die meisten Champions-League-Sieger?', o: ['England', 'Italien', 'Deutschland', 'Spanien'], c: 3 },
  { q: 'Welcher Schweizer gewann die Champions League mit zwei verschiedenen Klubs?', o: ['Manuel Akanji', 'Xherdan Shaqiri', 'Granit Xhaka', 'Yann Sommer'], c: 1 },
  { q: 'Welcher Schweizer Klub spielte 2024/25 in der Champions-League-Ligaphase?', o: ['FC Basel', 'Young Boys', 'FC Zürich', 'Servette'], c: 1 },
  { q: 'Welche Spirituose gehört in einen Basil Smash?', o: ['Wodka', 'Rum', 'Gin', 'Tequila'], c: 2 },
  { q: 'Welche Spirituose gehört in einen klassischen Espresso Martini?', o: ['Wodka', 'Gin', 'Whisky', 'Grappa'], c: 0 },
  { q: 'Welche Farbe hat ein Adios Motherfucker?', o: ['Grün', 'Blau', 'Rot', 'Gelb'], c: 1 },
  { q: 'Wie viele verschiedene Spirituosen stecken klassisch in einem Adios Motherfucker?', o: ['3', '4', '5', '6'], c: 2 },
  { q: 'Aus welchem Land stammt Jägermeister?', o: ['Österreich', 'Deutschland', 'Schweiz', 'Tschechien'], c: 1 },
  { q: 'Wie viel Volumenprozent hat Jägermeister?', o: ['25 %', '30 %', '35 %', '40 %'], c: 2 },
  { q: 'Woraus wird Tequila gemacht?', o: ['Kaktus', 'Agave', 'Zuckerrohr', 'Mais'], c: 1 },
  { q: 'Woraus wird Wodka traditionell gebrannt?', o: ['Getreide oder Kartoffeln', 'Trauben', 'Zuckerrohr', 'Agave'], c: 0 },
  { q: 'Welches Land hat den höchsten Bierkonsum pro Kopf der Welt?', o: ['Deutschland', 'Irland', 'Belgien', 'Tschechien'], c: 3 },
  { q: 'Was bedeutet «exen»?', o: ['Ein Glas in einem Zug leeren', 'Den Ex anrufen', 'Aus dem Spiel fliegen', 'Ein Glas zerbrechen'], c: 0 },
  { q: 'Welches Land wurde 2022 Fussball-Weltmeister?', o: ['Frankreich', 'Brasilien', 'Argentinien', 'Kroatien'], c: 2 },
  { q: 'Wer hat die meisten Ballon d\'Or gewonnen?', o: ['Cristiano Ronaldo', 'Lionel Messi', 'Michel Platini', 'Johan Cruyff'], c: 1 },
  { q: 'Wie viele Minuten dauert eine Verlängerung im Fussball?', o: ['15', '20', '30', '45'], c: 2 },
  { q: 'Wie viele Spieler pro Team stehen beim Eishockey regulär auf dem Eis (inkl. Goalie)?', o: ['5', '6', '7', '11'], c: 1 },
  { q: 'Welches Tier hat im Verhältnis zur Körpergrösse den längsten Penis?', o: ['Elefant', 'Esel', 'Seepocke', 'Blauwal'], c: 2 },
  { q: 'Welches Tier hat einen Penis mit kleinen Widerhaken?', o: ['Kater', 'Hund', 'Pferd', 'Delfin'], c: 0 },
  { q: 'Wofür wurde Viagra ursprünglich entwickelt?', o: ['Gegen Haarausfall', 'Gegen Herzbeschwerden', 'Gegen Kater', 'Gegen Höhenangst'], c: 1 },
  { q: 'Welchen Muskel trainiert man mit Kegelübungen?', o: ['Bizeps', 'Beckenboden', 'Wadenmuskel', 'Zwerchfell'], c: 1 },
  { q: 'Woher hat der G-Punkt seinen Namen?', o: ['Vom Arzt Ernst Gräfenberg', 'Von «geil»', 'Von «Genital»', 'Von «Gold»'], c: 0 },
  { q: 'Aus welchem Land stammt das Kamasutra?', o: ['China', 'Indien', 'Thailand', 'Ägypten'], c: 1 },
  { q: 'Wie heisst das «Kuschelhormon», das beim Orgasmus ausgeschüttet wird?', o: ['Adrenalin', 'Insulin', 'Oxytocin', 'Cortisol'], c: 2 },
  { q: 'Wie heisst die Angst vor Sex im Fachbegriff?', o: ['Arachnophobie', 'Genophobie', 'Klaustrophobie', 'Agoraphobie'], c: 1 },
  { q: 'Welches Emoji steht im Chat für den Hintern?', o: ['🍒 Kirsche', '🍑 Pfirsich', '🍌 Banane', '🥥 Kokosnuss'], c: 1 },
  { q: 'Welches Emoji steht im Chat für den Penis?', o: ['🥒 Gurke', '🌽 Mais', '🍆 Aubergine', '🥕 Karotte'], c: 2 },
  { q: 'Was bedeutet die Abkürzung «MILF»?', o: ['Mother I\'d Like to F…', 'Most Important Lady Friend', 'Milk Is Lovely Food', 'Man In Love Forever'], c: 0 },
  { q: 'Was ist der Adamsapfel?', o: ['Ein Teil des Kehlkopfs', 'Ein Muskel im Hals', 'Eine Drüse', 'Ein Knochen im Kiefer'], c: 0 },
  { q: 'Wie viele Herzen hat ein Oktopus?', o: ['1', '2', '3', '8'], c: 2 },
  { q: 'Was ist die Hauptstadt von Australien?', o: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], c: 2 },
  { q: 'Wie viele Mitglieder hat der Schweizer Bundesrat?', o: ['5', '7', '9', '26'], c: 1 },
];

// ------------------------------------------------------------
//  RUNDE 4 – KRITZEL-SPRINT (Zeichnen & Raten)
//  Kategorien können in der Lobby (Spielleiter) an/aus geschaltet werden.
// ------------------------------------------------------------
export const ZEICHNEN = [
  { id: 'fussball', name: 'Champions League & Fussball', terms: ['Henkelpott', 'Elfmeter', 'Rote Karte', 'Schwalbe', 'Trikottausch', 'Torjubel', 'Freistossmauer', 'Schiedsrichter', 'Eckfahne', 'Stadion', 'Kopfball', 'Abseits'] },
  { id: 'maenner', name: 'Männernachmittag', terms: ['Grill', 'Bierbauch', 'Fernbedienung', 'Rasenmäher', 'Bierkiste', 'Sixpack', 'Werkzeugkasten', 'Hantel', 'Sofa', 'Bratwurst', 'Pickup', 'Bart'] },
  { id: 'frech', name: 'Schlafzimmer (frech)', terms: ['Kondom', 'BH', 'Handschellen', 'Peitsche', 'Wasserbett', 'Stringtanga', 'Morgenlatte', 'Löffelchen', 'Striptease', 'Massageöl', 'Walk of Shame', 'Doppelbett'] },
  { id: 'ausgang', name: 'Ausgang & Party', terms: ['Shot', 'Türsteher', 'Karaoke', 'Taxi', 'Kater', 'Bierpong', 'Discokugel', 'DJ', 'Kebab', 'Tequila', 'Polonaise', 'Strohhalm'] },
  { id: 'schweiz', name: 'Typisch Schweiz', terms: ['Fondue', 'Kuh', 'Alphorn', 'Matterhorn', 'Skilift', 'Schwingen', 'Steinbock', 'Raclette', 'Sackmesser', 'Schoggi', 'Kuhglocke', 'Bergbahn'] },
  { id: 'wintersport', name: 'Wintersport & Eishockey', terms: ['Puck', 'Eishockeyschläger', 'Zamboni', 'Skisprungschanze', 'Curlingstein', 'Snowboard', 'Schneemann', 'Goalie-Maske', 'Langlaufski', 'Après-Ski', 'Schlittschuh', 'Gondel'] },
];

// ------------------------------------------------------------
//  RUNDE 5 – DIE BOMBE (Final)
//  Pro Explosion wird eine neue Kategorie gezogen.
// ------------------------------------------------------------
export const BOMB = [
  'Biermarken', 'Fussballklubs aus Europa', 'Schweizer Kantone', 'Spirituosen', 'Stellungen im Bett',
  'Automarken', 'Champions-League-Sieger', 'Ausdrücke für Brüste', 'Cocktails', 'Schweizer Städte',
  'Körperteile', 'Ausreden fürs Zuspätkommen', 'Eishockey-Klubs', 'Dinge, die man im Bett macht', 'Fussballer mit R',
  'Wörter für Penis', 'Orte für einen Quickie', 'Pornotitel', 'Anmachsprüche',
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
//  FRECHE SPRÜCHE
//  {n} = Name, {p} = Platz, {d} = Anzahl Plätze, {g} = Rater, {t} = Begriff
//  roundLose = Spruch beim Rundenletzten (zusammen mit seinem Shot)
//  Je mehr Sprüche pro Liste, desto mehr Abwechslung.
// ------------------------------------------------------------
export const SAY = {
  leader: [
    '{n} führt – Winnertyp durch und durch.',
    'Champion in spe: {n} thront ganz oben.',
    '{n} sitzt oben wie der Boss im Puff.',
    'Alphatier {n} markiert sein Revier: Platz 1.',
    '{n} führt. Zeit für ein taktisches Foul, Jungs?',
    '{n} führt so dominant, dass es fast pervers ist.',
    '{n} liegt oben – und zwar nicht zum ersten Mal heute.',
    '{n} ist Leader. Der Rest: Statisten mit Durst.',
    'Siegertyp {n} hat sich oben breitgemacht.',
    '{n} an der Spitze – die Maschine kennt keine Gnade.',
    'Hengst {n} galoppiert allen davon.',
  ],
  last: [
    '{n} auf Platz {p}. Du Lutscher, das ist ganz unten.',
    'Rote Laterne für {n}. Du Taugenichts leuchtest wenigstens.',
    '{n}, du Hund – Platz {p} und kein Knochen in Sicht.',
    '{n}, du Loooser: Platz {p}. Gratuliere zu gar nichts.',
    '{n} auf Platz {p} – die Kreisliga hat angerufen, sie wollen dich.',
    '{n} liegt unten. Kennt er ja.',
    '{n}, du Schlappschwanz – schlaffer war die Tabelle noch nie.',
    'Platz {p}: {n}. Viel Vorspiel, kein Abschluss.',
    '{n}, du Versager. Platz {p} – Abstieg direkt an die Bar.',
  ],
  climb: [
    '{n} springt {d} Plätze hoch – Macher-Modus an!',
    '+{d} für {n}. Da wird einer zum Winnertyp.',
    '{n} klettert {d} Plätze. Jemand hat ihm Viagra ins Bier gekippt.',
    '{n} +{d}: Comeback des Jahres, Leute.',
    '{d} Plätze rauf für {n} – Dopingkontrolle, sofort!',
    'Vom Lutscher zum Macher: {n} +{d}.',
    'Raketenstart! {n} fliegt {d} Plätze nach oben.',
    'Bestie {n} frisst sich {d} Plätze nach vorne.',
    '{n} macht {d} Plätze gut. Wer hat dem was ins Glas getan?',
    '{n} geht ab wie ein Zäpfchen: +{d}.',
  ],
  fall: [
    '{n} rutscht {d} Plätze ab – du Lutscher, festhalten!',
    '−{d} für {n}. Du Hund, wo ist dein Biss?',
    '{n} stürzt {d} Plätze ab. Schneller schlaff als gedacht.',
    '{n} verliert {d} Plätze – erst gross angeben, dann nichts bringen.',
    '{n} fällt {d} Plätze, wie seine Hose beim zweiten Date.',
    '{n} rauscht {d} Plätze runter. Ab auf die Transferliste!',
    '{n} −{d}. Kurz gestanden, schnell gefallen.',
    '{n} −{d}: Vom Macher zum Lacher.',
    '{n} rutscht {d} Plätze ab. Der Lauch welkt dahin.',
    '{n} fällt {d} Plätze – so tief wie sein Niveau.',
    'Freier Fall: {n} −{d}. Fallschirm vergessen, du Tubel?',
  ],
  roundWin: [
    '{n} holt die Runde – Champion-Material, ganz klar.',
    'Macher {n} hat geliefert. Der Rest hat nur zugeschaut.',
    '{n}, du Winnertyp! Cocktail her, aber zackig.',
    'Bestie {n} schlägt zu. Die anderen können einpacken.',
    'Rundensieg für {n} – die Maschine läuft heiss.',
    '{n}, du Legende! Heute läuft bei dir einfach alles. Fast alles.',
    'Boss {n} hat gesprochen. Alle anderen: Klappe halten und trinken.',
    '{n} kommt als Erster – ausnahmsweise ein Grund zum Feiern.',
    'Gigant {n} trampelt alles nieder.',
    '{n} holt die Runde. Siegertyp mit Ansage.',
    '{n} spielt wie ein Champion – und säuft gleich wie einer. Cocktail, bitte!',
  ],
  roundLose: [
    '{n}, du Lutscher! Shot her und Schnauze.',
    'Letzter: {n}. Du Taugenichts, ab an die Bar.',
    '{n}, du Hund! Das war gar nichts.',
    '{n}, du Loooser – mit drei O, weil eins nicht reicht.',
    '{n}, du Lauch! Selbst Gemüse hätte mehr geholt.',
    '{n}, du Schlappschwanz – heute steht bei dir gar nichts.',
    '{n}, du Weichei. Shot runter, Eier zeigen.',
    '{n}, du Tubel! Das kann ja nicht wahr sein.',
    '{n}, du Warmduscher. Kalter Shot als Therapie.',
    '{n}, du Hosenscheisser. Mut antrinken, aber dalli.',
    '{n}, du Lappen. Dich wischt man heute noch auf.',
  ],
  boom: [
    '{n} ist zu früh explodiert – kennt man ja von ihm.',
    '{n} hatte das Ding zu lange in der Hand.',
    'Bumm – und bei {n} ist schon wieder alles vorbei.',
    '{n} konnte nicht rechtzeitig loslassen.',
    '{n} wollte den Höhepunkt rauszögern. Hat nicht geklappt.',
    '{n} geht hoch wie ein Teenager beim ersten Mal.',
    '{n} hat\'s nicht mehr halten können. Typisch.',
    'Bumm! {n} ist geplatzt – wie sein letztes Date.',
    '{n} kommt zu früh – diesmal mit Knall.',
    'Explosion bei {n}. Wer zögert, verliert.',
    '{n} hat zu lange gefummelt.',
    '{n} geht in die Luft. Mal ehrlich: Das hat jeder kommen sehen.',
    '{n} hat die Bombe heiss gemacht – und sich verbrannt.',
  ],
  buzzWrong: [
    '{n} drückt schneller als er denkt.',
    '{n}: viel Druck, wenig Ahnung.',
    '{n} war zu früh dran – Klassiker.',
    '{n} hat zu früh abgedrückt.',
    '{n}: Grosse Klappe, nichts dahinter.',
    '{n} drückt, bevor das Hirn hochgefahren ist.',
    '{n}: schnell gedrückt, schnell blamiert.',
    'Falsch, {n}! Zu früh gekommen – wieder mal.',
    '{n} hatte den Finger schneller als die Antwort.',
    '{n}, du Lutscher! Erst denken, dann drücken.',
    '{n} drückt mit voller Überzeugung auf die falsche Antwort. Respekt.',
    'Minuspunkt für {n}. Der Buzzer lacht dich aus.',
    '{n}, du Taugenichts – das war nicht mal knapp.',
    'Falsch! {n}, nächstes Mal erst das Hirn einschalten.',
    '{n}, du Hund! Zu gierig, zu falsch.',
    'Peinlich, {n}. Das hätte sogar der Kellner gewusst.',
    '{n} buzzert im Blindflug. Bruchlandung.',
    '{n} rät wild drauflos – wie beim ersten Date.',
    'Minus eins, {n}. Schnell sein ist nicht alles, frag deine Freundin.',
    '{n}, du Loooser – dein Finger war klüger als du. Leider nicht viel.',
  ],
  drawHit: [
    '{g} erkennt «{t}» sofort – so was hat er wohl öfter vor Augen.',
    '{g} hat «{t}» erraten. Schmutzige Fantasie zahlt sich aus.',
    '«{t}»! {g} weiss genau, wie das aussieht.',
    '{g} errät «{t}». Kenner unter sich.',
    '«{t}»! {g} hat das schon mal in echt gesehen – fragt lieber nicht, wo.',
    'Treffer! {g} sieht in jedem Strich was Versautes – diesmal passt\'s: «{t}».',
    '{g} knackt «{t}». Picasso wäre stolz, deine Mutter eher nicht.',
    '{g} errät «{t}». Endlich bringt dir dein Pornokonsum mal was.',
    '{g} sieht «{t}» und kriegt glänzende Augen.',
    'Volltreffer {g}: «{t}». Der Zeichner hat Talent, der Rater Erfahrung.',
    '{g} holt sich «{t}». Hände über die Decke, bitte.',
    '«{t}»! {g}, du kleiner Schmutzfink.',
    '{g} erkennt «{t}». Das Gekritzel sah verdächtig nach was anderem aus.',
    '«{t}» – {g} liest den Stift wie einen Liebesbrief.',
  ],
  schaetzBest: [
    '{n} schätzt am genausten – der misst wohl öfter nach.',
    '{n} hat Augenmass. Übt wohl jeden Morgen vor dem Spiegel.',
    '{n} liegt am nächsten dran. Erfahrungswert, vermutlich.',
    'Volltreffer von {n}. Woher weiss der das so genau?',
    'Augenmass-Champion {n}. Misst wohl öfter mal nach.',
    'Bester Tipp: {n}. Der hat das wohl schon selbst ausprobiert.',
    '{n} schätzt wie ein Profi. Fragt lieber nicht, in welcher Branche.',
    '{n} landet am nächsten. Der Rest schätzt wie Jungfrauen.',
    'Fast ein Volltreffer von {n}. Hat er heimlich mitgezählt?',
    '{n} liegt vorne. Wissen ist Macht – schmutziges Wissen erst recht.',
    '{n} schätzt am genausten. Der Rest liegt so daneben wie im Bett.',
    '{n} kennt die Zahl fast genau. Verdächtig, sehr verdächtig.',
    'Bester Schätzer: {n}. Ein Mann der Zahlen – und der Ferkeleien.',
    'Treffsicher: {n}. Wenigstens irgendwo trifft er heute.',
    '{n} schätzt top. Die anderen sollten mal öfter nachzählen.',
  ],
  champion: [
    '{n}, der ultimative Winnertyp – Henkelpott, Cocktail, Krone!',
    '{n} holt den Titel. Heute Nacht darf er oben liegen.',
    '{n} ist Champion. Die Bars dieser Stadt sind gewarnt.',
    '{n}, du Maschine! Champion mit Ansage.',
  ],
  loser: [
    '{n}, du Lutscher – Rote Laterne, und die nächste Runde zahlst du!',
    '{n} ist Letzter. Du Taugenichts trägst die Laterne heim.',
    '{n}, du Hund! Kein Pott, kein Ruhm, nur ein Kater.',
    '{n}: Platz {p} und morgen Kopfweh. Herzlichen Glückwunsch.',
    '{n}, du Lauch, bist offiziell der Schlechteste im Raum.',
    '{n}, du Schlappschwanz: Turnier verloren, Ehre auch.',
    '{n}, du Niete. Gezogen, verloren, bezahlt.',
    '{n}, du Lappen – der Abend hat dich ausgewrungen.',
  ],
};

export const BOT_NAMES = ['Bot Ueli', 'Bot Röbi', 'Bot Chantal', 'Bot Bernie', 'Bot Fredi', 'Bot Mändu', 'Bot Sepp', 'Bot Jacqueline'];
