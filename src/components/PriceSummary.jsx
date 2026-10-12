import { applyDiscount } from '../utils/discount'
import { peso } from '../utils/format'

export default function PriceSummary({ subtotal, label = 'Total' }) {
  const { discount, final } = applyDiscount(subtotal)

  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-cocoa/70">{label}</span>

      {discount > 0 ? (
        <span className="flex items-baseline gap-2">
          <span className="font-price text-lg tabular-nums text-cocoa/45 line-through decoration-berry/50">
            {peso(subtotal)}
          </span>
          <span className="font-price text-3xl font-semibold tabular-nums text-berry">
            {peso(final)}
          </span>
        </span>
      ) : (
        <span className="font-price text-3xl font-semibold tabular-nums text-berry">
          {peso(subtotal)}
        </span>
      )}
    </div>
  )
}
