import { forwardRef } from 'react'
import logo from '../assets/images/logo.png'
import { siteConfig } from '../data/siteConfig'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

const OrderImageCard = forwardRef(function OrderImageCard({ items, total, guests, kids }, ref) {
  const adults = guests - kids
  const today = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div ref={ref} style={{ width: 640 }} className="bg-cream p-8 text-cocoa">
      <div className="rounded-3xl border-2 border-gold/60 bg-white px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-dark pb-5">
          <img src={logo} alt="" className="h-20 w-auto" />
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
              Order Summary
            </p>
            <p className="mt-1 text-sm text-cocoa/60">{today}</p>
          </div>
        </div>

        {/* Crowd */}
        <p className="mt-5 text-sm text-cocoa/70">
          For <strong className="text-cocoa">{guests} guests</strong> · {kids}{' '}
          {kids === 1 ? 'kid' : 'kids'} · {adults} {adults === 1 ? 'adult' : 'adults'}
        </p>

        {/* Items */}
        <ul className="mt-3 divide-y divide-cream-dark">
          {items.map(({ product, combo, subtotal }) => (
            <li key={product.id} className="flex items-start justify-between gap-6 py-4">
              <div>
                <p className="font-display text-2xl font-semibold text-berry">{product.name}</p>
                <p className="mt-0.5 text-sm text-cocoa/70">
                  {combo
                    .map(
                      ({ size, qty }) =>
                        `${qty} × ${size.name}${size.pieces ? ` (${size.pieces} pcs)` : ''}`
                    )
                    .join(' + ')}
                </p>
              </div>
              <span className="shrink-0 text-lg font-semibold">{peso(subtotal)}</span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="mt-2 flex items-baseline justify-between border-t-2 border-gold/50 pt-4">
          <span className="text-sm font-semibold uppercase tracking-wider">Estimated total</span>
          <span className="font-display text-4xl font-semibold text-berry">{peso(total)}</span>
        </div>
      </div>
    </div>
  )
})

export default OrderImageCard
