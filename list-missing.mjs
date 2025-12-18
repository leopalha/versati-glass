import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

const products = await prisma.product.findMany({
  select: { id: true, name: true, slug: true, category: true, thumbnail: true },
  orderBy: [{ category: 'asc' }, { name: 'asc' }]
});

console.log('=== PRODUTOS COM IMAGEM ===');
const withImage = products.filter(p => {
  if (!p.thumbnail) return false;
  const filePath = 'public' + p.thumbnail;
  return fs.existsSync(filePath);
});
withImage.forEach(p => console.log('✅ [' + p.category + '] ' + p.name));
console.log('Total: ' + withImage.length);

console.log('\n=== PRODUTOS SEM IMAGEM (FALTANTES) ===');
const missing = products.filter(p => {
  if (!p.thumbnail) return true;
  const filePath = 'public' + p.thumbnail;
  return !fs.existsSync(filePath);
});

// Agrupar por categoria
const byCategory = {};
missing.forEach(p => {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
});

for (const [cat, prods] of Object.entries(byCategory)) {
  console.log('\n📁 ' + cat + ' (' + prods.length + ' faltantes):');
  prods.forEach(p => {
    console.log('   ❌ ' + p.name + ' (slug: ' + p.slug + ')');
  });
}

console.log('\n=== RESUMO FINAL ===');
console.log('Total de produtos: ' + products.length);
console.log('Com imagem: ' + withImage.length);
console.log('Faltantes: ' + missing.length);

await prisma.$disconnect();
