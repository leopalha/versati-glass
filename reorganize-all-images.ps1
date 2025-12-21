# Script completo - Reorganizar TODAS as imagens de produtos
$ErrorActionPreference = "Stop"

Write-Host "=== REORGANIZACAO COMPLETA ===" -ForegroundColor Cyan

$baseDir = "public\images\products"

# BOX - mover para box/
$boxFiles = @('box-articulado-2.jpg', 'box-articulado-2-folhas.jpg', 'box-articulado-4.jpg', 'box-banheira.jpg', 'box-canto.jpg', 'box-canto-inox.jpg', 'box-canto-l.jpg', 'box-cristal.jpg', 'box-cristal-dobradicas.jpg', 'box-de-abrir.jpg', 'box-elegance.jpg', 'box-elegance-premium.jpg', 'box-frontal-2-folhas.jpg', 'box-frontal-4-folhas.jpg', 'box-frontal-duplo.jpg', 'box-frontal-simples.jpg', 'box-incolor.jpg', 'box-para-banheira.jpg', 'box-pivotante.jpg', 'box-premium.jpg', 'box-walk-in.jpg')

foreach ($file in $boxFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "box\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  box/$file" -ForegroundColor DarkGray
    }
}

# ESPELHOS - mover para espelhos/
$espelhoFiles = @('espelho-bisotado.jpg', 'espelho-bronze.jpg', 'espelho-camarim.jpg', 'espelho-fume.jpg', 'espelho-guardian-4mm.jpg', 'espelho-guardian-6mm.jpg', 'espelho-jateado.jpg', 'espelho-led.jpg', 'espelho-veneziano.jpg')

foreach ($file in $espelhoFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "espelhos\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  espelhos/$file" -ForegroundColor DarkGray
    }
}

# JANELAS - mover para janelas/
$janelaFiles = @('janela.jpg', 'janela-basculante.jpg', 'janela-correr.jpg', 'janela-guilhotina.jpg', 'janela-maxim-ar.jpg', 'janela-pivotante.jpg')

foreach ($file in $janelaFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "janelas\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  janelas/$file" -ForegroundColor DarkGray
    }
}

# GUARDA_CORPO - mover para guarda-corpo/
$guardaFiles = @('guarda-corpo.jpg', 'guarda-corpo-autoportante.jpg', 'guarda-corpo-autoportante-inox.jpg', 'guarda-corpo-bottons.jpg', 'guarda-corpo-inox.jpg', 'guarda-corpo-spider.jpg', 'guarda-corpo-torres.jpg', 'gradil-inox.jpg')

foreach ($file in $guardaFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "guarda-corpo\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  guarda-corpo/$file" -ForegroundColor DarkGray
    }
}

# CORTINAS_VIDRO - mover para cortinas-vidro/
$cortinaFiles = @('cortina-automatizada.jpg', 'cortina-europeu.jpg', 'cortina-europeu-premium.jpg', 'cortina-stanley.jpg', 'cortina-vidro-automatizada.jpg', 'cortina-vidro-europeu.jpg', 'cortina-vidro-premium.jpg', 'cortina-vidro-stanley.jpg')

foreach ($file in $cortinaFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "cortinas-vidro\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  cortinas-vidro/$file" -ForegroundColor DarkGray
    }
}

# DIVISORIAS - mover para divisorias/
$divisoriaFiles = @('divisoria.jpg', 'divisoria-acustica.jpg', 'divisoria-ambiente.jpg', 'divisoria-escritorio.jpg', 'divisoria-porta.jpg', 'painel-decorativo.jpg')

foreach ($file in $divisoriaFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "divisorias\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  divisorias/$file" -ForegroundColor DarkGray
    }
}

# PERGOLADOS - mover para pergolados/
$pergoladoFiles = @('pergolado-aco-inox.jpg', 'pergolado-aluminio.jpg', 'pergolado-inox.jpg', 'cobertura-controle-solar.jpg', 'cobertura-laminado.jpg', 'cobertura-vidro-laminado.jpg')

foreach ($file in $pergoladoFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "pergolados\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  pergolados/$file" -ForegroundColor DarkGray
    }
}

# TAMPOS - mover para tampos/
$tampoFiles = @('tampo.jpg', 'tampo-extra-clear.jpg', 'tampo-mesa.jpg', 'prateleira.jpg')

foreach ($file in $tampoFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "tampos\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  tampos/$file" -ForegroundColor DarkGray
    }
}

# FECHAMENTOS - mover para fechamentos/
$fechamentoFiles = @('fechamento-area-gourmet.jpg', 'fechamento-area-servico.jpg', 'fechamento-gourmet.jpg', 'fechamento-piscina.jpg', 'fechamento-sacada.jpg', 'fechamento-servico.jpg')

foreach ($file in $fechamentoFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "fechamentos\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  fechamentos/$file" -ForegroundColor DarkGray
    }
}

# FACHADAS - mover para fachadas/
$fachadaFiles = @('fachada.jpg')

foreach ($file in $fachadaFiles) {
    $src = Join-Path $baseDir $file
    $dst = Join-Path $baseDir "fachadas\$file"
    if (Test-Path $src) {
        Move-Item $src $dst -Force
        Write-Host "  fachadas/$file" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Concluido!" -ForegroundColor Green
Write-Host ""

# Estatisticas finais
$total = 0
Get-ChildItem $baseDir -Directory | Where-Object { $_.Name -ne 'thumbs' } | ForEach-Object {
    $count = (Get-ChildItem $_.FullName -File -ErrorAction SilentlyContinue).Count
    Write-Host "  $($_.Name): $count imagens" -ForegroundColor White
    $total += $count
}

Write-Host ""
Write-Host "TOTAL: $total imagens organizadas" -ForegroundColor Green
