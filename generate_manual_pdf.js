const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outPath = path.join(process.cwd(), 'Benutzerhandbuch_UntisProMax.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, left: 50, right: 50, bottom: 50 },
  info: {
    Title: 'Benutzerhandbuch UntisProMax',
    Author: 'UntisProMax',
    Subject: 'Benutzerdokumentation',
  },
});

doc.pipe(fs.createWriteStream(outPath));

function h1(text) {
  doc.moveDown(0.2);
  doc.font('Helvetica-Bold').fontSize(24).fillColor('#0b5cab').text(text);
  doc.moveDown(0.4);
}

function h2(text) {
  ensureSpace(60);
  doc.moveDown(0.6);
  doc.font('Helvetica-Bold').fontSize(16).fillColor('#0b5cab').text(text);
  doc.moveDown(0.2);
  const y = doc.y;
  doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).lineWidth(0.8).strokeColor('#d9d9d9').stroke();
  doc.moveDown(0.5);
}

function h3(text) {
  ensureSpace(40);
  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#1a1a1a').text(text);
  doc.moveDown(0.2);
}

function p(text) {
  ensureSpace(28);
  doc.font('Helvetica').fontSize(11).fillColor('#1a1a1a').text(text, { lineGap: 2 });
  doc.moveDown(0.35);
}

function bullet(items) {
  items.forEach((item) => {
    ensureSpace(24);
    doc.font('Helvetica').fontSize(11).fillColor('#1a1a1a').text(`• ${item}`, { lineGap: 2 });
  });
  doc.moveDown(0.35);
}

function step(n, text) {
  ensureSpace(32);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#0b5cab').text(`Schritt ${n}: `, { continued: true });
  doc.font('Helvetica').fillColor('#1a1a1a').text(text);
  doc.moveDown(0.2);
}

function note(text) {
  ensureSpace(60);
  const x = doc.page.margins.left;
  const y = doc.y;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const h = 44;
  doc.save();
  doc.rect(x, y, w, h).fill('#eef4fb');
  doc.rect(x, y, 4, h).fill('#0b5cab');
  doc.restore();
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#1a1a1a').text('Hinweis:', x + 10, y + 10, { continued: true });
  doc.font('Helvetica').text(` ${text}`, x + 55, y + 10, { width: w - 65 });
  doc.y = y + h + 8;
}

function screenshotBox(title, instruction) {
  ensureSpace(190);
  const x = doc.page.margins.left;
  const y = doc.y;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const h = 155;

  doc.save();
  doc.rect(x, y, w, h).lineWidth(1.5).dash(5, { space: 4 }).strokeColor('#8f8f8f').stroke();
  doc.undash();
  doc.restore();

  doc.font('Helvetica-Bold').fontSize(11).fillColor('#3f3f3f').text(title, x + 12, y + 16, { width: w - 24, align: 'center' });
  doc.font('Helvetica').fontSize(10).fillColor('#555').text(`Einfügen: ${instruction}`, x + 18, y + 48, {
    width: w - 36,
    align: 'center',
    lineGap: 2,
  });
  doc.y = y + h + 12;
}

function table(rows) {
  ensureSpace(140);
  const x = doc.page.margins.left;
  let y = doc.y;
  const fullW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const cols = [fullW * 0.26, fullW * 0.36, fullW * 0.38];
  const header = ['Problem', 'Mögliche Ursache', 'Lösung'];

  const rowHeight = 36;
  doc.save();
  doc.rect(x, y, fullW, rowHeight).fill('#f4f7fb');
  doc.restore();

  let cx = x;
  header.forEach((h, i) => {
    doc.rect(cx, y, cols[i], rowHeight).lineWidth(1).strokeColor('#d9d9d9').stroke();
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#1a1a1a').text(h, cx + 8, y + 12, { width: cols[i] - 16 });
    cx += cols[i];
  });

  y += rowHeight;
  rows.forEach((row) => {
    const est = 56;
    ensureSpace(est + 8);
    let innerY = y;
    let colX = x;
    const heights = row.map((txt, idx) => doc.heightOfString(txt, { width: cols[idx] - 16, lineGap: 2 }) + 16);
    const h = Math.max(...heights, 44);

    row.forEach((txt, idx) => {
      doc.rect(colX, innerY, cols[idx], h).lineWidth(1).strokeColor('#d9d9d9').stroke();
      doc.font('Helvetica').fontSize(9.5).fillColor('#1a1a1a').text(txt, colX + 8, innerY + 8, {
        width: cols[idx] - 16,
        lineGap: 2,
      });
      colX += cols[idx];
    });
    y += h;
  });

  doc.y = y + 8;
}

function ensureSpace(minHeight) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + minHeight > bottom) {
    doc.addPage();
  }
}

h1('Benutzerhandbuch UntisProMax');
p('Dieses Handbuch richtet sich an normale Nutzerinnen und Nutzer (keine Admin-Rechte). Es erklärt die wichtigsten Funktionen in klaren Schritten für den Schulalltag.');
p('Version: April 2026 · Sprache: Deutsch · Zielgruppe: Regelmäßige Nutzung in der Web-App');
note('In diesem Dokument sind Screenshot-Platzhalter enthalten. Ergänze dort echte Screenshots aus eurer laufenden Web-App.');

h2('Inhaltsübersicht');
bullet([
  '1. Anmeldung und Start',
  '2. Navigation (untere Menüleiste)',
  '3. Startseite verstehen',
  '4. Stundenplan nutzen',
  '5. Hausaufgaben',
  '6. Tests',
  '7. Ereignisse',
  '8. Krank / Nachholstoff',
  '9. Ankündigungen',
  '10. Flashcards',
  '11. Einstellungen und Profil',
  '12. Fehlerbehebung und Tipps',
]);

h2('1. Anmeldung und Start');
p('Nach dem Öffnen der Web-App siehst du den Login-Bereich. Dort meldest du dich mit E-Mail-Adresse und Passwort an.');
step(1, 'E-Mail und Passwort eingeben.');
step(2, 'Auf „Anmelden“ klicken.');
step(3, 'Nach erfolgreichem Login wirst du zur Startseite weitergeleitet.');
screenshotBox('Screenshot-Platzhalter A: Login-Bereich', 'Bildschirm mit Feldern „E-Mail-Adresse“, „Passwort“ und dem Button „Anmelden“.');

h2('2. Navigation (untere Menüleiste)');
p('Unten in der App liegt die Hauptnavigation. Sie ist der schnellste Weg zu allen Kernbereichen.');
bullet([
  'Start: Übersicht mit aktuellen Infos',
  'Plan: Stundenplan mit Tagesansicht',
  'Aufgaben: Hausaufgabenliste',
  'Tests: Test- und Arbeitstermine',
  'Mehr: Zusatzseiten wie Events, Krank, News, Flashcards',
]);
p('Der aktive Menüpunkt ist farblich hervorgehoben.');
screenshotBox('Screenshot-Platzhalter B: Untere Menüleiste', 'Komplette Leiste mit den fünf Buttons Start, Plan, Aufgaben, Tests, Mehr.');

h2('3. Startseite verstehen');
p('Die Startseite ist dein Dashboard für den Tag. Sie zeigt dir wichtige Infos in Kartenform.');
bullet([
  'Neue Ankündigungen',
  'Nächste Abgaben (Hausaufgaben)',
  'Kommende Tests',
  'Bevorstehende Events',
]);
p('Karten können farblich hervorgehoben sein, wenn etwas dringend ist. Ein Antippen bringt dich meist direkt in den passenden Bereich.');
screenshotBox('Screenshot-Platzhalter C: Startseite', 'Startseite mit mindestens einer Aufgabenkarte und einer Testkarte.');

h2('4. Stundenplan nutzen');
h3('4.1 Wochennavigation');
bullet([
  'Zurück: vorherige verfügbare Woche',
  'Heute: springt zur aktuellen Woche und zum heutigen Schultag',
  'Vor: nächste verfügbare Woche',
]);
p('Am Wochenende ist „Heute“ deaktiviert (ausgegraut), weil kein regulärer Schultag vorliegt.');

h3('4.2 Tages-Tabs');
p('Unter dem Wochenkopf findest du Montag bis Freitag als Tabs. Tippe auf einen Tag, um den Stundenplan dieses Tages zu sehen.');

h3('4.3 Indikatoren im Stundenplan');
p('Bei Fächern können kleine farbige Kreise mit „!“ erscheinen:');
bullet([
  'Gelb + !: offene Hausaufgabe für dieses Fach an diesem Datum',
  'Rot + !: anstehender Test/Arbeit für dieses Fach an diesem Datum',
]);
p('Durch Antippen öffnest du die Detailansicht. Werden Aufgaben als erledigt markiert, aktualisieren sich die Indikatoren direkt.');
screenshotBox('Screenshot-Platzhalter D: Stundenplan-Tagesansicht', 'Eine Tagesansicht mit mindestens einem gelben oder roten !-Indikator.');

h2('5. Hausaufgaben');
p('Im Bereich „Aufgaben“ werden Einträge nach Status gefiltert angezeigt.');
bullet([
  'Anstehend',
  'Erledigt',
  'Überfällig',
]);
p('Jede Karte enthält Fach, Datum und Beschreibung. Über den Haken kannst du Einträge als erledigt markieren oder wieder öffnen.');
note('Wenn du eine Aufgabe wieder öffnest, erscheint der entsprechende Indikator im Stundenplan wieder.');
screenshotBox('Screenshot-Platzhalter E: Hausaufgabenliste', 'Aufgabenbereich mit mindestens einer offenen und einer erledigten Aufgabe.');

h2('6. Tests');
p('Im Bereich „Tests“ siehst du Test- und Arbeitstermine. Diese sind zeitkritisch und oft farblich deutlicher markiert.');
bullet([
  'Anstehend: kommende Termine',
  'Vergangen: bereits abgelaufene Termine',
]);
p('Auch hier kannst du den Status mit dem Haken ändern.');
screenshotBox('Screenshot-Platzhalter F: Tests-Bereich', 'Testsseite mit einem nahen Termin, z. B. „Heute“ oder „in 1d“.');

h2('7. Ereignisse (Events)');
p('Über „Mehr → Events“ siehst du schulische Ereignisse wie Ausflüge, Ferienhinweise oder besondere Termine.');
bullet([
  'Events können ein einzelnes Datum oder einen Zeitraum haben.',
  'Vergangene Einträge bleiben als Verlauf sichtbar.',
]);
screenshotBox('Screenshot-Platzhalter G: Events-Liste', 'Events-Seite mit mindestens einem bevorstehenden Eintrag.');

h2('8. Krank / Nachholstoff');
p('Über „Mehr → Krank“ verwaltest du Nachholstoff für Fehltage.');
bullet([
  'Datum auswählen',
  'Nachhol-Einträge je Fach ansehen',
  'Anhänge prüfen, falls vorhanden',
]);
p('Dieser Bereich hilft, nach Krankheit schnell wieder den Anschluss zu finden.');
screenshotBox('Screenshot-Platzhalter H: Krank/Nachholstoff', 'Datumsansicht mit mindestens einem Nachholstoff-Eintrag.');

h2('9. Ankündigungen');
p('Über „Mehr → News“ öffnest du alle Ankündigungen.');
bullet([
  'Neue Meldungen sind optisch hervorgehoben.',
  'Beim Öffnen werden sie als gelesen markiert.',
  'Auf der Startseite gibt es ebenfalls eine Vorschau.',
]);
screenshotBox('Screenshot-Platzhalter I: Ankündigungen', 'News-Seite mit einer ungelesenen und einer gelesenen Meldung.');

h2('10. Flashcards');
p('Über „Mehr → Flashcards“ kannst du Lernkarten zu Themen öffnen und wiederholen.');
bullet([
  'Kurze Wiederholungen vor Tests',
  'Themenorientiertes Lernen',
  'Schneller Zugriff über die Mehr-Seite',
]);
screenshotBox('Screenshot-Platzhalter J: Flashcards', 'Flashcard-Übersicht oder eine geöffnete Lernkarte.');

h2('11. Einstellungen und Profil');
p('Das Zahnrad oben rechts öffnet die Einstellungen.');
bullet([
  'Profilname prüfen/ändern',
  'Profilbild setzen oder ändern',
  'Optional Light Mode aktivieren',
  'Wünsche/Probleme an Admin senden (falls freigeschaltet)',
]);
screenshotBox('Screenshot-Platzhalter K: Einstellungen', 'Einstellungsfenster mit Profilbild-Bereich und Light-Mode-Schalter.');

h2('12. Fehlerbehebung und Tipps');
p('Wenn etwas unklar ist, helfen diese häufigen Fälle:');
table([
  [
    'Eintrag fehlt im Stundenplan',
    'Aufgabe/Test ist als erledigt markiert oder hat falsches Datum/Fach',
    'Status prüfen, Datum/Fach kontrollieren und ggf. Eintrag wieder öffnen.',
  ],
  [
    'Heute-Button ist ausgegraut',
    'Wochenende (Samstag/Sonntag)',
    'Das ist normal. Nutze die Wochentasten oder Tages-Tabs Montag bis Freitag.',
  ],
  [
    'Menü reagiert verzögert',
    'Kurzzeitige Browser-Last oder schwache Verbindung',
    'Kurz warten, erneut tippen; bei Bedarf Seite neu laden.',
  ],
]);

h3('Alltagstipps');
bullet([
  'Aufgaben direkt nach Erledigung abhaken.',
  'Morgens Startseite und Stundenplan kurz checken.',
  'Flashcards in kleinen Blöcken wiederholen.',
  'Probleme über die Wunsch-/Problemfunktion melden.',
]);

doc.moveDown(0.8);
doc.font('Helvetica').fontSize(9).fillColor('#666').text('UntisProMax Benutzerhandbuch · Erstellt für Regelnutzer · April 2026');

doc.end();
console.log(`PDF_CREATED:${outPath}`);
