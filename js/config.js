// ============================================================
//  FIREBASE-KONFIGURATION
//  Firebase Console → Projekteinstellungen → «Meine Apps» → Web-App → Konfiguration
//  Wichtig: databaseURL muss gesetzt sein (Realtime Database).
//
//  Bleibt firebaseConfig = null, läuft das Spiel im DEMO-MODUS:
//  nur im selben Browser (mehrere Tabs) – ideal zum Testen mit Bots.
// ============================================================

export const firebaseConfig = null;

/* Beispiel:
export const firebaseConfig = {
  apiKey: 'AIza...',
  authDomain: 'mebong-cl.firebaseapp.com',
  databaseURL: 'https://mebong-cl-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'mebong-cl',
  storageBucket: 'mebong-cl.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123',
};
*/
