import { forwardRef } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import logo from '../assets/images/logo.png'
import { applyDiscount } from '../utils/discount'
import { peso, peso2 } from '../utils/format'


// fixedWidth = true is the off-screen copy that becomes the image
const OrderSlipCard = forwardRef(function OrderSlipCard(
  { items, total, messengerName, fixedWidth = false },
  ref
) {
  const { discount, final } = applyDiscount(total)
  return (
    <div
      ref={ref}
      style={fixedWidth ? { width: 520 } : undefined}
      className={fixedWidth ? 'bg-cream p-6 text-cocoa' : 'text-cocoa'}
    >
      <div className="overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-xl shadow-cocoa/10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-cream-dark px-5 py-2">
          <img src={logo} alt="Madonna Delicacies" className="h-10 w-auto" />
          {messengerName && (
            <div className="min-w-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cocoa/50">
                Messenger name
              </p>
              <p className="truncate text-sm font-semibold text-cocoa">{messengerName}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <ul className="divide-y divide-cream-dark px-5">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-mint-light">
                {item.image ? (
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-cocoa/30">
                    <UtensilsCrossed size={20} strokeWidth={1.25} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-semibold leading-tight text-berry">
                  {item.name}
                </p>
                {item.lines.map((line) => (
                  <p key={line.label} className="text-xs text-cocoa/70">
                    <span className="font-semibold text-cocoa">{line.qty}×</span> {line.label}
                  </p>
                ))}
              </div>

              <span className="shrink-0 whitespace-nowrap font-semibold text-cocoa">
                {peso(item.subtotal)}
              </span>
            </li>
          ))}
        </ul>
        
        {/* Total */}
        <div className="flex items-baseline justify-between border-t-2 border-gold/50 bg-cream/60 px-5 py-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-cocoa">Total</span>

          {discount > 0 ? (
            <span className="flex items-baseline gap-2.5">
              <span className="font-price text-xl tabular-nums text-cocoa/45 line-through decoration-berry/50">
                {peso(total)}
              </span>
              <span className="font-price text-4xl font-semibold tabular-nums text-berry">
                {peso(final)}
              </span>
            </span>
          ) : (
            <span className="font-price text-4xl font-semibold tabular-nums text-berry">
              {peso(total)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

export default OrderSlipCard
