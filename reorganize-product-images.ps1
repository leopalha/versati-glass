# Script para reorganizar imagens de produtos
$ErrorActionPreference = "Stop"

Write-Host "=== REORGANIZACAO DE IMAGENS ===" -ForegroundColor Cyan

$baseDir = "public\images\products"

# Criar subpastas
$folders = @('vidros', 'portas', 'kits', 'servicos', 'ferragens')

foreach ($folder in $folders) {
    $path = Join-Path $baseDir $folder
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Criada pasta: $folder" -ForegroundColor Green
    }
}

Write-Host "Movendo imagens..." -ForegroundColor Yellow

# VIDROS
$vidroFiles = @('vidro-acidato.jpg', 'vidro-extra-clear.jpg', 'vidro-jateado.jpg', 'vidro-laminado-8mm.jpg', 'vidro-laminado-temperado.jpg', 'vidro-reflectivo.jpg', 'vidro-serigrafado.jpg', 'vidro-temperado-10mm.jpg', 'vidro-temperado-8mm.jpg')

foreach ($file in $vidroFiles) {
    $source = Join-Path $baseDir $file
    $dest = Join-Path $baseDir "vidros\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "  vidros/$file" -ForegroundColor DarkGray
    }
}

# PORTAS
$portaFiles = @('porta-abrir.jpg', 'porta-abrir-inteirica.jpg', 'porta-automatica.jpg', 'porta-camarao.jpg', 'porta-correr.jpg', 'porta-pivotante.jpg', 'porta-pivotante-premium.jpg')

foreach ($file in $portaFiles) {
    $source = Join-Path $baseDir $file
    $dest = Join-Path $baseDir "portas\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "  portas/$file" -ForegroundColor DarkGray
    }
}

# KITS
$kitFiles = @('kit-basculante.jpg', 'kit-box-elegance.jpg', 'kit-box-frontal.jpg', 'kit-elegance.jpg', 'kit-pivotante.jpg', 'kit-porta-pivotante.jpg')

foreach ($file in $kitFiles) {
    $source = Join-Path $baseDir $file
    $dest = Join-Path $baseDir "kits\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "  kits/$file" -ForegroundColor DarkGray
    }
}

# SERVICOS
$servicoFiles = @('emergencia.jpg', 'instalacao.jpg', 'manutencao-corretiva.jpg', 'manutencao-preventiva.jpg', 'medicao-tecnica.jpg', 'troca-vidro.jpg')

foreach ($file in $servicoFiles) {
    $source = Join-Path $baseDir $file
    $dest = Join-Path $baseDir "servicos\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "  servicos/$file" -ForegroundColor DarkGray
    }
}

# FERRAGENS
$ferragemFiles = @('mola-piso.jpg', 'puxador-tubular.jpg')

foreach ($file in $ferragemFiles) {
    $source = Join-Path $baseDir $file
    $dest = Join-Path $baseDir "ferragens\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "  ferragens/$file" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Concluido!" -ForegroundColor Green
Write-Host ""

# Mostrar estrutura
Get-ChildItem $baseDir -Directory | ForEach-Object {
    $count = (Get-ChildItem $_.FullName -File -ErrorAction SilentlyContinue).Count
    Write-Host "  $($_.Name): $count imagens" -ForegroundColor White
}
