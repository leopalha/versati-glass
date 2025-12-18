'use client'

import { useState } from 'react'
import { Share2, Facebook, Linkedin, Link2, Check, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackShare } from '@/lib/analytics'
import { logger } from '@/lib/logger'

interface ShareButtonsProps {
  url?: string
  title: string
  description?: string
  className?: string
  variant?: 'icons' | 'full'
}

export function ShareButtons({
  url,
  title,
  description,
  className = '',
  variant = 'icons',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = description || title

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-600 hover:text-white',
      url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${shareUrl}`)}`,
      method: 'whatsapp' as const,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      method: 'facebook' as const,
    },
    {
      name: 'Twitter',
      icon: () => (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'hover:bg-black hover:text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      method: 'twitter' as const,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-700 hover:text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      method: 'linkedin' as const,
    },
  ]

  const handleShare = (
    method: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin',
    shareLink: string
  ) => {
    trackShare({
      method,
      content_type: 'product',
      item_id: shareUrl,
    })
    window.open(shareLink, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      trackShare({
        method: 'copy_link',
        content_type: 'product',
        item_id: shareUrl,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled or error
        logger.debug('Share cancelled')
      }
    }
  }

  if (variant === 'full') {
    return (
      <div className={`space-y-3 ${className}`}>
        <p className="text-sm font-medium text-neutral-400">Compartilhar:</p>
        <div className="flex flex-wrap gap-2">
          {shareLinks.map((link) => (
            <Button
              key={link.name}
              variant="outline"
              size="sm"
              onClick={() => handleShare(link.method, link.url)}
              className={`gap-2 ${link.color}`}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copiado!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Copiar Link
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Native share on mobile */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          title="Compartilhar"
        >
          <Share2 className="h-5 w-5" />
        </button>
      )}

      {/* Social buttons */}
      {shareLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleShare(link.method, link.url)}
          className={`rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 ${link.color}`}
          title={`Compartilhar no ${link.name}`}
        >
          <link.icon className="h-5 w-5" />
        </button>
      ))}

      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        title="Copiar link"
      >
        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Link2 className="h-5 w-5" />}
      </button>
    </div>
  )
}
