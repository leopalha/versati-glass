# Gerar mapeamento completo de todas as imagens
$baseDir = "public\images\products"

function Get-ImageEntries {
    param($folder, $categoryName)

    $path = Join-Path $baseDir $folder
    $files = Get-ChildItem $path -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp)$' }

    if (!$files -or $files.Count -eq 0) {
        return ""
    }

    $entries = @()
    $count = 1

    foreach ($file in $files) {
        $name = $file.BaseName -replace '-', ' '
        $name = $name.Substring(0,1).ToUpper() + $name.Substring(1)

        $entry = @"
  {
    id: '$folder-$count',
    url: '/images/products/$folder/$($file.Name)',
    alt: '$name',
    category: '$categoryName',
    description: 'Referência de $name',
  },
"@

        $entries += $entry
        $count++
    }

    return $entries -join "`n"
}

$output = @()
$output += "// AUTO-GENERATED - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
$output += "// Total: 145 imagens"
$output += ""

# BOX
$boxCount = (Get-ChildItem "$baseDir\box" -File).Count
$output += "// BOX - $boxCount imagens"
$output += "export const BOX_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "box" -categoryName "BOX"
$output += "]"
$output += ""

# ESPELHOS
$espCount = (Get-ChildItem "$baseDir\espelhos" -File).Count
$output += "// ESPELHOS - $espCount imagens"
$output += "export const MIRROR_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "espelhos" -categoryName "ESPELHOS"
$output += "]"
$output += ""

# VIDROS
$vidCount = (Get-ChildItem "$baseDir\vidros" -File).Count
$output += "// VIDROS - $vidCount imagens"
$output += "export const GLASS_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "vidros" -categoryName "VIDROS"
$output += "]"
$output += ""

# PORTAS
$porCount = (Get-ChildItem "$baseDir\portas" -File).Count
$output += "// PORTAS - $porCount imagens"
$output += "export const DOOR_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "portas" -categoryName "PORTAS"
$output += "]"
$output += ""

# JANELAS
$janCount = (Get-ChildItem "$baseDir\janelas" -File).Count
$output += "// JANELAS - $janCount imagens"
$output += "export const WINDOW_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "janelas" -categoryName "JANELAS"
$output += "]"
$output += ""

# GUARDA_CORPO
$guaCount = (Get-ChildItem "$baseDir\guarda-corpo" -File).Count
$output += "// GUARDA_CORPO - $guaCount imagens"
$output += "export const GUARD_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "guarda-corpo" -categoryName "GUARDA_CORPO"
$output += "]"
$output += ""

# CORTINAS_VIDRO
$corCount = (Get-ChildItem "$baseDir\cortinas-vidro" -File).Count
$output += "// CORTINAS_VIDRO - $corCount imagens"
$output += "export const CURTAIN_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "cortinas-vidro" -categoryName "CORTINAS_VIDRO"
$output += "]"
$output += ""

# DIVISORIAS
$divCount = (Get-ChildItem "$baseDir\divisorias" -File).Count
$output += "// DIVISORIAS - $divCount imagens"
$output += "export const PARTITION_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "divisorias" -categoryName "DIVISORIAS"
$output += "]"
$output += ""

# PERGOLADOS
$perCount = (Get-ChildItem "$baseDir\pergolados" -File).Count
$output += "// PERGOLADOS - $perCount imagens"
$output += "export const PERGOLA_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "pergolados" -categoryName "PERGOLADOS"
$output += "]"
$output += ""

# TAMPOS
$tamCount = (Get-ChildItem "$baseDir\tampos" -File).Count
$output += "// TAMPOS_PRATELEIRAS - $tamCount imagens"
$output += "export const SHELF_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "tampos" -categoryName "TAMPOS_PRATELEIRAS"
$output += "]"
$output += ""

# FECHAMENTOS
$fecCount = (Get-ChildItem "$baseDir\fechamentos" -File).Count
$output += "// FECHAMENTOS - $fecCount imagens"
$output += "export const CLOSURE_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "fechamentos" -categoryName "FECHAMENTOS"
$output += "]"
$output += ""

# KITS
$kitCount = (Get-ChildItem "$baseDir\kits" -File).Count
$output += "// KITS - $kitCount imagens"
$output += "export const KIT_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "kits" -categoryName "KITS"
$output += "]"
$output += ""

# SERVICOS
$serCount = (Get-ChildItem "$baseDir\servicos" -File).Count
$output += "// SERVICOS - $serCount imagens"
$output += "export const SERVICE_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "servicos" -categoryName "SERVICOS"
$output += "]"
$output += ""

# FERRAGENS
$ferCount = (Get-ChildItem "$baseDir\ferragens" -File).Count
$output += "// FERRAGENS - $ferCount imagens"
$output += "export const HARDWARE_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "ferragens" -categoryName "FERRAGENS"
$output += "]"
$output += ""

# FACHADAS
$facCount = (Get-ChildItem "$baseDir\fachadas" -File).Count
$output += "// FACHADAS - $facCount imagens"
$output += "export const FACADE_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "fachadas" -categoryName "FACHADAS"
$output += "]"
$output += ""

# PELICULAS
$pelCount = (Get-ChildItem "$baseDir\peliculas" -File).Count
$output += "// PELICULAS - $pelCount imagem"
$output += "export const FILM_IMAGES_COMPLETE: ProductImage[] = ["
$output += Get-ImageEntries -folder "peliculas" -categoryName "PELICULAS"
$output += "]"

# Salvar
$output | Out-File -FilePath "image-mappings-generated.ts" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MAPEAMENTO GERADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivo: image-mappings-generated.ts" -ForegroundColor Yellow
Write-Host ""
Write-Host "Categorias processadas:" -ForegroundColor Cyan
Write-Host "  BOX: $boxCount imagens" -ForegroundColor White
Write-Host "  ESPELHOS: $espCount imagens" -ForegroundColor White
Write-Host "  VIDROS: $vidCount imagens" -ForegroundColor White
Write-Host "  PORTAS: $porCount imagens" -ForegroundColor White
Write-Host "  JANELAS: $janCount imagens" -ForegroundColor White
Write-Host "  GUARDA_CORPO: $guaCount imagens" -ForegroundColor White
Write-Host "  CORTINAS_VIDRO: $corCount imagens" -ForegroundColor White
Write-Host "  DIVISORIAS: $divCount imagens" -ForegroundColor White
Write-Host "  PERGOLADOS: $perCount imagens" -ForegroundColor White
Write-Host "  TAMPOS: $tamCount imagens" -ForegroundColor White
Write-Host "  FECHAMENTOS: $fecCount imagens" -ForegroundColor White
Write-Host "  KITS: $kitCount imagens" -ForegroundColor White
Write-Host "  SERVICOS: $serCount imagens" -ForegroundColor White
Write-Host "  FERRAGENS: $ferCount imagens" -ForegroundColor White
Write-Host "  FACHADAS: $facCount imagens" -ForegroundColor White
Write-Host "  PELICULAS: $pelCount imagem" -ForegroundColor White
Write-Host ""
$total = $boxCount + $espCount + $vidCount + $porCount + $janCount + $guaCount + $corCount + $divCount + $perCount + $tamCount + $fecCount + $kitCount + $serCount + $ferCount + $facCount + $pelCount
Write-Host "TOTAL: $total imagens" -ForegroundColor Green
Write-Host ""
