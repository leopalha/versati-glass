// Test with the exact payload from the debug tool
// This is what the browser is sending

const exactPayload = {
  "customerName": "Leonardo Palha",
  "customerEmail": "leonardo.palha@gmail.com",
  "customerPhone": "(21) 99535-4010",
  "serviceStreet": "Avenida Gilberto Amado",
  "serviceNumber": "553",
  "serviceComplement": "",
  "serviceNeighborhood": "Barra da Tijuca",
  "serviceCity": "Rio de Janeiro",
  "serviceState": "RJ",
  "serviceZipCode": "22620-061",
  "items": [
    {
      "description": "1m x 1m - TORRES - Vidro Laminado - Fumê - 12mm",
      "specifications": "2m x 3m - PRETO - 12mm",
      "width": 2,
      "height": 3,
      "quantity": 1,
      "unitPrice": 2600,
      "totalPrice": 2600,
      "customerImages": [],
      "productId": "3ff97260-70d1-416a-bf9c-8a78a7aa1ad1",
      "color": "PRETO",
      "finish": "LAPIDADO_OG",
      "glassType": "LAMINADO",
      "glassColor": "FUME",
      "model": "TORRES"
    }
  ],
  "source": "WEBSITE"
}

async function testExactPayload() {
  try {
    console.log('🧪 Testing with EXACT payload from browser...\n')
    console.log('📦 Payload:', JSON.stringify(exactPayload, null, 2))
    console.log('\n📤 Sending to http://localhost:3000/api/quotes\n')

    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exactPayload),
    })

    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()))
    console.log('\n')

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const data = await response.json()
      console.log('📄 Response:')
      console.log(JSON.stringify(data, null, 2))

      if (response.ok) {
        console.log('\n✅ SUCCESS! Quote created:', data.number)
      } else {
        console.log('\n❌ FAILED!')
        console.log('Error:', data.error || data.message)
        if (data.details) {
          console.log('Details:', JSON.stringify(data.details, null, 2))
        }
      }
    } else {
      const text = await response.text()
      console.log('📄 Response (non-JSON):')
      console.log(text)
    }
  } catch (error) {
    console.error('\n💥 ERROR:', error.message)
    console.error(error.stack)
  }
}

testExactPayload()
