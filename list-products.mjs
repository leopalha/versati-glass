import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = await prisma.product.findMany({
  select: { id: true, name: true, slug: true, category: true, subcategory: true, thumbnail: true },
  orderBy: [{ category: 'asc' }, { name: 'asc' }]
});

console.log('=== PRODUTOS NO BANCO ===');
products.forEach(p => {
  const thumb = p.thumbnail || 'NENHUMA';
  console.log('[' + p.category + '] ' + p.name + ' (slug: ' + p.slug + ') - thumb: ' + thumb);
});
console.log('\nTotal: ' + products.length + ' produtos');

await prisma.$disconnect();
