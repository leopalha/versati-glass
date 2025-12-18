import fs from 'fs';
import path from 'path';

// Mapeamento: Imagem disponível -> Nome do arquivo de destino para o produto
const imageMapping = {
  // BOX
  'Box Comum (Abrir Tradicional).png': 'box-abrir-thumb.png',
  'Box de Canto 1.png': 'box-canto-l-thumb.png',
  'BOX DE CANTO.png': 'box-canto-inox-thumb.png',
  'BOX DE VIDRO PREMIUM.png': 'box-premium-inox-thumb.png',
  'Box Elegance (Flagship).png': 'box-elegance-thumb.png',
  'Box Frontal 2 Folhas.png': 'box-frontal-duplo-thumb.png',
  'Box Frontal 4 Folhas.png': 'box-articulado-4-thumb.png',
  'BOX INCOLOR PADRÃO.png': 'box-frontal-simples-thumb.png',
  'Box Premium Plus (Variação).png': 'box-walk-in-thumb.png',
  
  // DIVISORIAS
  'DIVISÓRIA PARA ESCRITÓRIO.png': 'divisoria-escritorio-thumb.png',
  
  // ESPELHOS
  'ESPELHO BISOTADO.png': 'espelho-bisotado-thumb.png',
  'Espelho Bronze.png': 'espelho-bronze-thumb.png',
  'ESPELHO COM LED INTEGRADO.png': 'espelho-led-thumb.png',
  'Espelho com LED.png': 'espelho-camarim-thumb.png', // Alternativo para Camarim
  'Espelho Fumê.png': 'espelho-fume-thumb.png',
  'Espelho Guardian 4mm.png': 'espelho-lapidado-thumb.png',
  'Espelho Guardian 6mm.png': 'espelho-jateado-thumb.png',
  
  // FACHADA/FECHAMENTO
  'FACHADA DE VIDRO COMERCIAL.png': 'fechamento-sacada-thumb.png',
  
  // GUARDA-CORPO
  'GUARDA-CORPO DE VIDRO.png': 'guarda-corpo-autoportante-thumb.png',
  'GUARDA-CORPO MISTO.png': 'guarda-corpo-torres-thumb.png',
  
  // JANELA
  'JANELA MAXIM-AR DE VIDRO.png': 'janela-maxim-ar-thumb.png',
  
  // PORTA
  'PORTA DE VIDRO DE CORRER.png': 'porta-correr-thumb.png',
  
  // TAMPO
  'TAMPO DE VIDRO PARA MESA.png': 'tampo-mesa-thumb.png',
  
  // VIDROS
  'Vidro Laminado 8mm.png': 'vidro-laminado-8mm-thumb.png',
  'Vidro Temperado 10mm.png': 'vidro-temperado-10mm-thumb.png',
  'Vidro Temperado 8mm.png': 'vidro-temperado-8mm-thumb.png',
};

const srcDir = 'imagens';
const destDir = 'public/products';

// Garantir que o diretório destino existe
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let copied = 0;
let errors = 0;

for (const [src, dest] of Object.entries(imageMapping)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log('✅ Copiado: ' + src + ' -> ' + dest);
      copied++;
    } else {
      console.log('❌ Não encontrado: ' + src);
      errors++;
    }
  } catch (e) {
    console.log('❌ Erro ao copiar ' + src + ': ' + e.message);
    errors++;
  }
}

console.log('\n=== RESUMO ===');
console.log('Copiadas: ' + copied + ' imagens');
console.log('Erros: ' + errors);
