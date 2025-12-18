import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Mapeamento de slug do produto para arquivo de imagem disponível
const productImageMap = {
  // BOX (9 de 13)
  'box-de-abrir': '/products/box-abrir-thumb.png',
  'box-canto-l': '/products/box-canto-l-thumb.png',
  'box-canto-inox': '/products/box-canto-inox-thumb.png',
  'box-premium-inox': '/products/box-premium-inox-thumb.png',
  'box-elegance-roldana-aparente': '/products/box-elegance-thumb.png',
  'box-frontal-duplo': '/products/box-frontal-duplo-thumb.png',
  'box-articulado-4-folhas': '/products/box-articulado-4-thumb.png',
  'box-frontal-simples': '/products/box-frontal-simples-thumb.png',
  'box-walk-in': '/products/box-walk-in-thumb.png',
  
  // ESPELHOS (7 de 8)
  'espelho-bisotado-4mm': '/products/espelho-bisotado-thumb.png',
  'espelho-bronze': '/products/espelho-bronze-thumb.png',
  'espelho-com-led': '/products/espelho-led-thumb.png',
  'espelho-camarim': '/products/espelho-camarim-thumb.png',
  'espelho-fume': '/products/espelho-fume-thumb.png',
  'espelho-lapidado-4mm': '/products/espelho-lapidado-thumb.png',
  'espelho-jateado-desenho': '/products/espelho-jateado-thumb.png',
  
  // VIDROS (3 de 9)
  'vidro-laminado-8mm': '/products/vidro-laminado-8mm-thumb.png',
  'vidro-temperado-10mm': '/products/vidro-temperado-10mm-thumb.png',
  'vidro-temperado-8mm': '/products/vidro-temperado-8mm-thumb.png',
  
  // PORTAS (1 de 6)
  'porta-de-correr': '/products/porta-correr-thumb.png',
  
  // JANELAS (1 de 5)
  'janela-maxim-ar': '/products/janela-maxim-ar-thumb.png',
  
  // GUARDA-CORPO (2 de 6)
  'guarda-corpo-autoportante': '/products/guarda-corpo-autoportante-thumb.png',
  'guarda-corpo-torres-inox': '/products/guarda-corpo-torres-thumb.png',
  
  // TAMPOS (1 de 3)
  'tampo-vidro-mesa': '/products/tampo-mesa-thumb.png',
  
  // DIVISORIAS (1 de 4)
  'divisoria-escritorio': '/products/divisoria-escritorio-thumb.png',
  
  // FECHAMENTOS (1 de 4)
  'fechamento-sacada': '/products/fechamento-sacada-thumb.png',
};

let updated = 0;
for (const [slug, thumbnail] of Object.entries(productImageMap)) {
  try {
    const result = await prisma.product.updateMany({
      where: { slug },
      data: { thumbnail }
    });
    if (result.count > 0) {
      console.log('✅ ' + slug + ' -> ' + thumbnail);
      updated++;
    } else {
      console.log('⚠️  Produto não encontrado: ' + slug);
    }
  } catch (e) {
    console.log('❌ Erro ao atualizar ' + slug + ': ' + e.message);
  }
}

console.log('\n=== RESUMO ===');
console.log('Produtos atualizados: ' + updated);

await prisma.$disconnect();
