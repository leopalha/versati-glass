const fs = require('fs');
const content = fs.readFileSync('prisma/seed.test.ts', 'utf8');
const lines = content.split('\n');
const filtered = lines.filter(line => !line.trim().startsWith('tags:'));
fs.writeFileSync('prisma/seed.test.ts', filtered.join('\n'), 'utf8');
console.log('Tags removed successfully');
