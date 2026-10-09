import { MessageCircle } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'

const sizes = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function OrderButtons({
  variant = 'light', // 'light' for cream backgrounds, 'dark' for cocoa backgrounds
  size = 'md',
  fullWidth = false,
  label = 'Order on Messenger',
  onClick,
  className = '',
}) {
  const colors =
    variant === 'dark'
      ? 'bg-gold text-cocoa shadow-gold/20 hover:bg-gold-light'
      : 'bg-berry text-white shadow-berry/25 hover:bg-berry-dark'

  return (
    <a
      href={siteConfig.messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-medium shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${colors} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      <MessageCircle size={size === 'lg' ? 20 : 17} />
      {label}
    </a>
  )
}
