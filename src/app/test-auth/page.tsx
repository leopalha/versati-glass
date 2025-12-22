'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession, signOut, getCsrfToken, getSession } from 'next-auth/react'

export default function TestAuthPage() {
  const { data: session, status, update } = useSession()
  const [result, setResult] = useState<string>('')
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string>('')

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`])
  }

  useEffect(() => {
    addLog(`Session status changed: ${status}`)
    if (session) {
      addLog(`Session data: ${JSON.stringify(session.user)}`)
    }
  }, [status, session])

  useEffect(() => {
    getCsrfToken().then(token => {
      setCsrfToken(token || '')
      addLog(`CSRF Token loaded: ${token?.substring(0, 20)}...`)
    })
  }, [])

  const testLogin = async (email: string, password: string, label: string) => {
    setLoading(true)
    setResult('')
    addLog(`--- Starting ${label} login test ---`)
    addLog(`Email: ${email}`)

    try {
      addLog('Step 1: Calling signIn with redirect: false')
      const startTime = Date.now()

      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      const elapsed = Date.now() - startTime
      addLog(`Step 2: signIn completed in ${elapsed}ms`)
      addLog(`Result: ${JSON.stringify(res)}`)

      if (res?.error) {
        addLog(`ERROR: ${res.error}`)
        setResult(`Error: ${res.error}`)
      } else if (res?.ok) {
        addLog('Step 3: Login successful! Checking session...')

        // Force session refresh
        const newSession = await getSession()
        addLog(`Step 4: New session: ${JSON.stringify(newSession)}`)

        if (newSession?.user) {
          addLog(`User role: ${newSession.user.role}`)
          const redirectTo = newSession.user.role === 'ADMIN' ? '/admin' : '/portal'
          addLog(`Should redirect to: ${redirectTo}`)
          setResult(`SUCCESS! Role: ${newSession.user.role}\nRedirect to: ${redirectTo}`)
        } else {
          addLog('WARNING: Session not available yet')
          setResult('Login OK but session not loaded yet')
        }
      } else {
        addLog('WARNING: Unexpected result - not ok, not error')
        setResult(`Unexpected: ${JSON.stringify(res)}`)
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      addLog(`EXCEPTION: ${errMsg}`)
      setResult(`Exception: ${errMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const testFullFlow = async (email: string, password: string, label: string) => {
    addLog(`--- Full flow test: ${label} ---`)

    // Test credentials via API first
    addLog('Testing credentials via API...')
    try {
      const apiRes = await fetch('/api/debug-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-credentials', email, password }),
      })
      const apiData = await apiRes.json()
      addLog(`API test result: ${JSON.stringify(apiData)}`)

      if (apiData.success) {
        addLog('Credentials are valid! Now testing signIn...')
        await testLogin(email, password, label)
      } else {
        addLog(`Credentials INVALID: ${apiData.error}`)
        setResult(`Credentials invalid: ${apiData.error}`)
      }
    } catch (e) {
      addLog(`API test failed: ${e}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="mb-8 text-2xl font-bold">🔍 Auth Debug Page</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          <div className="rounded bg-gray-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">Session Status</h2>
            <p className="mb-2">
              Status: <span className={status === 'authenticated' ? 'text-green-400' : 'text-yellow-400'}>{status}</span>
            </p>
            <p className="mb-2 text-sm text-gray-400">CSRF: {csrfToken?.substring(0, 30)}...</p>
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-700 p-2 text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
            {session && (
              <button
                onClick={() => {
                  addLog('Signing out...')
                  signOut({ redirect: false }).then(() => {
                    addLog('Signed out successfully')
                    window.location.reload()
                  })
                }}
                className="mt-2 rounded bg-red-600 px-4 py-2 hover:bg-red-700"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="rounded bg-gray-800 p-4">
            <h2 className="mb-4 text-lg font-semibold">Test Logins</h2>
            <div className="space-y-2">
              <button
                onClick={() => testFullFlow('admin@versatiglass.com.br', 'admin123', 'Admin')}
                disabled={loading}
                className="w-full rounded bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '...' : '🔐 Test Admin (admin@versatiglass.com.br)'}
              </button>

              <button
                onClick={() => testFullFlow('cliente@versatiglass.com.br', 'cliente123', 'Cliente')}
                disabled={loading}
                className="w-full rounded bg-green-600 px-4 py-2 hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '...' : '👤 Test Cliente (cliente@versatiglass.com.br)'}
              </button>

              <button
                onClick={() => {
                  addLog('Starting Google OAuth...')
                  signIn('google', { callbackUrl: '/test-auth' })
                }}
                disabled={loading}
                className="w-full rounded bg-yellow-600 px-4 py-2 text-black hover:bg-yellow-700 disabled:opacity-50"
              >
                🔗 Test Google Login
              </button>
            </div>
          </div>

          <div className="rounded bg-gray-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">Manual Redirect</h2>
            <div className="flex gap-2">
              <a href="/portal" className="rounded bg-purple-600 px-4 py-2 hover:bg-purple-700">
                Go to /portal
              </a>
              <a href="/admin" className="rounded bg-orange-600 px-4 py-2 hover:bg-orange-700">
                Go to /admin
              </a>
              <a href="/login" className="rounded bg-gray-600 px-4 py-2 hover:bg-gray-700">
                Go to /login
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Logs */}
        <div className="space-y-4">
          {result && (
            <div className="rounded bg-gray-800 p-4">
              <h2 className="mb-2 text-lg font-semibold">Result</h2>
              <pre className={`rounded p-2 text-sm ${result.includes('SUCCESS') ? 'bg-green-900' : result.includes('Error') ? 'bg-red-900' : 'bg-gray-700'}`}>
                {result}
              </pre>
            </div>
          )}

          <div className="rounded bg-gray-800 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Debug Logs</h2>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="max-h-96 overflow-auto rounded bg-black p-2 font-mono text-xs">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes('ERROR') ? 'text-red-400' :
                    log.includes('SUCCESS') ? 'text-green-400' :
                    log.includes('WARNING') ? 'text-yellow-400' :
                    log.includes('---') ? 'text-blue-400 font-bold' :
                    'text-gray-300'
                  }
                >
                  {log}
                </div>
              ))}
              {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
