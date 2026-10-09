import { Phone, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'

const sizes = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
  sm: 'px-4 py-2.5 text-sm',
}

export default function OrderButtons({
  variant = 'light', // 'light' for cream backgrounds, 'dark' for cocoa backgrounds
  size = 'md',
  compact = false, // shorter labels, always in one row (used inside product cards)
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200'

  const styles =
    variant === 'dark'
      ? {
          call: 'bg-gold text-cocoa hover:bg-gold-light',
          message: 'border-2 border-cream/70 text-cream hover:bg-cream hover:text-cocoa',
        }
      : {
          call: 'bg-berry text-white hover:bg-berry-dark',
          message: 'border-2 border-berry text-berry hover:bg-berry hover:text-white',
        }

  const layout = compact ? 'flex-row' : 'flex-col sm:flex-row'
  const buttonSize = compact ? sizes.sm : sizes[size]

  return (
    <div className={`flex gap-3 ${layout} ${className}`}>
      <a
        href={siteConfig.phoneHref}
        className={`${base} ${buttonSize} ${styles.call} ${compact ? 'flex-1' : ''}`}
      >
        <Phone size={16} />
        {compact ? 'Call' : 'Call to Order'}
      </a>
      <a
        href={siteConfig.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${buttonSize} ${styles.message} ${compact ? 'flex-1' : ''}`}
      >
        <MessageCircle size={16} />
        {compact ? 'Messenger' : 'Message on Messenger'}
      </a>
    </div>
  )
}
