'use client'

import { useEffect, useState } from 'react'
import { useDictionary } from '@/i18n/client'

interface ViewCounterProps {
  slug: string
  className?: string
}

export function ViewCounter({ slug, className = '' }: ViewCounterProps) {
  const t = useDictionary()
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // Record view
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })

    // Get view count
    fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => setViews(typeof data.count === 'number' ? data.count : null))
      .catch(console.error)
  }, [slug])

  if (views === null) {
    return <span className={className}>-</span>
  }

  return (
    <span className={className}>
      {t.post.views(views.toLocaleString())}
    </span>
  )
}
