import { products } from '../data/products'

// How much each dish appeals to adults vs. kids (0 to 1). Tweak freely!
const APPEAL = {
  palabok:             { adult: 0.9, kid: 0.4 },
  carbonara:           { adult: 0.7, kid: 0.4 },
  spaghetti:           { adult: 0.6, kid: 1.0 },
  'pansit-bihon':      { adult: 1.0, kid: 0.3 },
  puto:                { adult: 0.8, kid: 0.5 },
  'chicken-fillet':    { adult: 0.8, kid: 1.0 },
  'chicken-wings':     { adult: 0.8, kid: 0.8 },
  siomai:              { adult: 0.7, kid: 0.3 },
  'lumpiang-shanghai': { adult: 0.8, kid: 0.8 },
}

// YOUR food score (0 to 10). Higher = more likely to be recommended first.
// These are placeholders: set them to your real bestsellers!
const FOOD_SCORE = {
    palabok:             10,
    carbonara:           9,
    spaghetti:           8,
    'pansit-bihon':      6,
    puto:                8,
    'chicken-fillet':    8,
    'chicken-wings':     7,
    siomai:              5,
    'lumpiang-shanghai': 7,
  }
  
// How strongly the food score affects ranking (3 = as strong as kid/adult appeal)
const FOOD_SCORE_WEIGHT = 3

// Portion levels to try: below 0.8 = lighter, 0.8 to 1.1 = standard, 1.15+ = generous
const SCALES = [0.6, 0.7, 0.8, 0.9, 1.0, 1.15, 1.3]

// How many options to show at most
const MAX_OPTIONS = 4

// How many people one bilao size feeds (middle of its pax range)
const capacityOf = (size) => Math.floor((size.pax.min + size.pax.max) / 2)

// Cheapest mix of sizes that feeds at least `needed` people
function pickSizes(sizes, needed) {
  const dp = [{ cost: 0, count: 0, picks: [] }]
  for (let i = 1; i <= needed; i++) {
    let best = null
    for (const size of sizes) {
      const prev = dp[Math.max(0, i - capacityOf(size))]
      const cost = prev.cost + size.price
      const count = prev.count + 1
      if (!best || cost < best.cost || (cost === best.cost && count < best.count)) {
        best = { cost, count, picks: [...prev.picks, size] }
      }
    }
    dp[i] = best
  }

  // Group repeated sizes: [Large, Large, Medium] -> Large x2, Medium x1
  const combo = []
  dp[needed].picks.forEach((size) => {
    const found = combo.find((c) => c.size === size)
    if (found) found.qty += 1
    else combo.push({ size, qty: 1 })
  })
  combo.sort((a, b) => capacityOf(b.size) - capacityOf(a.size))

  return { combo, cost: dp[needed].cost }
}

// All ways to choose `size` items from `list`
const combos = (list, size) => {
  if (size === 0) return [[]]
  if (list.length < size) return []
  const [first, ...rest] = list
  return [
    ...combos(rest, size - 1).map((c) => [first, ...c]),
    ...combos(rest, size),
  ]
}

export function recommendByBudget(guests, kidsCount, budget) {
  // Exact share of the crowd that is kids (0 to 1)
  const k = Math.min(1, Math.max(0, kidsCount / guests))

  const scored = products.map((product) => {
    const a = APPEAL[product.id]
    const foodScore = (FOOD_SCORE[product.id] ?? 5) / 10 // 0 to 1

    return {
      product,
      foodScore,
      appeal: a.adult * (1 - k) + a.kid * k,
      tag:
        foodScore >= 0.9
          ? 'House favorite'
          : k >= 0.4 && a.kid >= 0.8
            ? "Kids' favorite"
            : a.adult >= 0.9
              ? 'Party classic'
              : null,
    }
  })

  const inGroup = (categories) =>
    scored.filter((s) => categories.includes(s.product.category))

  const groups = {
    base: inGroup(['Noodles', 'Pasta']),
    chicken: inGroup(['Chicken']),
    kakanin: inGroup(['Kakanin']),
    snack: inGroup(['Dimsum', 'Lumpia']),
  }

  // Every way to pick dishes within each group (including none)
  const options = {
    base: [0, 1, 2].flatMap((n) => combos(groups.base, n)),
    chicken: [0, 1, 2].flatMap((n) => combos(groups.chicken, n)),
    kakanin: [0, 1].flatMap((n) => combos(groups.kakanin, n)),
    snack: [0, 1, 2].flatMap((n) => combos(groups.snack, n)),
  }

  // Price of one dish at one portion level (cached)
  const cache = new Map()
  const priceItem = (entry, scale) => {
    const key = `${entry.product.id}@${scale}`
    if (!cache.has(key)) {
      // Guests share several dishes, so each dish feeds part of the crowd.
      // More-loved dishes get a bigger share.
      const share = (0.35 + 0.35 * entry.appeal) * scale
      const needed = Math.max(1, Math.ceil(guests * share))
      cache.set(key, pickSizes(entry.product.sizes, needed))
    }
    return cache.get(key)
  }

  // Try every dish combination at every portion level
  const candidates = []
  for (const base of options.base) {
    for (const chicken of options.chicken) {
      for (const kakanin of options.kakanin) {
        for (const snack of options.snack) {
          const entries = [...base, ...chicken, ...kakanin, ...snack]
          // Need at least 2 dishes, and at least one noodle/pasta or chicken main
          if (entries.length < 2 || base.length + chicken.length === 0) continue

          const groupCount = [base, chicken, kakanin, snack].filter((g) => g.length).length
          const meanAppeal = entries.reduce((sum, e) => sum + e.appeal, 0) / entries.length
          const meanFood = entries.reduce((sum, e) => sum + e.foodScore, 0) / entries.length

          for (const scale of SCALES) {
            const total = entries.reduce((sum, e) => sum + priceItem(e, scale).cost, 0)
            candidates.push({ entries, scale, total, groupCount, meanAppeal, meanFood })
          }
        }
      }
    }
  }

  const toSpread = (c, index) => ({
    id: `option-${index + 1}`,
    label: `Option ${index + 1}`,
    total: c.total,
    portion:
      c.scale < 0.8 ? 'Lighter portions' : c.scale >= 1.15 ? 'Generous portions' : 'Standard portions',
    items: c.entries.map((e) => {
      const { combo, cost } = priceItem(e, c.scale)
      return { product: e.product, tag: e.tag, combo, subtotal: cost }
    }),
  })

  // Keep only what fits the budget
  const fits = candidates.filter((c) => c.total <= budget)

  // Budget too low: show the closest (cheapest) spread instead of nothing
  if (fits.length === 0) {
    const cheapest = candidates.reduce((min, c) => (c.total < min.total ? c : min))
    return { spreads: [toSpread(cheapest, 0)], tooLow: true }
  }

  // Score what fits: loved dishes, variety, and making good use of the budget
  fits.forEach((c) => {
    c.score =
    c.meanAppeal * 3 +
    c.meanFood * FOOD_SCORE_WEIGHT +
    c.groupCount * 0.8 +
    c.entries.length * 0.25 +
    (c.total / budget) * 2 -
    Math.abs(c.scale - 1) * 1.5
  })

  // Keep the best portion level for each distinct set of dishes
  const bestBySet = new Map()
  fits.forEach((c) => {
    const key = c.entries.map((e) => e.product.id).sort().join('|')
    const current = bestBySet.get(key)
    if (!current || c.score > current.score) bestBySet.set(key, c)
  })
  const ranked = [...bestBySet.values()].sort((a, b) => b.score - a.score)

  // Pick the top options that are meaningfully different from each other
  const difference = (a, b) => {
    let d = 0
    a.forEach((id) => !b.has(id) && d++)
    b.forEach((id) => !a.has(id) && d++)
    return d
  }
  const picked = []
  for (const c of ranked) {
    c.ids = new Set(c.entries.map((e) => e.product.id))
    if (picked.every((p) => difference(p.ids, c.ids) >= 2)) picked.push(c)
    if (picked.length === MAX_OPTIONS) break
  }

  return { spreads: picked.map(toSpread), tooLow: false }
}
