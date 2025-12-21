/**
 * Script para gerar todas as 26 imagens de produtos via DALL-E 3
 *
 * USO:
 * 1. Configure sua API key: export OPENAI_API_KEY="sk-..."
 * 2. Execute: node generate-product-images.js
 *
 * O script vai:
 * - Gerar cada imagem via DALL-E 3
 * - Baixar e salvar no local correto
 * - Mostrar progresso em tempo real
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ ERRO: OPENAI_API_KEY não configurada!');
  console.error('Configure com: export OPENAI_API_KEY="sk-..."');
  process.exit(1);
}

// Definição de todas as 26 imagens a gerar
const IMAGES_TO_GENERATE = [
  // BOX (3)
  {
    filename: 'box-para-banheira.jpg',
    folder: 'box',
    prompt: 'Modern glass shower enclosure specifically designed for bathtub installation, 8mm tempered glass panel with chrome hinges, L-shaped configuration, clean minimal design, professional product photography, white background, high quality, no text, no branding, no watermarks'
  },
  {
    filename: 'box-pivotante.jpg',
    folder: 'box',
    prompt: 'Frameless pivoting glass shower door, 10mm clear tempered glass, pivot mechanism visible, minimal hardware, modern bathroom setting, professional product shot, white background, no text, no branding'
  },
  {
    filename: 'box-comum-tradicional.jpg',
    folder: 'box',
    prompt: 'Traditional budget-friendly glass shower box, 8mm clear tempered glass, white aluminum frame, front opening design, basic economical style, professional product photography, clean aesthetic, no text, no branding'
  },

  // CORTINAS-VIDRO (1)
  {
    filename: 'cortina-vidro-stanley.jpg',
    folder: 'cortinas-vidro',
    prompt: 'Glass curtain system for balcony, frameless glass panels with top rail track system, modern balcony enclosure, professional architectural photography, clean aesthetic, no text, no branding, no watermarks'
  },

  // DIVISÓRIAS (2)
  {
    filename: 'divisoria.jpg',
    folder: 'divisorias',
    prompt: 'Office glass partition wall, 10mm tempered clear glass with aluminum frame profile, modern corporate office setting, floor to ceiling installation, professional architectural photography, no text, no branding'
  },
  {
    filename: 'divisoria-com-porta.jpg',
    folder: 'divisorias',
    prompt: 'Complete office partition system with integrated glass door, floor to ceiling installation, aluminum frame profiles, modern corporate turnkey solution, professional architectural photography, no text, no branding'
  },

  // ESPELHOS (3)
  {
    filename: 'espelho-bronze.jpg',
    folder: 'espelhos',
    prompt: 'Bronze tinted decorative mirror, warm bronze tone glass, sophisticated wall mirror, professional product photography, elegant aesthetic, no text, no watermarks, no branding'
  },
  {
    filename: 'espelho-fume.jpg',
    folder: 'espelhos',
    prompt: 'Smoke gray tinted mirror, modern smoky glass mirror, sophisticated contemporary design, professional product photography, sleek aesthetic, no text, no branding'
  },
  {
    filename: 'espelho-veneziano.jpg',
    folder: 'espelhos',
    prompt: 'Venetian decorative mirror with artistic beveled design, ornate mirror panels creating decorative pattern, luxury wall mirror, professional photography, no text, no watermarks, no branding'
  },

  // FERRAGENS (2)
  {
    filename: 'mola-piso.jpg',
    folder: 'ferragens',
    prompt: 'Floor spring door closer mechanism for glass doors, chrome finish, hydraulic floor hinge shown installed in floor, professional product photography, white background, detailed view, no text, no branding'
  },
  {
    filename: 'puxador-tubular.jpg',
    folder: 'ferragens',
    prompt: '40cm stainless steel tubular door handle, brushed chrome finish, cylindrical bar pull for glass doors, professional product photography, white background, clean minimal aesthetic, no text, no branding'
  },

  // GUARDA-CORPO (2)
  {
    filename: 'guarda-corpo-autoportante.jpg',
    folder: 'guarda-corpo',
    prompt: 'Self-supporting glass railing system, stainless steel base profiles, 12mm laminated glass panel, no floor drilling required, modern balcony installation, professional architectural photography, no text, no branding'
  },
  {
    filename: 'guarda-corpo-spider.jpg',
    folder: 'guarda-corpo',
    prompt: 'Spider glass railing system with point-fixed fittings, minimalist ultra-modern design, stainless steel spider connectors, frameless glass panels, professional architectural photography, clean aesthetic, no text, no branding'
  },

  // KITS (8)
  {
    filename: 'kit-guarda-corpo.jpg',
    folder: 'kits',
    prompt: 'Glass railing installation kit components laid out, aluminum profiles, fixing buttons, accessories, tempered glass panel, complete residential kit, professional product photography, organized display, no text, no branding, no labels'
  },
  {
    filename: 'kit-fechamento.jpg',
    folder: 'kits',
    prompt: 'Balcony enclosure kit components, sliding track rails, rollers, accessories for glass installation, basic economy kit, professional product photography, organized layout, white background, no text, no branding'
  },
  {
    filename: 'kit-prateleiras.jpg',
    folder: 'kits',
    prompt: 'Three glass shelf kit with chrome metal brackets, 80x25cm tempered glass shelves, mounting hardware included, bathroom kitchen shelving set, professional product photography, clean display, no text, no branding'
  },
  {
    filename: 'kit-espelho-banheiro.jpg',
    folder: 'kits',
    prompt: 'Bathroom mirror kit with beveled mirror 60x80cm and glass shelf 60x15cm, chrome supports included, complete decorative set, professional product photography, elegant presentation, no text, no branding'
  },
  {
    filename: 'kit-box-frontal.jpg',
    folder: 'kits',
    prompt: 'Front-facing shower box installation kit, aluminum profiles, seals, accessories included, complete kit for 8mm glass, professional product photography, organized layout, no text, no branding, no labels'
  },
  {
    filename: 'kit-basculante.jpg',
    folder: 'kits',
    prompt: 'Awning hopper window kit for glass installation, aluminum frame components, hardware and accessories, complete installation kit, professional product photography, clean display, no text, no branding'
  },
  {
    filename: 'kit-box-canto.jpg',
    folder: 'kits',
    prompt: 'Corner shower box installation kit, L-shaped aluminum profiles, seals and accessories, complete kit for corner installation, professional product photography, organized layout, no text, no branding, no labels'
  },
  {
    filename: 'kit-porta.jpg',
    folder: 'kits',
    prompt: 'Glass door installation kit, hinges, handles, floor spring components, complete hardware set, professional product photography, organized display, white background, no text, no branding'
  },

  // PERGOLADOS (2)
  {
    filename: 'pergolado-inox.jpg',
    folder: 'pergolados',
    prompt: 'Stainless steel pergola structure with laminated glass roof panels, outdoor patio covering, modern architectural design, professional photography, bright daylight, no text, no watermarks, no branding'
  },
  {
    filename: 'cobertura-controle-solar.jpg',
    folder: 'pergolados',
    prompt: 'Solar control glass roof covering, laminated glass with solar control coating, reduces heat and UV protection, outdoor patio pergola, professional architectural photography, bright daylight setting, no text, no branding'
  },

  // PORTAS (2)
  {
    filename: 'porta-pivotante.jpg',
    folder: 'portas',
    prompt: 'Glass pivot door, 10mm clear tempered glass, modern pivot hinge system, minimalist design for main entrance, professional architectural photography, clean aesthetic, no text, no branding'
  },
  {
    filename: 'porta-pivotante-premium.jpg',
    folder: 'portas',
    prompt: 'Premium luxury glass pivot door, 12mm low-iron glass, imported hardware, top-of-line finish, architectural masterpiece, professional photography, ultra-modern aesthetic, no text, no branding'
  },

  // TAMPOS (2)
  {
    filename: 'tampo-extra-clear.jpg',
    folder: 'tampos',
    prompt: 'Extra clear low-iron glass table top, crystal clear transparency, polished edges, dining table surface, professional product photography, showcasing exceptional clarity, no text, no branding'
  },
  {
    filename: 'tampo-mesa.jpg',
    folder: 'tampos',
    prompt: 'Tempered glass table top with polished edges, rectangular dining table surface, 10mm thickness, professional product photography, clean aesthetic, white background, no text, no branding'
  }
];

// Função para fazer request HTTPS
function httpsRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Função para baixar imagem
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Função para gerar uma imagem via DALL-E 3
async function generateImage(imageConfig, index, total) {
  const { filename, folder, prompt } = imageConfig;

  console.log(`\n[${index + 1}/${total}] Gerando: ${folder}/${filename}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);

  try {
    // Chamar API da OpenAI
    const postData = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await httpsRequest(options, postData);

    if (!response.data || !response.data[0] || !response.data[0].url) {
      throw new Error('Resposta inválida da API');
    }

    const imageUrl = response.data[0].url;
    console.log(`✅ Imagem gerada! URL: ${imageUrl.substring(0, 50)}...`);

    // Criar pasta se não existir
    const folderPath = path.join(__dirname, 'public', 'images', 'products', folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Baixar e salvar imagem
    const filepath = path.join(folderPath, filename);
    console.log(`💾 Salvando em: ${filepath}`);
    await downloadImage(imageUrl, filepath);
    console.log(`✅ Salvo com sucesso!`);

    return { success: true, filename, folder };

  } catch (error) {
    console.error(`❌ Erro ao gerar ${filename}:`, error.message);
    return { success: false, filename, folder, error: error.message };
  }
}

// Função principal
async function main() {
  console.log('🚀 GERADOR DE IMAGENS DE PRODUTOS VIA DALL-E 3');
  console.log('================================================\n');
  console.log(`📊 Total de imagens a gerar: ${IMAGES_TO_GENERATE.length}`);
  console.log(`🔑 API Key configurada: ${OPENAI_API_KEY.substring(0, 10)}...`);
  console.log('\n⏳ Iniciando geração...\n');

  const results = [];

  // Gerar imagens sequencialmente (para evitar rate limit)
  for (let i = 0; i < IMAGES_TO_GENERATE.length; i++) {
    const result = await generateImage(IMAGES_TO_GENERATE[i], i, IMAGES_TO_GENERATE.length);
    results.push(result);

    // Aguardar 2 segundos entre cada request (rate limiting)
    if (i < IMAGES_TO_GENERATE.length - 1) {
      console.log('⏸️  Aguardando 2s antes da próxima...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Resumo final
  console.log('\n\n================================================');
  console.log('📊 RESUMO DA GERAÇÃO');
  console.log('================================================\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Sucesso: ${successful.length}/${results.length}`);
  console.log(`❌ Falhas: ${failed.length}/${results.length}\n`);

  if (successful.length > 0) {
    console.log('✅ Imagens geradas com sucesso:');
    successful.forEach(r => console.log(`   - ${r.folder}/${r.filename}`));
  }

  if (failed.length > 0) {
    console.log('\n❌ Imagens que falharam:');
    failed.forEach(r => console.log(`   - ${r.folder}/${r.filename}: ${r.error}`));
  }

  console.log('\n================================================');

  if (failed.length === 0) {
    console.log('🎉 TODAS AS 26 IMAGENS FORAM GERADAS COM SUCESSO!');
    console.log('📁 Localizadas em: public/images/products/');
    console.log('\n✅ Próximo passo: Execute o seed do banco de dados');
    console.log('   npx tsx prisma/seed-products-complete.ts');
  } else {
    console.log('⚠️  Algumas imagens falharam. Revise os erros acima.');
    process.exit(1);
  }
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
