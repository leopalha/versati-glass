'use client'

import { useState } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'

export default function TestAuthPage() {
  const { data: session, status } = useSession()
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testLogin = async (email: string, password: string) => {
    setLoading(true)
    setResult('Testing...')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      setResult(JSON.stringify(res, null, 2))
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="mb-8 text-2xl font-bold">Auth Test Page</h1>

      <div className="mb-8 rounded bg-gray-800 p-4">
        <h2 className="mb-2 text-lg font-semibold">Session Status</h2>
        <p>Status: {status}</p>
        <pre className="mt-2 overflow-auto rounded bg-gray-700 p-2 text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
        {session && (
          <button
            onClick={() => signOut()}
            className="mt-2 rounded bg-red-600 px-4 py-2 hover:bg-red-700"
          >
            Sign Out
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Test Logins</h2>

        <button
          onClick={() => testLogin('admin@versatiglass.com.br', 'admin123')}
          disabled={loading}
          className="mr-2 rounded bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          Test Admin Login
        </button>

        <button
          onClick={() => testLogin('cliente@versatiglass.com.br', 'cliente123')}
          disabled={loading}
          className="mr-2 rounded bg-green-600 px-4 py-2 hover:bg-green-700 disabled:opacity-50"
        >
          Test Cliente Login
        </button>

        <button
          onClick={() => signIn('google', { callbackUrl: '/test-auth' })}
          disabled={loading}
          className="mr-2 rounded bg-yellow-600 px-4 py-2 hover:bg-yellow-700 disabled:opacity-50"
        >
          Test Google Login
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded bg-gray-800 p-4">
          <h2 className="mb-2 text-lg font-semibold">SignIn Result</h2>
          <pre className="overflow-auto rounded bg-gray-700 p-2 text-sm">{result}</pre>
        </div>
      )}

      <div className="mt-8 rounded bg-gray-800 p-4">
        <h2 className="mb-2 text-lg font-semibold">Test Redirect</h2>
        <p className="mb-2 text-sm text-gray-400">After login, click to test redirect:</p>
        <a href="/portal" className="mr-2 text-blue-400 hover:underline">
          Go to /portal
        </a>
        <a href="/admin" className="text-blue-400 hover:underline">
          Go to /admin
        </a>
      </div>
    </div>
  )
}
