import { config } from 'dotenv'

config({ path: '.env.test' })

async function testAPI() {
  console.log('🧪 Testing API endpoint: /api/products?category=BOX\n')

  try {
    const response = await fetch('http://localhost:3100/api/products?category=BOX')

    console.log('Status:', response.status, response.statusText)
    console.log('Content-Type:', response.headers.get('content-type'))

    const data = await response.json()

    console.log('\n📦 Products returned:', data.length)

    if (data.length > 0) {
      console.log('\n✅ First product:')
      console.log(JSON.stringify(data[0], null, 2))
    } else {
      console.log('\n⚠️ No products returned!')
      console.log('Response:', JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Make sure dev server is running: pnpm dev -p 3100')
  }
}

testAPI()
