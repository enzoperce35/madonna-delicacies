import { useRef, useState } from 'react'
import { toJpeg } from 'html-to-image'
import { AlertTriangle, Check, Loader2, MessageCircle, RotateCcw } from 'lucide-react'
import OrderButtons from './OrderButtons'
import OrderSlipCard from './OrderSlipCard'
import { buildPublicId, saveOrder, uploadToCloudinary } from '../utils/submitOrder'

const NAME_KEY = 'madonna-messenger-name' // remembered on this device for next time

const loadName = () => {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

/**
 * items: [{ key, name, image, subtotal, lines: [{ qty, label }] }]
 */
export default function CheckoutFlow({ items, total, origin, onCancel, onSuccess, onClose }) {
  const [snapshot] = useState(items) // so clearing the bag later can't change this screen
  const [status, setStatus] = useState('review') // 'review' | 'ask' | 'sending' | 'done' | 'failed'
  const [name, setName] = useState(loadName)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const cardRef = useRef(null)
  const imageRef = useRef(null) // the finished image, reused if the customer retries
  const idRef = useRef(null) // the file name, made once
  const uploadRef = useRef(null) // the Cloudinary result, so a retry never uploads twice

  const submit = async () => {
    const clean = name.trim()
    if (clean.length < 2) {
      setError('Please enter your Messenger name.')
      return
    }
    setError('')
    setStatus('sending')

    // 1. Make the image (only once)
    if (!imageRef.current) {
      try {
        await document.fonts.ready
        imageRef.current = await toJpeg(cardRef.current, {
          quality: 0.92,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: '#fff9f0',
        })
        setImageUrl(imageRef.current)
      } catch (err) {
        console.error(err)
        setStatus('failed')
        return
      }
    }

    // 2. Upload it to Cloudinary, then 3. tell Rails
    try {
      if (!uploadRef.current) {
        if (!idRef.current) idRef.current = buildPublicId(clean)
        uploadRef.current = await uploadToCloudinary(imageRef.current, idRef.current)
      }
      const upload = uploadRef.current

      const saved = await saveOrder({
        messenger_name: clean,
        total,
        cloudinary_public_id: upload.public_id,
        items: snapshot.flatMap((item) =>
          item.lines.map((line) => ({ name: item.name, size: line.label, qty: line.qty }))
        ),
      })

      try {
        localStorage.setItem(NAME_KEY, clean)
      } catch {
        // Storage can be blocked in some in-app browsers; nothing to do
      }

      setResult({
        reference: saved?.reference ?? upload.public_id.split('/').pop().slice(-6).toUpperCase(),
      })
      onSuccess?.()
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('failed')
    }
  }

  const firstName = name.trim().split(' ')[0]

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm your order"
        className="fixed inset-0 z-[60] animate-expand overflow-y-auto bg-cream"
        style={{ transformOrigin: origin ? `${origin.x}px ${origin.y}px` : '100% 100%' }}
      >
        <div
          key={status}
          className="mx-auto flex min-h-full w-full max-w-md animate-fade-up flex-col justify-center gap-5 px-5"
          style={{
            paddingTop: 'max(2rem, env(safe-area-inset-top))',
            paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          }}
        >
          {/* ---------- Review: the order + Cancel / Confirm ---------- */}
          {status === 'review' && (
            <>
              <OrderSlipCard items={snapshot} total={total} />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onCancel}
                  className="inline-flex items-center justify-center rounded-full border-2 border-berry px-5 py-3 text-sm font-medium text-berry transition-colors hover:bg-berry hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStatus('ask')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-berry px-5 py-3 text-sm font-medium text-white shadow-lg shadow-berry/25 transition-all hover:-translate-y-0.5 hover:bg-berry-dark"
                >
                  <Check size={17} />
                  Confirm
                </button>
              </div>
            </>
          )}

          {/* ---------- Ask for the Messenger name ---------- */}
          {status === 'ask' && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
              className="space-y-5"
            >

              <label className="block">
                <span className="text-sm font-semibold text-cocoa">Your Messenger name</span>
                <input
                  autoFocus
                  type="text"
                  autoComplete="name"
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="mt-1.5 w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-base text-cocoa outline-none transition-colors placeholder:text-cocoa/35 focus:border-berry"
                />
              </label>

              {error && (
                <p role="alert" className="text-sm font-medium text-berry">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-berry px-8 py-4 text-base font-medium text-white shadow-lg shadow-berry/25 transition-all hover:-translate-y-0.5 hover:bg-berry-dark"
              >
                <Check size={20} />
                Send my order
              </button>

              <button
                type="button"
                onClick={() => setStatus('review')}
                className="mx-auto block text-sm text-cocoa/60 transition-colors hover:text-berry"
              >
                Back
              </button>
            </form>
          )}

          {/* ---------- Sending ---------- */}
          {status === 'sending' && (
            <div className="py-10 text-center">
              <Loader2 size={40} className="mx-auto animate-spin text-berry" />
              <p className="mt-5 font-display text-3xl font-semibold text-berry">
                Saving your order…
              </p>
              <p className="mt-2 text-sm text-cocoa/65">Please keep this page open.</p>
            </div>
          )}

          {/* ---------- Done: the customer still has to message us ---------- */}
          {status === 'done' && result && (
            <>
              <div className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <MessageCircle size={30} />
                </span>
                <h3 className="mt-4 text-4xl font-semibold text-berry">One more step!</h3>
                <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                  Thank you, {firstName}. Para malaman namin na may order ka, i-message mo kami sa Messenger. Click mo lang itong button  sa ilalim at linked na yan sa aming account.
                </p>
              </div>

              <div className="space-y-3">
                <OrderButtons fullWidth size="lg" newTab={false} label="Open Messenger now" />
                <p className="text-center text-xs leading-relaxed text-cocoa/55">
                  A quick "Hi, I just placed an order" is enough.
                </p>
              </div>
            </>
          )}

          {/* ---------- Failed ---------- */}
          {status === 'failed' && (
            <>
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <AlertTriangle size={26} />
                </span>
                <h3 className="mt-4 text-3xl font-semibold text-berry">We couldn't save it</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
                  Please check your connection and try again. You can also order on Messenger:
                  take a screenshot of your order below (or press and hold the image to save it)
                  and send it to us.
                </p>
              </div>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Your order"
                  className="mx-auto w-full rounded-2xl border border-cream-dark shadow-lg"
                />
              )}

              <div className="space-y-3">
                <button
                  onClick={submit}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-berry px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-berry/25 transition-all hover:-translate-y-0.5 hover:bg-berry-dark"
                >
                  <RotateCcw size={18} />
                  Try again
                </button>
                <OrderButtons fullWidth newTab={false} label="Go to Messenger" />
              </div>

              <button
                onClick={onClose}
                className="mx-auto text-sm text-cocoa/60 transition-colors hover:text-berry"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>

      {/* The order image, rendered off-screen so it can be saved with the customer's name on it */}
      <div aria-hidden="true" style={{ position: 'fixed', left: '-10000px', top: 0 }}>
        <OrderSlipCard
          ref={cardRef}
          items={snapshot}
          total={total}
          messengerName={name.trim()}
          fixedWidth
        />
      </div>
    </>
  )
}
