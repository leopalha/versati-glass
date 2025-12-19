/**
 * Test if admin/orcamentos page loads without errors
 */

async function testAdminPage() {
  try {
    console.log('🧪 Testing http://localhost:3000/admin/orcamentos\n')

    const response = await fetch('http://localhost:3000/admin/orcamentos')

    console.log(`Status: ${response.status} ${response.statusText}`)

    if (response.ok) {
      const html = await response.text()

      // Check for common error patterns
      const hasError = html.includes('Error') || html.includes('undefined')
      const hasContent = html.length > 1000

      console.log(`Content length: ${html.length} bytes`)
      console.log(`Has error markers: ${hasError ? '❌' : '✅ No'}`)
      console.log(`Has content: ${hasContent ? '✅ Yes' : '❌ No'}`)

      if (response.ok && hasContent && !hasError) {
        console.log('\n✅ Página admin/orcamentos carrega SEM ERROS!')
      } else {
        console.log('\n⚠️ Página carregou mas pode ter problemas')
      }
    } else {
      console.log('\n❌ Página retornou erro HTTP')
    }

  } catch (error) {
    console.error('❌ Erro ao testar:', error.message)
  }
}

testAdminPage()
