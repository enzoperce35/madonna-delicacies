import { useEffect, useRef } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartButton() {
  const { count, bump, openCart } = useCart()
  const iconRef = useRef(null)
  const badgeRef = useRef(null)

  // Wiggle the bag whenever something lands in it
  useEffect(() => {
    if (bump === 0) return
    iconRef.current?.animate(
      [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.25) rotate(-8deg)', offset: 0.4 },
        { transform: 'scale(0.95) rotate(4deg)', offset: 0.7 },
        { transform: 'scale(1) rotate(0deg)' },
      ],
      { duration: 450, easing: 'ease-out' }
    )
  }, [bump])

  // Pop the number whenever the count changes
  useEffect(() => {
    if (count === 0) return
    badgeRef.current?.animate(
      [{ transform: 'scale(0.4)' }, { transform: 'scale(1)' }],
      { duration: 350, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    )
  }, [count])

  return (
    <>
      {/* The one and only flying photo, reused for every tap */}
      <div
        id="fly-dot"
        aria-hidden="true"
        className="pointer-events-none fixed z-[90] h-11 w-11 rounded-full border-[3px] border-white bg-mint-light bg-cover bg-center shadow-lg"
        style={{ display: 'none' }}
      />

      <button
        id="cart-button"
        onClick={openCart}
        aria-label={`Open your order, ${count} ${count === 1 ? 'item' : 'items'}`}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-berry text-white shadow-xl shadow-berry/30 transition-transform hover:-translate-y-0.5 active:scale-95 sm:bottom-6 sm:right-6"
        style={{
          marginBottom: 'env(safe-area-inset-bottom)',
          marginRight: 'env(safe-area-inset-right)',
        }}
      >
        <span ref={iconRef} className="inline-flex">
          <ShoppingBag size={24} />
        </span>

        {count > 0 && (
          <span
            ref={badgeRef}
            className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-bold text-cocoa ring-2 ring-cream"
          >
            {count}
          </span>
        )}
      </button>
    </>
  )
}
