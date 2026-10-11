import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Camera,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import OrderButtons from './OrderButtons'
import logo from '../assets/images/logo.png'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

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
  const [phase, setPhase] = useState('cart') // 'cart' → 'slip' (Step 1) → 'next' (Step 2)

  // Start from the bag whenever it closes
  useEffect(() => {
    if (!isOpen) setPhase('cart')
  }, [isOpen])

  // If the bag empties while reviewing, go back to it
  useEffect(() => {
    if (count === 0 && phase !== 'cart') setPhase('cart')
  }, [count, phase])

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

  /* ---------- Full-screen: Step 1 (screenshot) and Step 2 (send) ---------- */
  if (phase !== 'cart') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="fixed inset-0 z-[60] animate-expand overflow-y-auto bg-cream"
        style={{ transformOrigin: '100% 100%' }}
      >
        <div
          key={phase}
          className="mx-auto flex min-h-full w-full max-w-md animate-fade-up flex-col justify-center gap-5 px-5"
          style={{
            paddingTop: 'max(2rem, env(safe-area-inset-top))',
            paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          }}
        >
          {phase === 'slip' ? (
            <>
              <p className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-widest text-cocoa/50">
                <Camera size={14} />
                Step 1 of 2 · Take a screenshot
              </p>

              {/* The order list */}
              <div className="overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-xl shadow-cocoa/10">
                <div className="border-b border-cream-dark px-5 py-2">
                  <img src={logo} alt="Madonna Delicacies" className="h-10 w-auto" />
                </div>

                <ul className="divide-y divide-cream-dark px-5">
                  {items.map(({ key, product, size, qty, lineTotal }) => (
                    <li key={key} className="flex items-center gap-3 py-3">
                      <Thumb image={product.image} />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg font-semibold leading-tight text-berry">
                          {product.name}
                        </p>
                        <p className="text-xs text-cocoa/70">
                          <span className="font-semibold text-cocoa">{qty}×</span> {size.name} ·{' '}
                          {detail(size)}
                        </p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap font-semibold text-cocoa">
                        {peso(lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline justify-between border-t-2 border-gold/50 bg-cream/60 px-5 py-4">
                  <span className="text-sm font-semibold uppercase tracking-wider text-cocoa">
                    Total
                  </span>
                  <span className="font-display text-4xl font-semibold text-berry">
                    {peso(total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => setPhase('next')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cocoa/20 px-5 py-2.5 text-xs font-medium text-cocoa/60 transition-colors hover:border-berry hover:text-berry"
                >
                  <Check size={14} />
                  Done
                </button>
                <button
                  onClick={() => setPhase('cart')}
                  className="inline-flex items-center gap-1 text-xs text-cocoa/50 transition-colors hover:text-berry"
                >
                  <ArrowLeft size={12} />
                  Edit my order
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-gold-dark">
                  Step 2 of 2
                </p>
                <h3 className="mt-2 text-4xl font-semibold text-berry">Great Choices!</h3>
                <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                  Your order isn't sent yet. Send your screenshot to us on Messenger and we'll
                  confirm it with you.
                </p>
              </div>

              <div className="space-y-3">
                <OrderButtons
                  fullWidth
                  size="lg"
                  label="Send screenshot on Messenger"
                  onClick={closeCart}
                />
                <button
                  onClick={closeCart}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-berry px-5 py-3 text-sm font-medium text-berry transition-colors hover:bg-berry hover:text-white"
                >
                  <Plus size={17} />
                  Get more
                </button>
              </div>

              <p className="text-center text-xs leading-relaxed text-cocoa/55">
                In Messenger, tap the photo icon and choose your screenshot. Please also tell us
                your name, the date and time you need it, and pickup or delivery details.
              </p>

              <button
                onClick={() => setPhase('slip')}
                className="mx-auto text-sm text-cocoa/60 transition-colors hover:text-berry"
              >
                Show my order again
              </button>
            </>
          )}
        </div>
      </div>
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
              <p className="mt-1 text-xs text-cocoa/50">
                Next, you'll screenshot your order and send it to us on Messenger.
              </p>

              <button
                onClick={() => setPhase('slip')}
                className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-berry px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-berry/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-berry-dark sm:py-4"
              >
                <Check size={20} />
                Review my order
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
