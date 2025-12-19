// Test quote creation for multiple categories

const testCategories = [
  { name: 'PORTAS', item: 'Porta de Vidro Pivotante' },
  { name: 'JANELAS', item: 'Janela Maxim-ar' },
  { name: 'CORTINAS_VIDRO', item: 'Cortina de Vidro para Sacada' },
  { name: 'PERGOLADOS', item: 'Cobertura de Vidro' },
  { name: 'FERRAGENS', item: 'Kit de Ferragens' },
  { name: 'SERVICOS', item: 'Manutenção de Box' }
]

async function testCategory(categoryName, itemDescription) {
  try {
    const payload = {
      customerName: "Teste " + categoryName,
      customerEmail: `teste${categoryName.toLowerCase()}@test.com`,
      customerPhone: "21999887766",
      serviceStreet: "Rua Teste",
      serviceNumber: "123",
      serviceNeighborhood: "Centro",
      serviceCity: "Rio de Janeiro",
      serviceState: "RJ",
      serviceZipCode: "20000-000",
      items: [{
        description: itemDescription,
        specifications: "1m x 1m",
        width: 1.0,
        height: 1.0,
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        customerImages: []
      }],
      source: "WEBSITE"
    }

    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const data = await response.json()
      return { success: true, number: data.number, category: categoryName }
    } else {
      const error = await response.json()
      return { success: false, error: error.message, category: categoryName }
    }
  } catch (error) {
    return { success: false, error: error.message, category: categoryName }
  }
}

async function runTests() {
  console.log('🧪 Testing Quote Creation for Multiple Categories...\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const results = []

  for (const { name, item } of testCategories) {
    process.stdout.write(`Testing ${name.padEnd(20)} ... `)
    const result = await testCategory(name, item)
    results.push(result)

    if (result.success) {
      console.log(`✅ ${result.number}`)
    } else {
      console.log(`❌ ${result.error}`)
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  console.log(`📊 Resultados:`)
  console.log(`   ✅ Sucesso: ${successCount}/${testCategories.length}`)
  console.log(`   ❌ Falhas:  ${failCount}/${testCategories.length}\n`)

  if (failCount > 0) {
    console.log('⚠️  Categorias que falharam:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.category}: ${r.error}`)
    })
  } else {
    console.log('🎉 TODAS AS CATEGORIAS TESTADAS PASSARAM!')
  }
}

runTests()
