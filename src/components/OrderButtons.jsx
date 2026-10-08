import { Phone, MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'

const sizes = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
}

export default function OrderButtons({
  variant = 'light', // 'light' for cream backgrounds, 'dark' for cocoa backgrounds
  size = 'md',
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

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <a
        href={siteConfig.phoneHref}
        className={`${base} ${sizes[size]} ${styles.call}`}
      >
        <Phone size={18} />
        Call to Order
      </a>
      <a
        href={siteConfig.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${sizes[size]} ${styles.message}`}
      >
        <MessageCircle size={18} />
        Message on Messenger
      </a>
    </div>
  )
}
