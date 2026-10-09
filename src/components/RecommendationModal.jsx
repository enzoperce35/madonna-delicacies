import { useEffect, useMemo, useState } from 'react'
import { X, Minus, Plus, Sparkles } from 'lucide-react'
import OrderButtons from './OrderButtons'
import { recommendByBudget } from '../utils/recommend'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

const MIN_GUESTS = 10
const MAX_GUESTS = 200

const MIN_BUDGET = 500
const MAX_BUDGET = 200000
const BUDGET_STEP = 500

const stepButton =
  'rounded-full border border-cream-dark bg-white p-3 text-cocoa transition-colors hover:border-berry hover:text-berry disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream-dark disabled:hover:text-cocoa'

// A big number with − / + buttons and a slider underneath
function SliderField({ id, label, value, min, max, onChange, unit }) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-cocoa">
        {label}
      </label>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className={stepButton}
        >
          <Minus size={18} />
        </button>

        <div className="text-center">
          <p className="font-display text-5xl font-semibold leading-none text-cocoa">{value}</p>
          <p className="mt-1.5 text-xs text-cocoa/55">{unit}</p>
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className={stepButton}
        >
          <Plus size={18} />
        </button>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider mt-5"
        style={{ '--fill': `${percent}%` }}
      />
      <div className="mt-1.5 flex justify-between text-xs text-cocoa/40">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default function RecommendationModal({ open, onClose }) {
  const [guests, setGuests] = useState(20)
  const [kids, setKids] = useState(5)
  const [budget, setBudget] = useState(5000)
  const [pick, setPick] = useState(0)

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

  const spreads = result?.spreads
  const activeIndex = spreads ? Math.min(pick, spreads.length - 1) : 0
  const active = spreads ? spreads[activeIndex] : null

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-cocoa/60 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cream-dark px-6 py-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
              <Sparkles size={14} /> Party planner
            </p>
            <h2 id="help-title" className="mt-1 text-3xl font-semibold text-berry">
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
        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          {/* Guests */}
          <SliderField
            id="guests"
            label="How many people are eating?"
            value={n}
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            onChange={setGuests}
            unit="guests"
          />

          {/* Kids */}
          <SliderField
            id="kids"
            label="How many of them are kids?"
            value={kidsCount}
            min={0}
            max={n}
            onChange={setKids}
            unit={`${kidsCount === 1 ? 'kid' : 'kids'} · ${n - kidsCount} ${
              n - kidsCount === 1 ? 'adult' : 'adults'
            }`}
          />

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="text-sm font-semibold text-cocoa">
              What's your budget?
            </label>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setBudget(Math.max(MIN_BUDGET, b - BUDGET_STEP))}
                disabled={b <= MIN_BUDGET}
                aria-label="Lower budget"
                className={stepButton}
              >
                <Minus size={18} />
              </button>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl text-cocoa/40">
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
                  className="w-36 rounded-2xl border border-cream-dark bg-white py-3 pl-9 pr-3 text-center font-display text-3xl font-semibold text-cocoa outline-none focus:border-berry"
                />
              </div>
              <button
                onClick={() => setBudget(Math.min(MAX_BUDGET, Math.max(MIN_BUDGET, b + BUDGET_STEP)))}
                aria-label="Raise budget"
                className={stepButton}
              >
                <Plus size={18} />
              </button>
            </div>
            {b >= MIN_BUDGET && (
              <p className="mt-2 text-xs text-cocoa/50">About {peso(Math.round(b / n))} per guest</p>
            )}
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
                      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        i === activeIndex
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
                  <li key={product.id} className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <p className="font-display text-xl font-semibold text-berry">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-sm text-cocoa/75">
                        {combo
                          .map(
                            ({ size, qty }) =>
                              `${qty} × ${size.name}${size.pieces ? ` (${size.pieces} pcs)` : ''}`
                          )
                          .join(' + ')}
                      </p>
                      {tag && (
                        <span className="mt-2 inline-block rounded-full bg-mint-light px-2.5 py-0.5 text-xs font-medium text-cocoa/70">
                          {tag}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 font-semibold text-cocoa">{peso(subtotal)}</span>
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

        {/* Sticky footer */}
        {active && (
          <div className="border-t border-cream-dark bg-white px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-cocoa/70">Estimated total</span>
              <span className="font-display text-3xl font-semibold text-berry">
                {peso(active.total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-cocoa/50">
              A friendly estimate. We'll confirm the final order with you.
            </p>
            <OrderButtons className="mt-4" />
          </div>
        )}
      </div>
    </div>
  )
}
