import { products } from '../data/products'
import { applyDiscount } from './discount'

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
  empanada:            { adult: 0.9, kid: 0.3 },
}

// YOUR food score (0 to 10). Higher = more likely to be recommended first.
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
    empanada:            8,
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

  const combo = []
  dp[needed].picks.forEach((size) => {
    const found = combo.find((c) => c.size === size)
    if (found) found.qty += 1
    else combo.push({ size, qty: 1 })
  })
  combo.sort((a, b) => capacityOf(b.size) - capacityOf(a.size))

  return { combo, cost: dp[needed].cost }
}

// Helper to force a specific size override for a product based on size name (e.g., 'medium', 'large', 'xl')
function getSpecificSizePrice(product, targetSizeName) {
  const foundSize = product.sizes.find(s => s.name.toLowerCase().includes(targetSizeName.toLowerCase())) || product.sizes[0]
  return {
    combo: [{ size: foundSize, qty: 1 }],
    cost: foundSize.price
  }
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
  const k = Math.min(1, Math.max(0, kidsCount / guests))

  const scored = products.map((product) => {
    const a = APPEAL[product.id]
    const foodScore = (FOOD_SCORE[product.id] ?? 5) / 10

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
    snack: inGroup(['Dimsum', 'Lumpia', 'Pastry']),
  }

  // Generate base combinations adhering to your specific guest rules
  let baseOptions = []
  
  if (guests === 10 || guests === 12) {
    // 1 medium pasta/noodles
    baseOptions = groups.base.map(item => [{ item, sizeName: 'medium' }])
  } else if ((guests >= 13 && guests <= 17 && guests !== 16) || guests === 20) {
    // 1 large pasta/noodles (covers 13, 15, 17, and 20)
    baseOptions = groups.base.map(item => [{ item, sizeName: 'large' }])
  } else if (guests === 18) {
    // 1 xl pasta/noodles
    baseOptions = groups.base.map(item => [{ item, sizeName: 'xl' }])
  } else if (guests === 25) {
    // 1 medium pasta/noodles and 1 large pasta/noodles (must be different products)
    for (let i = 0; i < groups.base.length; i++) {
      for (let j = 0; j < groups.base.length; j++) {
        if (i !== j) {
          baseOptions.push([
            { item: groups.base[i], sizeName: 'medium' },
            { item: groups.base[j], sizeName: 'large' }
          ])
        }
      }
    }
  } else if (guests === 30) {
    // 1 large pasta/noodles and 1 large pasta/noodles (must be different products)
    for (let i = 0; i < groups.base.length; i++) {
      for (let j = 0; j < groups.base.length; j++) {
        if (i !== j) {
          baseOptions.push([
            { item: groups.base[i], sizeName: 'large' },
            { item: groups.base[j], sizeName: 'large' }
          ])
        }
      }
    }
  } else {
    // Fallback standard combinations for other guest counts
    baseOptions = [0, 1, 2].flatMap((n) => combos(groups.base, n)).map(arr => arr.map(item => ({ item, sizeName: null })))
  }

  const chickenOptions = [0, 1, 2].flatMap((n) => combos(groups.chicken, n))
  const kakaninOptions = [0, 1].flatMap((n) => combos(groups.kakanin, n))
  const snackOptions = [0, 1, 2].flatMap((n) => combos(groups.snack, n))

  const cache = new Map()
  const priceItem = (baseEntry, scale) => {
    const { item, sizeName } = baseEntry
    const key = `${item.product.id}@${sizeName || 'default'}@${scale}`
    if (!cache.has(key)) {
      if (sizeName) {
        cache.set(key, getSpecificSizePrice(item.product, sizeName))
      } else {
        const share = (0.35 + 0.35 * item.appeal) * scale
        const needed = Math.max(1, Math.ceil(guests * share))
        cache.set(key, pickSizes(item.product.sizes, needed))
      }
    }
    return cache.get(key)
  }

  // Regular price item helper for non-base categories
  const priceStandardItem = (entry, scale) => {
    const key = `${entry.product.id}@${scale}`
    if (!cache.has(key)) {
      const share = (0.35 + 0.35 * entry.appeal) * scale
      const needed = Math.max(1, Math.ceil(guests * share))
      cache.set(key, pickSizes(entry.product.sizes, needed))
    }
    return cache.get(key)
  }

  const candidates = []
  for (const base of baseOptions) {
    for (const chicken of chickenOptions) {
      for (const kakanin of kakaninOptions) {
        for (const snack of snackOptions) {
          const baseEntriesRaw = base.map(b => b.item)
          const entries = [...baseEntriesRaw, ...chicken, ...kakanin, ...snack]
          
          if (entries.length < 2 || base.length + chicken.length === 0) continue

          const groupCount = [base, chicken, kakanin, snack].filter((g) => g.length).length
          const meanAppeal = entries.reduce((sum, e) => sum + e.appeal, 0) / entries.length
          const meanFood = entries.reduce((sum, e) => sum + e.foodScore, 0) / entries.length

          for (const scale of SCALES) {
            let totalCost = 0
            // Calculate base cost using specific sizing rules if applied
            for (const b of base) {
              totalCost += priceItem(b, scale).cost
            }
            // Calculate rest of the categories
            const nonBaseEntries = [...chicken, ...kakanin, ...snack]
            for (const nb of nonBaseEntries) {
              totalCost += priceStandardItem(nb, scale).cost
            }

            candidates.push({ base, nonBase: nonBaseEntries, entries, scale, total: totalCost, groupCount, meanAppeal, meanFood })
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
    items: [
      ...c.base.map((b) => {
        const { combo, cost } = priceItem(b, c.scale)
        return { product: b.item.product, tag: b.item.tag, combo, subtotal: cost }
      }),
      ...c.nonBase.map((e) => {
        const { combo, cost } = priceStandardItem(e, c.scale)
        return { product: e.product, tag: e.tag, combo, subtotal: cost }
      })
    ],
  })

  const fits = candidates.filter((c) => applyDiscount(c.total).final <= budget)

  if (fits.length === 0) {
    const cheapest = candidates.reduce((min, c) => (c.total < min.total ? c : min))
    return { spreads: [toSpread(cheapest, 0)], tooLow: true }
  }

  fits.forEach((c) => {
    c.score =
      c.meanAppeal * 3 +
      c.meanFood * FOOD_SCORE_WEIGHT +
      c.groupCount * 0.8 +
      c.entries.length * 0.25 +
      (applyDiscount(c.total).final / budget) * 2 -
      Math.abs(c.scale - 1) * 1.5
  })

  const bestBySet = new Map()
  fits.forEach((c) => {
    const key = c.entries.map((e) => e.product.id).sort().join('|')
    const current = bestBySet.get(key)
    if (!current || c.score > current.score) bestBySet.set(key, c)
  })
  const ranked = [...bestBySet.values()].sort((a, b) => b.score - a.score)

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
