const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

// "orders/juan-dela-cruz-20261012-143015123": the customer's name plus the exact time
export function buildPublicId(name) {
  const slug =
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // drops accents, so "Niño" becomes "nino"
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40)
      .replace(/-+$/g, '') || 'customer'

  const d = new Date()
  const pad = (n, length = 2) => String(n).padStart(length, '0')
  const stamp =
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${pad(d.getMilliseconds(), 3)}`

  return `orders/${slug}-${stamp}`
}

// Uploads the order image (a data URL) and returns Cloudinary's response ({ public_id, ... })
export async function uploadToCloudinary(dataUrl, publicId) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Check VITE_CLOUDINARY_* in your env file.')
  }

  const body = new FormData()
  body.append('file', dataUrl)
  body.append('upload_preset', UPLOAD_PRESET)
  body.append('public_id', publicId)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
    signal: AbortSignal.timeout?.(30000),
  })
  if (!response.ok) throw new Error(`Cloudinary upload failed: ${await response.text()}`)
  return response.json()
}

// Saves the Messenger name and Cloudinary id in your Rails backend. Returns null if no backend is configured.
export async function saveOrder({ messenger_name, cloudinary_public_id }) {
  if (!API_URL) return null

  const response = await fetch(`${API_URL}/order_images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      order_image: { messenger_name, image_public_id: cloudinary_public_id },
    }),
    signal: AbortSignal.timeout?.(20000),
  })
  if (!response.ok) throw new Error(`Saving the order failed (${response.status})`)
  return response.json()
}
