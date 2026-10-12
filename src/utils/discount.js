// Progressive discount: none below ₱500, and bigger orders get a bigger percentage.

export const MIN_DISCOUNT_ORDER = 500

// [order total, discount percent]. The percent is blended smoothly between these points.
export const DISCOUNT_POINTS = [
  [500, 1.5],
  [600, 1.7],
  [1000, 1.9],
  [1600, 2.45],
  [2200, 3.2],
  [2500, 3.7],
  [4000, 4], // stays at 4% above this; add more rows to keep growing
]

export function discountPercent(total) {
  if (total < MIN_DISCOUNT_ORDER) return 0

  const last = DISCOUNT_POINTS[DISCOUNT_POINTS.length - 1]
  if (total >= last[0]) return last[1]

  for (let i = 1; i < DISCOUNT_POINTS.length; i++) {
    const [x0, p0] = DISCOUNT_POINTS[i - 1]
    const [x1, p1] = DISCOUNT_POINTS[i]
    if (total <= x1) return p0 + ((p1 - p0) * (total - x0)) / (x1 - x0)
  }
  return last[1]
}

// The discounted price is always rounded DOWN to the nearest multiple of this (₱10)
const ROUND_DOWN_TO = 10

// Works in whole centavos, so the rounding never picks up floating-point noise
export function applyDiscount(total) {
  const percent = discountPercent(total)

  // No discount (and no rounding) below the minimum order
  if (percent === 0) return { subtotal: total, percent: 0, discount: 0, final: total }

  const exactCentavos = total * 100 - Math.round(total * percent)
  const final = Math.floor(exactCentavos / (ROUND_DOWN_TO * 100)) * ROUND_DOWN_TO

  return { subtotal: total, percent, discount: total - final, final }
}

// The next milestone, for the "add ₱X more" nudge (null once the top rate is reached)
export function nextDiscountStep(total) {
  if (total < MIN_DISCOUNT_ORDER) {
    return { at: MIN_DISCOUNT_ORDER, percent: DISCOUNT_POINTS[0][1] }
  }
  const next = DISCOUNT_POINTS.find(([at]) => at > total)
  return next ? { at: next[0], percent: next[1] } : null
}
