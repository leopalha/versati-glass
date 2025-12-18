// Test quote creation API
// Run with: node test-quote-creation.mjs

const testData = {
  customerName: "João da Silva",
  customerEmail: "joao@test.com",
  customerPhone: "21999887766",
  serviceStreet: "Rua Teste",
  serviceNumber: "123",
  serviceComplement: "Apto 101",
  serviceNeighborhood: "Centro",
  serviceCity: "Rio de Janeiro",
  serviceState: "RJ",
  serviceZipCode: "20000000",
  items: [
    {
      description: "Box para Banheiro - 2.0m x 2.0m",
      specifications: "2.0m x 2.0m - Cristal - 8mm",
      width: 2.0,
      height: 2.0,
      quantity: 1,
      color: "Cristal",
      thickness: "8mm",
      unitPrice: 1500.00,
      totalPrice: 1500.00,
      customerImages: []
    }
  ],
  source: "WEBSITE"
}

async function testQuoteCreation() {
  try {
    console.log('🧪 Testing Quote Creation API...\n')
    console.log('📤 Sending request to http://localhost:3000/api/quotes')
    console.log('📦 Payload:', JSON.stringify(testData, null, 2))
    console.log('\n')

    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`)
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()))
    console.log('\n')

    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('📄 Response Body:')
      console.log(JSON.stringify(data, null, 2))

      if (response.ok) {
        console.log('\n✅ SUCCESS! Quote created:', data.number)
      } else {
        console.log('\n❌ FAILED! Error:', data.error || data.message)
        if (data.details) {
          console.log('📋 Validation Details:', JSON.stringify(data.details, null, 2))
        }
      }
    } else {
      const text = await response.text()
      console.log('📄 Response Body (text):')
      console.log(text)
      console.log('\n❌ FAILED! Expected JSON response but got:', contentType)
    }
  } catch (error) {
    console.log('\n💥 ERROR:', error.message)
    console.log('📋 Stack:', error.stack)
  }
}

testQuoteCreation()
