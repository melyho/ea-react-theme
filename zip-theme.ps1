# zip-theme.ps1 — package this theme into a WordPress-uploadable .zip.
#
# Deletes the previous zip, then creates <theme>.zip in the PARENT folder
# (wp-content/themes/) with the theme nested inside it, exactly how WordPress
# expects (Appearance → Themes → Add New → Upload Theme).
#
# Dev-only files (node_modules, .git, the script itself, etc.) are left out.
#
# Run it with:  npm run zip   (or:  powershell -ExecutionPolicy Bypass -File zip-theme.ps1)

$ErrorActionPreference = 'Stop'

$themeDir  = $PSScriptRoot
$themeName = Split-Path $themeDir -Leaf
$parent    = Split-Path $themeDir -Parent
$zipPath   = Join-Path $parent "$themeName.zip"

# Names to exclude from the package (folders or files, matched at any depth).
$exclude = @('node_modules', '.git', '.github', '.vscode', '.gitignore', 'zip-theme.ps1', "$themeName.zip")

# 1) Remove the old zip.
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed old $themeName.zip"
}

# 2) Stage the theme in a temp folder so we can drop the dev files.
$staging = Join-Path $env:TEMP ("ea-theme-zip-" + [System.Guid]::NewGuid().ToString('N'))
$dest    = Join-Path $staging $themeName
New-Item -ItemType Directory -Path $dest -Force | Out-Null

Get-ChildItem -Path $themeDir -Force |
    Where-Object { $exclude -notcontains $_.Name } |
    ForEach-Object { Copy-Item $_.FullName -Destination $dest -Recurse -Force }

# 3) Compress the staged folder (archive root = the theme folder).
Compress-Archive -Path $dest -DestinationPath $zipPath -Force

# 4) Clean up.
Remove-Item $staging -Recurse -Force

$sizeKB = [math]::Round((Get-Item $zipPath).Length / 1KB)
Write-Host "Created $zipPath ($sizeKB KB)"
