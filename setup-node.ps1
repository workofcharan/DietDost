# setup-node.ps1
# This script downloads a portable Node.js LTS version and sets up the environment PATH.

$nodeDir = "C:\Users\charan\.gemini\antigravity-ide\scratch\node"
$zipPath = "C:\Users\charan\.gemini\antigravity-ide\scratch\node-v20.12.2-win-x64.zip"
$extractDir = "C:\Users\charan\.gemini\antigravity-ide\scratch\node-extracted"

if (Test-Path "$nodeDir\node.exe") {
    Write-Host "Node.js is already downloaded and extracted at $nodeDir."
} else {
    Write-Host "Downloading portable Node.js v20.12.2..."
    New-Item -ItemType Directory -Force -Path (Split-Path $zipPath) | Out-Null
    
    # Download zip file
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.12.2/node-v20.12.2-win-x64.zip" -OutFile $zipPath
    
    Write-Host "Extracting Node.js zip archive..."
    if (Test-Path $extractDir) {
        Remove-Item -Recurse -Force $extractDir
    }
    Expand-Archive -Path $zipPath -DestinationPath $extractDir
    
    # Move the extracted directory to $nodeDir
    if (Test-Path $nodeDir) {
        Remove-Item -Recurse -Force $nodeDir
    }
    Move-Item -Path "$extractDir\node-v20.12.2-win-x64" -Destination $nodeDir
    
    # Clean up
    Remove-Item -Force $zipPath
    Remove-Item -Recurse -Force $extractDir
    Write-Host "Node.js successfully set up at $nodeDir."
}

# Update the PATH in the current session
$env:Path = "$nodeDir;" + $env:Path
Write-Host "PATH updated for the current session."
node -v
npm -v
