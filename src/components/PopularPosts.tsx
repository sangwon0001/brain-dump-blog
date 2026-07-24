'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useDictionary, useLocale } from '@/i18n/client'
import { localizePath } from '@/i18n/config'

type Period = 'daily' | 'weekly' | 'monthly' | 'total'

interface RankingItem {
  slug: string
  views: number
}

interface PopularPostsProps {
  period?: Period
  limit?: number
  showPeriodSelector?: boolean
  className?: string
  postTitles?: Record<string, { title: string }>
}

const PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'total']

export function PopularPosts({
  period: initialPeriod = 'total',
  limit = 5,
  showPeriodSelector = true,
  className = '',
  postTitles = {}
}: PopularPostsProps) {
  const locale = useLocale()
  const t = useDictionary()
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [rankings, setRankings] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/rankings?period=${period}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setRankings(data.rankings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [period, limit])

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{t.popular.title}</h3>
        {showPeriodSelector && (
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="text-sm bg-transparent border border-[var(--color-border)] rounded px-2 py-1"
          >
            {PERIODS.map((value) => (
              <option key={value} value={value}>{t.popular.periods[value]}</option>
            ))}
          </select>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[var(--color-text-secondary)] text-sm"
          >
            {t.popular.loading}
          </motion.div>
        ) : rankings.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[var(--color-text-secondary)] text-sm"
          >
            {t.popular.empty}
          </motion.div>
        ) : (
          <motion.ol
            key={period}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-3"
          >
            {rankings.map((item, index) => {
              const post = postTitles[item.slug]
              const href = post ? localizePath(locale, `/posts/${item.slug}`) : `#`
              const title = post?.title || item.slug

              return (
                <motion.li
                  key={item.slug}
                  variants={staggerItem}
                  className="flex gap-3"
                >
                  <span className="text-[var(--color-text-secondary)] font-mono text-sm w-5">
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={href}
                      className="text-sm hover:text-[var(--color-primary)] transition-colors line-clamp-2"
                    >
                      {title}
                    </Link>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {t.post.views(item.views.toLocaleString())}
                    </span>
                  </div>
                </motion.li>
              )
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  )
}
