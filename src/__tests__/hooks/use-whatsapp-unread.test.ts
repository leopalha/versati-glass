import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useWhatsAppUnread } from '@/hooks/use-whatsapp-unread'

// Mock fetch
global.fetch = vi.fn()

// Mock EventSource
class MockEventSource {
  url: string
  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  readyState: number = 0

  constructor(url: string) {
    this.url = url
    // Simulate connection after small delay
    setTimeout(() => {
      this.readyState = 1
      if (this.onopen) {
        this.onopen()
      }
    }, 10)
  }

  close() {
    this.readyState = 2
  }

  // Helper to simulate incoming message
  simulateMessage(data: any) {
    if (this.onmessage) {
      const event = new MessageEvent('message', {
        data: JSON.stringify(data),
      })
      this.onmessage(event)
    }
  }

  // Helper to simulate error
  simulateError() {
    if (this.onerror) {
      this.onerror()
    }
  }
}

describe('useWhatsAppUnread', () => {
  let mockEventSource: MockEventSource

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Mock EventSource globally
    global.EventSource = vi.fn((url: string) => {
      mockEventSource = new MockEventSource(url)
      return mockEventSource as any
    }) as any
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with zero unread count', () => {
    const { result } = renderHook(() => useWhatsAppUnread())

    expect(result.current.unreadCount).toBe(0)
    expect(result.current.isConnected).toBe(false)
  })

  it('should fetch initial unread count from API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        totalUnread: 5,
        conversations: [],
      }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(5)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/whatsapp/messages')
  })

  it('should handle API fetch errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    // Should not crash, should use SSE fallback
    await vi.runAllTimersAsync()

    expect(result.current.unreadCount).toBe(0)
    expect(mockFetch).toHaveBeenCalled()
  })

  it('should connect to SSE stream', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 0 }),
    })
    global.fetch = mockFetch

    renderHook(() => useWhatsAppUnread())

    await vi.runAllTimersAsync()

    expect(global.EventSource).toHaveBeenCalledWith('/api/whatsapp/stream')
  })

  it('should set connected state when SSE opens', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 0 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })
  })

  it('should increment count on new inbound message', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 3 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(3)
    })

    // Simulate new inbound WhatsApp message via SSE
    await vi.runAllTimersAsync()

    mockEventSource.simulateMessage({
      type: 'new_message',
      data: {
        direction: 'INBOUND',
        from: 'whatsapp:+5521999999999',
        body: 'Nova mensagem do cliente',
      },
    })

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(4) // 3 + 1
    })
  })

  it('should not increment count on outbound message', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 3 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(3)
    })

    await vi.runAllTimersAsync()

    // Simulate outbound message (our response)
    mockEventSource.simulateMessage({
      type: 'new_message',
      data: {
        direction: 'OUTBOUND',
        to: 'whatsapp:+5521999999999',
        body: 'Nossa resposta',
      },
    })

    await vi.runAllTimersAsync()

    // Count should remain the same
    expect(result.current.unreadCount).toBe(3)
  })

  it('should handle malformed SSE messages gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 2 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(2)
    })

    await vi.runAllTimersAsync()

    // Simulate malformed message
    if (mockEventSource.onmessage) {
      const event = new MessageEvent('message', {
        data: 'invalid json{',
      })
      mockEventSource.onmessage(event)
    }

    await vi.runAllTimersAsync()

    // Should not crash, count remains the same
    expect(result.current.unreadCount).toBe(2)
  })

  it('should handle SSE connection errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 1 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })

    // Simulate error
    mockEventSource.simulateError()

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false)
    })
  })

  it('should reconnect after error with 10s delay', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 1 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })

    const firstEventSource = global.EventSource
    const firstCallCount = (firstEventSource as any).mock.calls.length

    // Simulate error
    mockEventSource.simulateError()

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false)
    })

    // Advance 10 seconds
    await vi.advanceTimersByTimeAsync(10000)

    // Should create new EventSource (reconnect)
    await waitFor(() => {
      const newCallCount = (global.EventSource as any).mock.calls.length
      expect(newCallCount).toBeGreaterThan(firstCallCount)
    })
  })

  it('should close EventSource on unmount', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 0 }),
    })
    global.fetch = mockFetch

    const { unmount } = renderHook(() => useWhatsAppUnread())

    await vi.runAllTimersAsync()

    const closeSpy = vi.spyOn(mockEventSource, 'close')

    unmount()

    expect(closeSpy).toHaveBeenCalled()
  })

  it('should handle multiple rapid messages correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 0 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await vi.runAllTimersAsync()

    // Simulate 3 rapid inbound messages
    mockEventSource.simulateMessage({
      type: 'new_message',
      data: { direction: 'INBOUND' },
    })

    await vi.runAllTimersAsync()

    mockEventSource.simulateMessage({
      type: 'new_message',
      data: { direction: 'INBOUND' },
    })

    await vi.runAllTimersAsync()

    mockEventSource.simulateMessage({
      type: 'new_message',
      data: { direction: 'INBOUND' },
    })

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(3)
    })
  })

  it('should ignore messages with unknown type', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalUnread: 1 }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(1)
    })

    await vi.runAllTimersAsync()

    // Simulate message with unknown type
    mockEventSource.simulateMessage({
      type: 'unknown_event',
      data: {},
    })

    await vi.runAllTimersAsync()

    // Count should remain the same
    expect(result.current.unreadCount).toBe(1)
  })

  it('should handle API returning undefined totalUnread', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        conversations: [],
        // totalUnread missing
      }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() => useWhatsAppUnread())

    await vi.runAllTimersAsync()

    // Should keep initial value of 0
    expect(result.current.unreadCount).toBe(0)
  })
})
