'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Bell, Check, CheckCheck, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string | null
  isRead: boolean
  createdAt: string
}

const typeIcons: Record<string, string> = {
  QUOTE_RECEIVED: '📝',
  QUOTE_ACCEPTED: '✅',
  QUOTE_REJECTED: '❌',
  ORDER_STATUS_CHANGED: '📦',
  PAYMENT_RECEIVED: '💰',
  APPOINTMENT_REMINDER: '📅',
  APPOINTMENT_CONFIRMED: '✔️',
  NEW_MESSAGE: '💬',
  SYSTEM: '🔔',
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [markingRead, setMarkingRead] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=10')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = async () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setLoading(true)
      await fetchNotifications()
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    setMarkingRead(true)
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    } finally {
      setMarkingRead(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      })

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const renderNotificationContent = (notification: Notification) => (
    <>
      <span className="mt-0.5 text-lg">{typeIcons[notification.type] || '🔔'}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium ${
              notification.isRead ? 'text-neutral-400' : 'text-white'
            }`}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent-500" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{notification.message}</p>
        <p className="mt-1 text-xs text-neutral-600">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>
      {!notification.isRead && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            markAsRead(notification.id)
          }}
          className="h-6 w-6 flex-shrink-0 text-neutral-500 hover:text-accent-500"
        >
          <Check className="h-3 w-3" />
        </Button>
      )}
    </>
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" className="relative" onClick={handleOpen}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
            <h3 className="font-semibold text-white">Notificacoes</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={markingRead}
                  className="h-8 gap-1 text-xs text-accent-500 hover:text-accent-400"
                >
                  {markingRead ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCheck className="h-3 w-3" />
                  )}
                  Marcar todas
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto mb-2 h-8 w-8 text-neutral-600" />
                <p className="text-sm text-neutral-500">Nenhuma notificacao</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {notifications.map((notification) => {
                  const baseClassName = `flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-800/50 ${
                    !notification.isRead ? 'bg-accent-500/5' : ''
                  }`

                  if (notification.link) {
                    return (
                      <Link
                        key={notification.id}
                        href={notification.link}
                        onClick={() => markAsRead(notification.id)}
                        className={baseClassName}
                      >
                        {renderNotificationContent(notification)}
                      </Link>
                    )
                  }

                  return (
                    <div key={notification.id} className={baseClassName}>
                      {renderNotificationContent(notification)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-neutral-700 px-4 py-2">
              <Link
                href="/portal/notificacoes"
                className="block text-center text-xs text-accent-500 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Ver todas as notificacoes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
