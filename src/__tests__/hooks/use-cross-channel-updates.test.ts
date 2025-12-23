import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCrossChannelUpdates } from '@/hooks/use-cross-channel-updates'

// Mock fetch
global.fetch = vi.fn()

describe('useCrossChannelUpdates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    expect(result.current.hasUpdate).toBe(false)
    expect(result.current.latestMessage).toBeNull()
  })

  it('should not check for updates when disabled', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch

    renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: false,
      })
    )

    await vi.advanceTimersByTimeAsync(1000)

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should not check for updates without conversationId', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch

    renderHook(() =>
      useCrossChannelUpdates({
        enabled: true,
      })
    )

    await vi.advanceTimersByTimeAsync(1000)

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should check for updates on mount', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: false,
      }),
    })
    global.fetch = mockFetch

    renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/ai/chat/check-updates'))
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('conversationId=test-conv-123'))
  })

  it('should detect new WhatsApp messages', async () => {
    const mockMessage = {
      id: 'msg-123',
      content: 'Nova mensagem do WhatsApp',
      timestamp: new Date().toISOString(),
      senderType: 'CUSTOMER',
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: true,
        latestMessage: mockMessage,
      }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    await waitFor(() => {
      expect(result.current.hasUpdate).toBe(true)
    })

    expect(result.current.latestMessage).toEqual(mockMessage)
  })

  it('should call onUpdate callback when update detected', async () => {
    const mockMessage = {
      id: 'msg-123',
      content: 'Nova mensagem',
      timestamp: new Date().toISOString(),
      senderType: 'CUSTOMER',
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: true,
        latestMessage: mockMessage,
      }),
    })
    global.fetch = mockFetch

    const onUpdate = vi.fn()

    renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
        onUpdate,
      })
    )

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
    })

    expect(onUpdate).toHaveBeenCalledWith(mockMessage)
  })

  it('should poll at specified interval', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: false,
      }),
    })
    global.fetch = mockFetch

    renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
        pollingInterval: 5000, // 5 seconds
      })
    )

    // Initial call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Advance 5 seconds - should poll again
    await vi.advanceTimersByTimeAsync(5000)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    // Advance another 5 seconds
    await vi.advanceTimersByTimeAsync(5000)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  it('should use default polling interval of 10 seconds', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: false,
      }),
    })
    global.fetch = mockFetch

    renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    // Initial call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Advance 10 seconds (default interval)
    await vi.advanceTimersByTimeAsync(10000)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  it('should handle fetch errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const { result } = renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    // Should not crash, hasUpdate remains false
    expect(result.current.hasUpdate).toBe(false)
    expect(result.current.latestMessage).toBeNull()
  })

  it('should handle non-ok response gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    global.fetch = mockFetch

    const { result } = renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    expect(result.current.hasUpdate).toBe(false)
    expect(result.current.latestMessage).toBeNull()
  })

  it('should dismiss update correctly', async () => {
    const mockMessage = {
      id: 'msg-123',
      content: 'Nova mensagem',
      timestamp: new Date().toISOString(),
      senderType: 'CUSTOMER',
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: true,
        latestMessage: mockMessage,
      }),
    })
    global.fetch = mockFetch

    const { result } = renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
      })
    )

    await waitFor(() => {
      expect(result.current.hasUpdate).toBe(true)
    })

    // Dismiss update
    result.current.dismissUpdate()

    expect(result.current.hasUpdate).toBe(false)
    expect(result.current.latestMessage).toBeNull()
  })

  it('should cleanup interval on unmount', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        hasWhatsAppUpdate: false,
      }),
    })
    global.fetch = mockFetch

    const { unmount } = renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
        pollingInterval: 5000,
      })
    )

    // Initial call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    unmount()

    // Advance time after unmount - should NOT poll
    await vi.advanceTimersByTimeAsync(10000)

    // Should still be only 1 call (no polling after unmount)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should update lastChecked timestamp when update detected', async () => {
    const mockMessage = {
      id: 'msg-123',
      content: 'Nova mensagem',
      timestamp: new Date().toISOString(),
      senderType: 'CUSTOMER',
    }

    let callCount = 0
    const mockFetch = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve({
        ok: true,
        json: async () => ({
          hasWhatsAppUpdate: callCount === 1, // Only first call has update
          latestMessage: callCount === 1 ? mockMessage : null,
        }),
      })
    })
    global.fetch = mockFetch

    renderHook(() =>
      useCrossChannelUpdates({
        conversationId: 'test-conv-123',
        enabled: true,
        pollingInterval: 5000,
      })
    )

    // Initial call with update
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Advance to second poll
    await vi.advanceTimersByTimeAsync(5000)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    // Second call should have updated lastChecked param
    const secondCallUrl = mockFetch.mock.calls[1][0] as string
    expect(secondCallUrl).toContain('lastChecked=')
  })
})
