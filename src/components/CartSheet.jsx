import { useEffect, useState } from 'react'
import { Check, Minus, Plus, ShoppingBag, Trash2, UtensilsCrossed, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CheckoutFlow from './CheckoutFlow'
import { peso } from '../utils/format'

const detail = (size) =>
  size.pieces
    ? `${size.pieces} pcs`
    : `Serves ${size.pax.min === size.pax.max ? size.pax.min : `${size.pax.min}–${size.pax.max}`}`

function Thumb({ image }) {
  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-mint-light">
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-cocoa/30">
          <UtensilsCrossed size={20} strokeWidth={1.25} />
        </div>
      )}
    </div>
  )
}

export default function CartSheet() {
  const { isOpen, closeCart, items, count, total, setQty, clear } = useCart()
  const [checkout, setCheckout] = useState(false)

  // Start from the bag whenever it closes
  useEffect(() => {
    if (!isOpen) setCheckout(false)
  }, [isOpen])

  // Lock page scroll + close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const cancel = () => {
    closeCart()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- Checkout: review → name → sending → done ---------- */
  if (checkout) {
    const slipItems = items.map(({ key, product, size, qty, lineTotal }) => ({
      key,
      name: product.name,
      image: product.image,
      lines: [{ qty, label: `${size.name} · ${detail(size)}` }],
      subtotal: lineTotal,
    }))

    return (
      <CheckoutFlow
        items={slipItems}
        total={total}
        onCancel={cancel}
        onSuccess={clear}
        onClose={closeCart}
      />
    )
  }

  /* ---------- The bag ---------- */
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-cocoa/60 p-4 backdrop-blur-sm sm:p-5"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
      onClick={closeCart}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="flex max-h-full w-full max-w-lg animate-expand flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl"
        style={{ transformOrigin: '100% 100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4 sm:px-6">
          <h2
            id="cart-title"
            className="inline-flex items-center gap-2 text-2xl font-semibold text-berry sm:text-3xl"
          >
            <ShoppingBag size={24} />
            Your Order
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close"
            className="rounded-full p-2 text-cocoa/60 transition-colors hover:bg-cream-dark hover:text-cocoa"
          >
            <X size={22} />
          </button>
        </div>

        {count === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingBag size={40} strokeWidth={1.25} className="mx-auto text-cocoa/25" />
            <p className="mt-4 font-display text-2xl font-semibold text-cocoa">
              Your order is empty
            </p>
            <p className="mt-2 text-sm text-cocoa/65">Tap a size on any bilao to add it.</p>
            <button
              onClick={closeCart}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-berry-dark"
            >
              Browse our products
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="flex-1 divide-y divide-cream-dark overflow-y-auto overscroll-contain px-5 sm:px-6">
              {items.map(({ key, product, size, qty, lineTotal }) => (
                <li key={key} className="flex items-center gap-3 py-3">
                  <Thumb image={product.image} />

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold leading-tight text-berry">
                      {product.name}
                    </p>
                    <p className="text-xs text-cocoa/65">
                      {size.name} · {detail(size)}
                    </p>

                    <div className="mt-1.5 inline-flex items-center rounded-full border border-cream-dark bg-white">
                      <button
                        onClick={() => setQty(key, qty - 1)}
                        aria-label={qty === 1 ? `Remove ${product.name}` : 'Decrease quantity'}
                        className="p-1.5 text-cocoa/70 transition-colors hover:text-berry"
                      >
                        {qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-cocoa">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(key, qty + 1)}
                        aria-label="Increase quantity"
                        className="p-1.5 text-cocoa/70 transition-colors hover:text-berry"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <span className="shrink-0 whitespace-nowrap font-semibold text-cocoa">
                    {peso(lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-cream-dark bg-white px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-cocoa/70">Total</span>
                <span className="font-display text-3xl font-semibold text-berry">
                  {peso(total)}
                </span>
              </div>

              <button
                onClick={() => setCheckout(true)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-berry px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-berry/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-berry-dark sm:py-4"
              >
                <Check size={20} />
                Continue
              </button>

              <button
                onClick={clear}
                className="mx-auto mt-3 flex items-center gap-1.5 text-xs text-cocoa/50 transition-colors hover:text-berry"
              >
                <Trash2 size={12} />
                Clear order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
