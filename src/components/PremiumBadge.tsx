import { Crown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PremiumBadge({ size = 'md', className = '' }: PremiumBadgeProps) {
  const { t } = useTranslation()
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full ${sizeClasses[size]} ${className}`}
    >
      <Crown size={iconSizes[size]} weight="fill" />
      <span>{t('common.premium')}</span>
    </span>
  )
}

export function PremiumBadgeSimple() {
  const { t } = useTranslation()
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs font-medium rounded border border-amber-500/20">
      <Crown size={12} weight="fill" />
      <span>{t('common.premium')}</span>
    </span>
  )
}
