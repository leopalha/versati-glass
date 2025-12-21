# Script para gerar mapeamento TypeScript de todas as imagens

$baseDir = "public\images\products"
$output = @()

$output += "// AUTO-GENERATED IMAGE MAPPINGS"
$output += "// Generated: $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
$output += ""

# Função para gerar entries
function Generate-ImageEntries {
    param($folder, $categoryName)

    $images = Get-ChildItem "$baseDir\$folder" -File -Include *.jpg,*.png,*.webp,*.jpeg -ErrorAction SilentlyContinue

    if ($images.Count -eq 0) { return }

    $output = @()
    $count = 1

    foreach ($img in $images) {
        $name = $img.BaseName
        $ext = $img.Extension
        $id = "$folder-$count"
        $alt = ($name -replace '-', ' ') -replace '^\w', {$_.Value.ToUpper()}

        $entry = @"
  {
    id: '$id',
    url: '/images/products/$folder/$($img.Name)',
    alt: '$alt',
    category: '$categoryName',
    description: 'Referência de $alt',
  },
"@
        $output += $entry
        $count++
    }

    return $output -join "`n"
}

# Mapeamento de pastas para categorias
$mappings = @{
    'box' = 'BOX'
    'espelhos' = 'ESPELHOS'
    'vidros' = 'VIDROS'
    'portas' = 'PORTAS'
    'janelas' = 'JANELAS'
    'guarda-corpo' = 'GUARDA_CORPO'
    'cortinas-vidro' = 'CORTINAS_VIDRO'
    'divisorias' = 'DIVISORIAS'
    'pergolados' = 'PERGOLADOS'
    'tampos' = 'TAMPOS_PRATELEIRAS'
    'fechamentos' = 'FECHAMENTOS'
    'kits' = 'KITS'
    'servicos' = 'SERVICOS'
    'ferragens' = 'FERRAGENS'
    'fachadas' = 'FACHADAS'
    'peliculas' = 'PELICULAS'
}

foreach ($folder in $mappings.Keys | Sort-Object) {
    $category = $mappings[$folder]
    $constantName = "$($category)_IMAGES_AUTO"

    $output += "// $category ($folder/)"
    $output += "export const $constantName = ["
    $output += (Generate-ImageEntries -folder $folder -categoryName $category)
    $output += "]"
    $output += ""
}

# Salvar
$output | Out-File -FilePath "image-mappings-auto.ts" -Encoding UTF8

Write-Host "Mapeamento gerado em: image-mappings-auto.ts" -ForegroundColor Green
Write-Host "Total de categorias: $($mappings.Count)" -ForegroundColor Cyan

# Contar total de imagens
$total = 0
foreach ($folder in $mappings.Keys) {
    $count = (Get-ChildItem "$baseDir\$folder" -File -Include *.jpg,*.png,*.webp,*.jpeg -ErrorAction SilentlyContinue).Count
    if ($count -gt 0) {
        Write-Host "  $folder : $count imagens" -ForegroundColor White
        $total += $count
    }
}

Write-Host ""
Write-Host "TOTAL: $total imagens mapeadas" -ForegroundColor Green
