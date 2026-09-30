$MiktexBin = "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64"
if (Test-Path $MiktexBin) {
    $env:Path = "$MiktexBin;$env:Path"
} else {
    Write-Error "MiKTeX introuvable dans $MiktexBin"
    exit 1
}

Set-Location $PSScriptRoot
if (Get-Command node -ErrorAction SilentlyContinue) {
    bash ./scripts/render-mermaid.sh
}
latexmk -pdf -interaction=nonstopmode main.tex
