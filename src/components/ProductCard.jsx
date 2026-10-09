import { Users, UtensilsCrossed } from 'lucide-react'
import OrderButtons from './OrderButtons'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

export default function ProductCard({ product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-berry/5">
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-mint-light">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
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
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-semibold text-berry">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
          {product.description}
        </p>

        {/* Sizes & prices */}
        <ul className="mt-5 divide-y divide-cream-dark border-y border-cream-dark text-sm">
          {product.sizes.map((size) => (
            <li key={size.name} className="flex items-center justify-between py-2.5">
              <div>
                <span className="font-medium text-cocoa">{size.name}</span>
                {size.pieces && (
                  <span className="ml-2 text-cocoa/50">{size.pieces} pcs</span>
                )}
                <span className="mt-0.5 flex items-center gap-1 text-xs text-cocoa/60">
                  <Users size={12} />
                  Serves{' '}
                  {size.pax.min === size.pax.max
                    ? size.pax.min
                    : `${size.pax.min}–${size.pax.max}`}
                </span>
              </div>
              <span className="font-semibold text-cocoa">{peso(size.price)}</span>
            </li>
          ))}
        </ul>

        {/* Order buttons pinned to the bottom so all cards align */}
        <div className="mt-auto pt-5">
          <OrderButtons compact />
        </div>
      </div>
    </article>
  )
}
