# Handleiding: "Failed to read file" Fout Oplossen

## Stap 1: Identificeer het Probleem

### A. Run het diagnostisch script:
```powershell
cd "C:\Users\kgoga\Desktop\Groothandel Banden"
.\diagnose-file-errors.ps1
```

Dit script toont:
- Welk bestand het probleem veroorzaakt (volledig pad)
- Of het bestand bestaat
- Of je leesrechten hebt
- OneDrive sync status
- File locks

### B. Als Cursor een specifieke fout toont:
**Kopieer de volledige foutmelding** - deze bevat meestal het exacte bestandspad.

Voorbeeld foutmelding:
```
Tool call error: Failed to read file.
Path: C:\Users\kgoga\Desktop\Groothandel Banden\app\layout.tsx
```

## Stap 2: Check Bestandspad

### Volledig Workspace Pad:
```
C:\Users\kgoga\Desktop\Groothandel Banden
```

### Belangrijke bestanden die gecontroleerd moeten worden:
- `C:\Users\kgoga\Desktop\Groothandel Banden\package.json`
- `C:\Users\kgoga\Desktop\Groothandel Banden\tsconfig.json`
- `C:\Users\kgoga\Desktop\Groothandel Banden\.env`
- `C:\Users\kgoga\Desktop\Groothandel Banden\prisma\schema.prisma`

## Stap 3: Oplossingen per Probleemtype

### Probleem A: Bestand bestaat niet

**Symptoom:** Foutmelding zegt dat bestand niet bestaat

**Oplossing:**
1. Check of je in de juiste workspace bent:
   ```powershell
   cd "C:\Users\kgoga\Desktop\Groothandel Banden"
   Get-Location
   ```

2. Als het pad niet klopt:
   - Open Cursor
   - File → Open Folder
   - Selecteer: `C:\Users\kgoga\Desktop\Groothandel Banden`
   - Herstart Cursor

### Probleem B: Geen leesrechten

**Symptoom:** Bestand bestaat maar kan niet gelezen worden

**Oplossing:**
```powershell
# Geef jezelf volledige rechten op de folder
cd "C:\Users\kgoga\Desktop\Groothandel Banden"
icacls . /grant "${env:USERNAME}:(OI)(CI)F" /T
```

Of via Windows:
1. Rechtsklik op de folder → Properties
2. Tab "Security"
3. Klik "Edit"
4. Selecteer je gebruiker
5. Vink "Full control" aan
6. Klik "Apply" → "OK"

### Probleem C: OneDrive Sync Probleem

**Symptoom:** Bestanden zijn "Alleen online" in OneDrive

**Oplossing:**
1. Open OneDrive systeemvak (rechtsonder)
2. Rechtsklik → Settings
3. Tab "Files On-Demand"
4. Rechtsklik op de folder in File Explorer
5. Selecteer "Always keep on this device"

Of:
```powershell
# Download alle bestanden lokaal
cd "C:\Users\kgoga\Desktop\Groothandel Banden"
Get-ChildItem -Recurse | ForEach-Object {
    if ($_.Attributes -match "ReparsePoint") {
        # Bestand is alleen online, download het
        $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    }
}
```

### Probleem D: Controlled Folder Access (Windows Security)

**Symptoom:** Windows blokkeert toegang tot bestanden

**Oplossing:**
1. Open **Windows Security** (Windows + I → Update & Security → Windows Security)
2. Klik op **Virus & threat protection**
3. Scroll naar **Ransomware protection**
4. Klik op **Manage ransomware protection**
5. Klik op **Allow an app through Controlled folder access**
6. Klik **Add an allowed app** → **Recently blocked apps**
7. Zoek **Cursor** en voeg toe
8. Herstart Cursor

Of via PowerShell (als Admin):
```powershell
# Voeg Cursor toe aan toegestane apps
Add-MpPreference -ControlledFolderAccessAllowedApplications "C:\Users\kgoga\AppData\Local\Programs\cursor\Cursor.exe"
```

### Probleem E: Antivirus blokkeert toegang

**Symptoom:** Antivirus software blokkeert Cursor

**Oplossing:**
1. Open je antivirus software
2. Voeg Cursor toe aan uitzonderingen/whitelist
3. Voeg de workspace folder toe aan uitzonderingen:
   ```
   C:\Users\kgoga\Desktop\Groothandel Banden
   ```

### Probleem F: Bestand is gelocked door ander proces

**Symptoom:** Bestand wordt gebruikt door ander programma

**Oplossing:**
```powershell
# Vind welk proces het bestand gebruikt
cd "C:\Users\kgoga\Desktop\Groothandel Banden"
$file = "app\layout.tsx"  # Vervang met het probleembestand
$processes = Get-Process | Where-Object {
    $_.Path -like "*$file*"
}
$processes | Select-Object Name, Id, Path

# Sluit het proces als nodig
# Stop-Process -Id <ProcessId> -Force
```

Of gebruik Process Explorer (download van Microsoft Sysinternals)

## Stap 4: npm install Uitvoeren

**BELANGRIJK:** Voer deze commando's uit in de juiste folder!

### Exacte Terminal Commando's:

```powershell
# Stap 1: Navigeer naar de workspace
cd "C:\Users\kgoga\Desktop\Groothandel Banden"

# Stap 2: Verifieer dat je in de juiste folder bent
Get-Location
# Moet tonen: C:\Users\kgoga\Desktop\Groothandel Banden

# Stap 3: Check of package.json bestaat
Test-Path "package.json"
# Moet tonen: True

# Stap 4: Verwijder oude node_modules (optioneel, als er problemen zijn)
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

# Stap 5: Verwijder package-lock.json (optioneel, voor schone install)
# Remove-Item -Force "package-lock.json"

# Stap 6: Run npm install
npm install

# Stap 7: Genereer Prisma client
npm run db:generate
```

### Als npm install faalt:

```powershell
# Check Node.js versie
node --version
# Moet minimaal v18 zijn

# Check npm versie
npm --version

# Clear npm cache
npm cache clean --force

# Probeer opnieuw
npm install
```

### Als je permission errors krijgt:

```powershell
# Run PowerShell als Administrator
# Rechtsklik op PowerShell → Run as Administrator

# Dan:
cd "C:\Users\kgoga\Desktop\Groothandel Banden"
npm install
```

## Stap 5: Verifieer Oplossing

```powershell
cd "C:\Users\kgoga\Desktop\Groothandel Banden"

# Check of alles werkt
npm run dev
```

Als de dev server start zonder errors, is het probleem opgelost!

## Snelle Checklist

- [ ] Workspace pad is correct: `C:\Users\kgoga\Desktop\Groothandel Banden`
- [ ] Bestand bestaat (check met `Test-Path`)
- [ ] Je hebt leesrechten (check met `Get-Acl`)
- [ ] OneDrive bestanden zijn lokaal gedownload
- [ ] Controlled Folder Access staat Cursor toe
- [ ] Antivirus blokkeert niet
- [ ] Geen andere processen gebruiken het bestand
- [ ] `npm install` is succesvol uitgevoerd

## Hulp Nodig?

Als het probleem blijft bestaan:
1. Run `.\diagnose-file-errors.ps1` opnieuw
2. Kopieer de volledige foutmelding van Cursor
3. Noteer het exacte bestandspad dat faalt
4. Check Windows Event Viewer voor meer details

