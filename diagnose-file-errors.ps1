# Diagnostisch script voor "Failed to read file" fouten
# Run dit script om te identificeren welk bestand problemen veroorzaakt

Write-Host "=== DIAGNOSE: Failed to read file ===" -ForegroundColor Cyan
Write-Host ""

$workspacePath = "C:\Users\kgoga\Desktop\Groothandel Banden"
Write-Host "Workspace pad: $workspacePath" -ForegroundColor Yellow
Write-Host ""

# Check 1: Workspace bestaat
Write-Host "[1] Controleren of workspace bestaat..." -ForegroundColor Green
if (Test-Path $workspacePath) {
    Write-Host "   OK Workspace bestaat" -ForegroundColor Green
} else {
    Write-Host "   ERROR Workspace bestaat NIET!" -ForegroundColor Red
    Write-Host "   Open Cursor en selecteer de folder: $workspacePath" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Check 2: Belangrijke bestanden
Write-Host "[2] Controleren belangrijke bestanden..." -ForegroundColor Green
$criticalFiles = @(
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "prisma\schema.prisma",
    ".env"
)

foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $workspacePath $file
    if (Test-Path $fullPath) {
        try {
            $null = Get-Content $fullPath -ErrorAction Stop
            Write-Host "   OK $file (leesbaar)" -ForegroundColor Green
            Write-Host "      Pad: $fullPath" -ForegroundColor Gray
        } catch {
            Write-Host "   ERROR $file (NIET leesbaar!)" -ForegroundColor Red
            Write-Host "      Fout: $_" -ForegroundColor Red
            Write-Host "      Volledig pad: $fullPath" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ERROR $file (bestaat niet!)" -ForegroundColor Red
        Write-Host "      Volledig pad: $fullPath" -ForegroundColor Yellow
    }
}
Write-Host ""

# Check 3: Rechten
Write-Host "[3] Controleren bestandsrechten..." -ForegroundColor Green
try {
    $acl = Get-Acl $workspacePath
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    Write-Host "   Huidige gebruiker: $currentUser" -ForegroundColor Cyan
    Write-Host "   Eigenaar: $($acl.Owner)" -ForegroundColor Cyan
    
    $hasAccess = $false
    foreach ($access in $acl.Access) {
        if ($access.IdentityReference -eq $currentUser -or $access.IdentityReference -like "*$env:USERNAME*") {
            if ($access.FileSystemRights -match "Read|FullControl") {
                $hasAccess = $true
                Write-Host "   OK Je hebt leesrechten" -ForegroundColor Green
                break
            }
        }
    }
    
    if (-not $hasAccess) {
        Write-Host "   ERROR Geen leesrechten gevonden!" -ForegroundColor Red
    }
} catch {
    Write-Host "   ERROR Fout bij controleren rechten: $_" -ForegroundColor Red
}
Write-Host ""

# Check 4: OneDrive sync status
Write-Host "[4] Controleren OneDrive sync status..." -ForegroundColor Green
$onedrivePath = "$env:USERPROFILE\OneDrive"
if (Test-Path $onedrivePath) {
    $desktopPath = "$env:USERPROFILE\Desktop"
    if ($workspacePath -like "$desktopPath*") {
        Write-Host "   WAARSCHUWING Workspace staat in Desktop (mogelijk OneDrive gesynct)" -ForegroundColor Yellow
        Write-Host "   Check of bestanden 'Alleen online' zijn in OneDrive" -ForegroundColor Yellow
    }
}
Write-Host ""

# Check 5: Controlled Folder Access
Write-Host "[5] Controleren Controlled Folder Access..." -ForegroundColor Green
Write-Host "   Als je Controlled Folder Access hebt ingeschakeld:" -ForegroundColor Yellow
Write-Host "   1. Open Windows Security" -ForegroundColor Yellow
Write-Host "   2. Ga naar Virus and threat protection" -ForegroundColor Yellow
Write-Host "   3. Klik op Manage ransomware protection" -ForegroundColor Yellow
Write-Host "   4. Voeg Cursor toe aan toegestane apps" -ForegroundColor Yellow
Write-Host ""

# Check 6: Node modules
Write-Host "[6] Controleren node_modules..." -ForegroundColor Green
$nodeModulesPath = Join-Path $workspacePath "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "   OK node_modules bestaat" -ForegroundColor Green
    $count = (Get-ChildItem $nodeModulesPath -Directory -ErrorAction SilentlyContinue).Count
    Write-Host "   Aantal packages: $count" -ForegroundColor Cyan
} else {
    Write-Host "   WAARSCHUWING node_modules bestaat niet - run npm install" -ForegroundColor Yellow
}
Write-Host ""

# Check 7: Locks/processes
Write-Host "[7] Controleren op file locks..." -ForegroundColor Green
$lockedFiles = @()
try {
    $files = Get-ChildItem $workspacePath -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*node_modules*" } | Select-Object -First 10
    foreach ($file in $files) {
        try {
            $stream = [System.IO.File]::Open($file.FullName, 'Open', 'Read', 'None')
            $stream.Close()
        } catch {
            $lockedFiles += $file.FullName
            Write-Host "   ERROR Bestand is gelocked: $($file.Name)" -ForegroundColor Red
        }
    }
    if ($lockedFiles.Count -eq 0) {
        Write-Host "   OK Geen gelockte bestanden gevonden" -ForegroundColor Green
    }
} catch {
    Write-Host "   WAARSCHUWING Kon niet alle bestanden controleren" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== EINDE DIAGNOSE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Als er fouten zijn gevonden, zie FIX-FILE-ERRORS.md voor oplossingen" -ForegroundColor Yellow
Write-Host ""
