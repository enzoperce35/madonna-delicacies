import { useEffect, useMemo, useState } from 'react'
import { Heart, Minus, Plus, Sparkles, X } from 'lucide-react'
import CheckoutFlow from './CheckoutFlow'
import { recommendByBudget } from '../utils/recommend'
import PriceSummary from './PriceSummary'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

const serves = (size) =>
  size.pax.min === size.pax.max ? size.pax.min : `${size.pax.min}–${size.pax.max}`

// Pieces when a size has them, otherwise how many it serves
const detail = (size) => (size.pieces ? `${size.pieces} pcs` : `Serves ${serves(size)}`)

const MIN_GUESTS = 10
const MAX_GUESTS = 200

const MIN_BUDGET = 500
const MAX_BUDGET = 200000
const BUDGET_STEP = 500

const stepButton =
  'shrink-0 rounded-full border border-cream-dark bg-white p-2.5 text-cocoa transition-colors hover:border-berry hover:text-berry disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream-dark disabled:hover:text-cocoa'

// Label + big number on one row, then  −  slider  +  underneath
function SliderField({ id, label, value, min, max, onChange, unit }) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <label htmlFor={id} className="text-sm font-semibold text-cocoa">
            {label}
          </label>
          {unit && <p className="mt-0.5 text-xs text-cocoa/55">{unit}</p>}
        </div>
        <p className="font-display text-3xl font-semibold leading-none text-cocoa sm:text-4xl">
          {value}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className={stepButton}
        >
          <Minus size={16} />
        </button>

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider min-w-0 flex-1"
          style={{ '--fill': `${percent}%` }}
        />

        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className={stepButton}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

export default function RecommendationModal({ open, onClose }) {
  const [guests, setGuests] = useState(10)
  const [kids, setKids] = useState(3)
  const [budget, setBudget] = useState(1000)
  const [pick, setPick] = useState(0)

  const [phase, setPhase] = useState('plan') // 'plan' → 'slip' (Step 1) → 'next' (Step 2)
  const [origin, setOrigin] = useState({ x: 0, y: 0 }) // where the full-screen view grows from

  const n = guests
  const kidsCount = Math.min(kids, n) // can never be more than the guests
  const b = Number(budget) || 0

  const result = useMemo(
    () => (b >= MIN_BUDGET ? recommendByBudget(n, kidsCount, b) : null),
    [n, kidsCount, b]
  )

  // Start from Option 1 whenever the inputs change
  useEffect(() => {
    setPick(0)
  }, [n, kidsCount, b])

  // Any change to the order goes back to the planner
  useEffect(() => {
    setPhase('plan')
  }, [n, kidsCount, b, pick])

  // Start fresh when the modal closes
  useEffect(() => {
    if (!open) setPhase('plan')
  }, [open])

  const spreads = result?.spreads
  const activeIndex = spreads ? Math.min(pick, spreads.length - 1) : 0
  const active = spreads ? spreads[activeIndex] : null

  const likeSet = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setPhase('checkout')
  }

    // "Cancel": close the planner and go back to the top of the homepage
    const cancel = () => {
      setPhase('plan')
      onClose()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

  // "Send screenshot" opens Messenger, so just reset and close
  const finish = () => {
    setPhase('plan')
    onClose()
  }

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setPhase('plan')
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

    /* ---------- Checkout: review → name → sending → done ---------- */
    if (phase === 'checkout' && active) {
      const slipItems = active.items.map(({ product, combo, subtotal }) => ({
        key: product.id,
        name: product.name,
        image: product.image,
        lines: combo.map(({ size, qty }) => ({ qty, label: `${size.name} · ${detail(size)}` })),
        subtotal,
      }))
  
      return (
        <CheckoutFlow
          items={slipItems}
          total={active.total}
          origin={origin}
          onCancel={cancel}
          onClose={finish}
        />
      )
    }

  /* ---------- The planner ---------- */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/60 p-4 backdrop-blur-sm sm:p-5"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cream-dark px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
              <Sparkles size={14} /> Party planner
            </p>
            <h2 id="help-title" className="mt-1 text-2xl font-semibold text-berry sm:text-3xl">
              Help Me Choose
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-cocoa/60 transition-colors hover:bg-cream-dark hover:text-cocoa"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overscroll-contain overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-5">
            {/* Guests */}
            <SliderField
              id="guests"
              label="How many people are eating?"
              value={n}
              min={MIN_GUESTS}
              max={MAX_GUESTS}
              onChange={setGuests}
            />

            {/* Kids */}
            <SliderField
              id="kids"
              label="How many of them are kids?"
              value={kidsCount}
              min={0}
              max={n}
              onChange={setKids}
              unit={`${kidsCount === 1 ? 'kid' : 'kids'} · ${n - kidsCount} ${n - kidsCount === 1 ? 'adult' : 'adults'
                }`}
            />

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="text-sm font-semibold text-cocoa">
                What's your budget?
              </label>
              {b >= MIN_BUDGET && (
                <p className="mt-0.5 text-xs text-cocoa/55">
                  About {peso(Math.round(b / n))} per guest
                </p>
              )}

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setBudget(Math.max(MIN_BUDGET, b - BUDGET_STEP))}
                  disabled={b <= MIN_BUDGET}
                  aria-label="Lower budget"
                  className={stepButton}
                >
                  <Minus size={16} />
                </button>

                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-xl text-cocoa/40">
                    ₱
                  </span>
                  <input
                    id="budget"
                    type="text"
                    inputMode="numeric"
                    value={budget === '' ? '' : Number(budget).toLocaleString('en-PH')}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '')
                      setBudget(digits === '' ? '' : Math.min(Number(digits), MAX_BUDGET))
                    }}
                    onBlur={() => b < MIN_BUDGET && setBudget(MIN_BUDGET)}
                    className="w-full rounded-2xl border border-cream-dark bg-white py-2 pl-9 pr-3 text-center font-display text-2xl font-semibold text-cocoa outline-none focus:border-berry"
                  />
                </div>

                <button
                  onClick={() =>
                    setBudget(Math.min(MAX_BUDGET, Math.max(MIN_BUDGET, b + BUDGET_STEP)))
                  }
                  aria-label="Raise budget"
                  className={stepButton}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Results */}
            {active ? (
              <div>
                {result.tooLow && (
                  <p className="mb-4 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cocoa/80">
                    {peso(b)} is a little under what we'd usually suggest for {n} guests. This
                    lighter spread is the closest we can put together. Message us and we'll see
                    what we can do!
                  </p>
                )}

                {/* Option chips */}
                {spreads.length > 1 && (
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {spreads.map((spread, i) => (
                      <button
                        key={spread.id}
                        onClick={() => setPick(i)}
                        className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-sm ${i === activeIndex
                            ? 'border-berry bg-berry text-white'
                            : 'border-cream-dark bg-white text-cocoa/70 hover:border-berry hover:text-berry'
                          }`}
                      >
                        {spread.label}
                      </button>
                    ))}
                  </div>
                )}

                <ul key={active.id} className="mt-2 animate-fade-up divide-y divide-cream-dark">
                  {active.items.map(({ product, tag, combo, subtotal }) => (
                    <li key={product.id} className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 font-display text-xl font-semibold leading-tight text-berry">
                          {product.name}
                        </p>
                        <span className="shrink-0 whitespace-nowrap font-semibold text-cocoa">
                          {peso(subtotal)}
                        </span>
                      </div>

                      <ul className="mt-2 space-y-1">
                        {combo.map(({ size, qty }) => (
                          <li
                            key={size.name}
                            className="flex items-baseline gap-2 text-sm text-cocoa/75"
                          >
                            <span className="w-8 shrink-0 font-semibold text-cocoa">{qty}×</span>
                            <span>
                              {size.name}
                              {size.pieces ? ` · ${size.pieces} pcs` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {tag && (
                        <span className="mt-2.5 inline-block rounded-full bg-mint-light px-2.5 py-0.5 text-xs font-medium text-cocoa/70">
                          {tag}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {n > 80 && (
                  <p className="mt-3 text-sm text-cocoa/70">
                    Planning a big event? Message us and we'll prepare a custom quote.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-cocoa/60">
                Enter a budget of {peso(MIN_BUDGET)} or more to see our suggestions.
              </p>
            )}
          </div>
        </div>

        {/* Sticky footer */}
        {active && (
          <div className="border-t border-cream-dark bg-white px-5 py-4 sm:px-6 sm:py-5">
            <PriceSummary subtotal={active.total} label="Estimated total" showNudge={false} />
            <p className="mt-1 text-xs text-cocoa/50">
              A friendly estimate. We'll confirm the final order with you.
            </p>

            <button
              onClick={likeSet}
              className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-berry px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-berry/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-berry-dark sm:py-4"
            >
              <Heart size={20} />
              I love this set
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
