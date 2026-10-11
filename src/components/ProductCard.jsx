import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Check, Plus, Users, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { flyToCart } from '../utils/flyToCart'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

const serves = (size) =>
  size.pax.min === size.pax.max ? size.pax.min : `${size.pax.min}–${size.pax.max}`

export default function ProductCard({ product }) {
  const { add, qtyFor } = useCart()
  const [flash, setFlash] = useState(null) // the size that was just added
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const addSize = (e, size) => {
    flyToCart(e.currentTarget, product.image, () => {
      add(product.id, size.name)
      setFlash(size.name)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setFlash(null), 1200)
    })
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-berry/5">
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

        {/* Sizes: tap one to add it to your order */}
        <ul className="mt-5 divide-y divide-cream-dark border-y border-cream-dark text-sm">
          {product.sizes.map((size) => {
            const inBag = qtyFor(product.id, size.name)
            return (
              <li key={size.name}>
                <button
                  onClick={(e) => addSize(e, size)}
                  aria-label={`Add ${size.name} ${product.name} to your order`}
                  className="flex w-full items-center justify-between py-2.5 text-left transition-colors hover:text-berry active:bg-cream"
                >
                  <div>
                    <span className="font-medium text-cocoa">{size.name}</span>
                    {size.pieces && <span className="ml-2 text-cocoa/50">{size.pieces} pcs</span>}
                    {inBag > 0 && (
                      <span className="ml-2 rounded-full bg-berry/10 px-2 py-0.5 text-xs font-semibold text-berry">
                        ×{inBag}
                      </span>
                    )}
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-cocoa/60">
                      <Users size={12} />
                      Serves {serves(size)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 font-semibold text-cocoa">
                    {peso(size.price)}
                    {flash === size.name ? (
                      <Check size={16} className="text-berry" />
                    ) : (
                      <Plus size={16} className="text-gold-dark" />
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Hint pinned to the bottom so all cards align */}
        <div className="mt-auto pt-5">
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-berry">
            <ArrowUp size={16} />
            Tap a size to add it
          </p>
        </div>
      </div>
    </article>
  )
}
