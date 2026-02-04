'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
  className?: string
}

export function ViewCounter({ slug, className = '' }: ViewCounterProps) {
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
      .then(data => setViews(data.count))
      .catch(console.error)
  }, [slug])

  if (views === null) {
    return <span className={className}>-</span>
  }

  return (
    <span className={className}>
      {views.toLocaleString()} views
    </span>
  )
}
