import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUp, Camera, Check, ChevronRight, Plus, Users, UtensilsCrossed } from 'lucide-react'
import logo from '../assets/images/logo.png'
import OrderButtons from './OrderButtons'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

const serves = (size) =>
  size.pax.min === size.pax.max ? size.pax.min : `${size.pax.min}–${size.pax.max}`

export default function ProductCard({ product }) {
  const cardRef = useRef(null)
  const [selected, setSelected] = useState(null) // the size the customer tapped
  const [phase, setPhase] = useState('slip') // 'slip' = screenshot screen, 'next' = what's next
  const [origin, setOrigin] = useState({ x: 0, y: 0 }) // where the card is, so the screen grows from it

  const openSize = (size) => {
    const rect = cardRef.current?.getBoundingClientRect()
    setOrigin(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    )
    setPhase('slip')
    setSelected(size)
  }

  const close = () => {
    setSelected(null)
    setPhase('slip')
  }

  // Lock page scroll and allow Escape while the full-screen view is open
  useEffect(() => {
    if (!selected) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [selected])

  return (
    <>
      <article
        ref={cardRef}
        className="group flex flex-col overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-berry/5"
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-mint-light">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width="1200"
              height="900"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-cocoa/30">
              <UtensilsCrossed size={40} strokeWidth={1.25} />
              <span className="mt-2 text-xs font-medium uppercase tracking-widest">
                Photo coming soon
              </span>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-2xl font-semibold text-berry">{product.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cocoa/70">{product.description}</p>

          {/* Sizes: tap one to order */}
          <ul className="mt-5 divide-y divide-cream-dark border-y border-cream-dark text-sm">
            {product.sizes.map((size) => (
              <li key={size.name}>
                <button
                  onClick={() => openSize(size)}
                  aria-label={`Choose ${size.name} size of ${product.name}`}
                  className="flex w-full items-center justify-between py-2.5 text-left transition-colors hover:text-berry"
                >
                  <div>
                    <span className="font-medium text-cocoa">{size.name}</span>
                    {size.pieces && <span className="ml-2 text-cocoa/50">{size.pieces} pcs</span>}
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-cocoa/60">
                      <Users size={12} />
                      Serves {serves(size)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 font-semibold text-cocoa">
                    {peso(size.price)}
                    <ChevronRight size={16} className="text-gold-dark" />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Message pinned to the bottom so all cards align */}
          <div className="mt-auto pt-5">
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-berry">
              <ArrowUp size={16} />
              Choose size
            </p>
          </div>
        </div>
      </article>

      {/* Full-screen view */}
      {selected &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name}, ${selected.name}`}
            className="fixed inset-0 z-[70] animate-expand overflow-y-auto bg-cream"
            style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
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
                    Take a screenshot
                  </p>

                  {/* The slip */}
                  <div className="overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-xl shadow-cocoa/10">
                    <div className="relative aspect-[4/3] bg-mint-light">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-cocoa/30">
                          <UtensilsCrossed size={48} strokeWidth={1.25} />
                        </div>
                      )}

                      {/* Logo badge */}
                      <img
                        src={logo}
                        alt="Madonna Delicacies"
                        className="absolute left-0 top-1 h-18 w-auto sm:h-14"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <p className="min-w-0 font-display text-2xl font-semibold leading-tight text-berry">
                        {product.name} <span className="text-cocoa">{selected.name}</span>
                      </p>
                      <span className="shrink-0 whitespace-nowrap font-display text-3xl font-semibold text-cocoa">
                        {peso(selected.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPhase('next')}
                    className="inline-flex items-center gap-1.5 self-center rounded-full border border-cocoa/20 px-5 py-2.5 text-xs font-medium text-cocoa/60 transition-colors hover:border-berry hover:text-berry"
                  >
                    <Check size={14} />
                    Done
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-berry">Great Choice!</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                      Add more to your order, or send it to us on Messenger
                      now.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={close}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-berry px-5 py-3 text-sm font-medium text-berry transition-colors hover:bg-berry hover:text-white"
                    >
                      <Plus size={17} />
                      Get more
                    </button>
                    <OrderButtons fullWidth label="Order now" onClick={close} />
                  </div>

                  <button
                    onClick={() => setPhase('slip')}
                    className="mx-auto text-sm text-cocoa/60 transition-colors hover:text-berry"
                  >
                    Show my slip again
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
