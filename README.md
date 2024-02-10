# HAW Hamburg: Studierendenprojekte 

Willkommen im Frontend Repository! 
Diese Anwendung wurde mit Node.js und Angular entwickelt und ermöglicht die Sammlung und Verwaltung von studentischen Projekten. 

## Inhaltsverzeichnis
- [Features](#features)
- [Technologien](#technologien)
- [Installation](#installation)
- [Verwendung](#verwendung)
- [Hinweise](#hinweise)


Hier sind die wichtigsten Funktionen und Aspekte der Anwendung:
### Features
- *Gäste*: Als Gast kannst du alle, in der zuvor konfigurierten, Datenbank gespeicherten Projekte ansehen. (Anleitung zur Konfiguration der Datenbank im [Backend Repository](https://github.com/noahjosua/ProjektB_BACKEND))
- *Benutzer ohne Admin-Rechte*: Als Benutzer ohne Admin-Rechte kannst du neue Projekte anlegen sowie eigene Projekte bearbeiten und löschen.
- *Benutzer mit Admin-Rechten*: Als Benutzer mit Admin-Rechten kannst du alles, was ein Benutzer ohne Admin-Rechte auch kann. Zusätzlich kannst du alle Projekte (nicht nur eigene) löschen sowie neue Benutzer registrieren. 

### Technologien
- Angular
- PrimeNG

### Installation
```bash
git clone https://github.com/noahjosua/ProjektB_FRONTEND
Projekt öffnen in IDE, z.B. Visual Studio Code
cd ProjektB_FRONTEND
npm install
```

### Verwendung
- Anwendung: ng serve und dann unter http://localhost:4200
- Dokumentation: compodoc -s und dann unter http://127.0.0.1:8080

*Um die Anwendung vollumfänglich zu verwenden, sollte das Backend sowie eine Datenbank installiert und kofiguriert werden.*

### Hinweise
- Die verwendeten Schriftarten sowie das Farbschema entsprechen dem Corporate Design der [Hochschule für Angewandte Wissenschaften Hamburg](https://www.haw-hamburg.de/hochschule/hochschuleinheiten/presse-und-kommunikation/corporate-design/)
- Die Dokumentation wurde mit [Compodoc](https://compodoc.app/) erzeugt


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.2.