# Script para mapear imagens faltantes no sistema de orçamentos
Write-Host "=== MAPEAMENTO DE IMAGENS FALTANTES ===" -ForegroundColor Cyan
Write-Host ""

# Listar todas as imagens que EXISTEM
Write-Host "Imagens EXISTENTES em public/images:" -ForegroundColor Green
$existingImages = Get-ChildItem -Path "public\images" -Recurse -Include *.jpg,*.png,*.webp,*.jpeg -File
$existingImages | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\public\", "")
    Write-Host "  ✓ /$relativePath" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Total de imagens existentes: $($existingImages.Count)" -ForegroundColor Yellow
Write-Host ""

# Criar relatório em arquivo
$report = @"
# RELATÓRIO DE IMAGENS - SISTEMA DE ORÇAMENTOS
Data: $(Get-Date -Format "dd/MM/yyyy HH:mm")

## IMAGENS EXISTENTES ($($existingImages.Count) arquivos)

"@

$existingImages | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\public\", "")
    $report += "- /$relativePath`n"
}

$report | Out-File -FilePath "RELATORIO_IMAGENS_EXISTENTES.md" -Encoding UTF8

Write-Host "✅ Relatório salvo em: RELATORIO_IMAGENS_EXISTENTES.md" -ForegroundColor Green
