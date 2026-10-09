import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import {
  X,
  Minus,
  Plus,
  Sparkles,
  Image as ImageIcon,
  Download,
  Share2,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import OrderButtons from './OrderButtons'
import OrderImageCard from './OrderImageCard'
import { recommendByBudget } from '../utils/recommend'

const peso = (amount) => `₱${amount.toLocaleString('en-PH')}`

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

  const [orderImage, setOrderImage] = useState(null) // data URL of the finished image
  const [making, setMaking] = useState(false)
  const [error, setError] = useState('')
  const cardRef = useRef(null)

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

  // Any change to the order makes the old image out of date
  useEffect(() => {
    setOrderImage(null)
    setError('')
  }, [n, kidsCount, b, pick])

  // Start fresh when the modal closes
  useEffect(() => {
    if (!open) setOrderImage(null)
  }, [open])

  const spreads = result?.spreads
  const activeIndex = spreads ? Math.min(pick, spreads.length - 1) : 0
  const active = spreads ? spreads[activeIndex] : null

  // Turn the hidden order card into a PNG
  const makeImage = async () => {
    if (!cardRef.current) return
    setMaking(true)
    setError('')
    try {
      await document.fonts.ready
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#fff9f0',
      })
      setOrderImage(dataUrl)
    } catch {
      setError("Sorry, we couldn't create the image. Please take a screenshot of this screen instead.")
    } finally {
      setMaking(false)
    }
  }

  /// Facebook / Messenger / Instagram open links in an in-app browser
  // that usually can't save or share files
  const inAppBrowser =
    typeof navigator !== 'undefined' &&
    /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram/i.test(navigator.userAgent)

  // Phones can share the image straight to Messenger
  const canShare =
    !inAppBrowser &&
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'

  const shareImage = async () => {
    try {
      const blob = await (await fetch(orderImage)).blob()
      const file = new File([blob], 'madonna-delicacies-order.png', { type: 'image/png' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My Madonna Delicacies order' })
      }
    } catch {
      // Cancelled or unsupported: they can still use "Save image"
    }
  }

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
          {orderImage ? (
            /* ---------- Image ready view ---------- */
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-3xl font-semibold text-berry">Your order image is ready!</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
                  {inAppBrowser
                    ? 'Take a screenshot of this screen, or press and hold the image to save it. Then send it to us on Messenger.'
                    : 'You can send this screenshot to us on Messenger. Save it first, then attach it in the chat.'}
                </p>
              </div>

              <img
                src={orderImage}
                alt="Your order summary"
                className="mx-auto w-full rounded-2xl border border-cream-dark shadow-lg"
              />

              <p className="text-center text-xs leading-relaxed text-cocoa/55">
                {inAppBrowser
                  ? 'Tip: for the easiest saving, tap the ⋯ menu in Facebook and choose "Open in browser". '
                  : 'On iPhone, press and hold the image to save it. '}
                In Messenger, please also tell us your name, the date and time you need it, and
                pickup or delivery details.
              </p>
            </div>
          ) : (
            /* ---------- Planner view ---------- */
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
          )}
        </div>

        {/* Sticky footer */}
        {active && (
          <div className="border-t border-cream-dark bg-white px-5 py-4 sm:px-6 sm:py-5">
            {orderImage ? (
              <div className="space-y-3">
                {/* Save / Share only work outside Facebook's in-app browser */}
                {!inAppBrowser && (
                  <div className={`grid gap-3 ${canShare ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <a
                      href={orderImage}
                      download="madonna-delicacies-order.png"
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-berry px-5 py-3 text-sm font-medium text-berry transition-colors hover:bg-berry hover:text-white"
                    >
                      <Download size={17} />
                      Save image
                    </a>
                    {canShare && (
                      <button
                        onClick={shareImage}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-berry px-5 py-3 text-sm font-medium text-berry transition-colors hover:bg-berry hover:text-white"
                      >
                        <Share2 size={17} />
                        Share
                      </button>
                    )}
                  </div>
                )}

                <OrderButtons fullWidth size="lg" label="Open Messenger to send it" />

                <button
                  onClick={() => setOrderImage(null)}
                  className="mx-auto flex items-center gap-1.5 text-sm text-cocoa/60 transition-colors hover:text-berry"
                >
                  <ArrowLeft size={14} />
                  Edit my order
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-cocoa/70">Estimated total</span>
                  <span className="font-display text-3xl font-semibold text-berry">
                    {peso(active.total)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-cocoa/50">
                  A friendly estimate. We'll confirm the final order with you.
                </p>

                <button
                  onClick={makeImage}
                  disabled={making}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-berry px-8 py-3.5 sm:py-4 text-base font-medium text-white shadow-lg shadow-berry/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-berry-dark disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {making ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                  {making ? 'Creating your image…' : 'Create my order image'}
                </button>
                <p className="mt-2 text-center text-xs text-cocoa/50 hidden sm:block">
                  You'll get an image of this list to send to us on Messenger.
                </p>
                {error && <p className="mt-2 text-center text-xs text-berry">{error}</p>}
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden order card: this is what gets turned into the image */}
      {active && (
        <div aria-hidden="true" style={{ position: 'fixed', left: '-10000px', top: 0 }}>
          <OrderImageCard
            ref={cardRef}
            items={active.items}
            total={active.total}
            guests={n}
            kids={kidsCount}
          />
        </div>
      )}
    </div>
  )
}
