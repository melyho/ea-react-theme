# zip-theme.ps1 — package this theme into a WordPress-uploadable .zip.
#
# Deletes the previous zip, then creates <theme>.zip in the PARENT folder
# (wp-content/themes/) with the theme nested inside it, exactly how WordPress
# expects (Appearance → Themes → Add New → Upload Theme).
#
# Dev-only files (node_modules, .git, the script itself, etc.) are left out.
#
# NOTE: the zip is built manually with FORWARD-SLASH entry paths. Windows
# PowerShell 5.1's built-in Compress-Archive writes BACKSLASH separators, which
# WordPress/PHP can't read as folders — it then wrongly reports "missing
# style.css". Building the archive by hand avoids that.
#
# Run it with:  npm run zip   (or:  powershell -ExecutionPolicy Bypass -File zip-theme.ps1)

$ErrorActionPreference = 'Stop'

$themeDir  = $PSScriptRoot
$themeName = Split-Path $themeDir -Leaf
$parent    = Split-Path $themeDir -Parent
$zipPath   = Join-Path $parent "$themeName.zip"

# Names to exclude from the package (folders or files at the theme root).
$exclude = @('node_modules', '.git', '.github', '.vscode', '.gitignore', 'zip-theme.ps1', "$themeName.zip")

# 1) Remove the old zip.
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed old $themeName.zip"
}

# 2) Stage the theme in a temp folder so we can drop the dev files. The staged
#    tree is  <staging>/<themeName>/...  so the archive root is the theme folder.
$staging = Join-Path $env:TEMP ("ea-theme-zip-" + [System.Guid]::NewGuid().ToString('N'))
$dest    = Join-Path $staging $themeName
New-Item -ItemType Directory -Path $dest -Force | Out-Null

Get-ChildItem -Path $themeDir -Force |
    Where-Object { $exclude -notcontains $_.Name } |
    ForEach-Object { Copy-Item $_.FullName -Destination $dest -Recurse -Force }

# 3) Build the zip manually with forward-slash entry names.
Add-Type -AssemblyName System.IO.Compression | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    $prefixLen = $staging.Length + 1
    Get-ChildItem -Path $staging -Recurse -File -Force | ForEach-Object {
        $rel = $_.FullName.Substring($prefixLen).Replace('\', '/')   # ea-react-theme/style.css
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
    }
} finally {
    $zip.Dispose()
}

# 4) Clean up staging.
Remove-Item $staging -Recurse -Force

$sizeKB = [math]::Round((Get-Item $zipPath).Length / 1KB)
Write-Host "Created $zipPath ($sizeKB KB)"
