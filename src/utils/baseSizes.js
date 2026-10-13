// Pasta & noodles always come first in a recommendation, sized by how many people are eating.

// How many guests one size of pasta/noodles is meant to cover
export const BASE_CAPACITY = { Medium: 12, Large: 17, XL: 22 }

const SIZE_ORDER = ['Medium', 'Large', 'XL']

// Force a specific set for an exact headcount, e.g. { 20: ['Large'] }
const OVERRIDES = {}

const biggestFirst = (a, b) => SIZE_ORDER.indexOf(b) - SIZE_ORDER.indexOf(a)

// Every combination of `count` sizes, e.g. ['Medium', 'Large']
function sizeCombos(count, start = 0) {
  if (count === 0) return [[]]
  return SIZE_ORDER.slice(start).flatMap((size, i) =>
    sizeCombos(count - 1, start + i).map((rest) => [size, ...rest])
  )
}

// Returns the sizes to use, biggest first (one size per pasta/noodle dish)
export function baseSizesFor(guests, maxDishes = 4) {
  if (OVERRIDES[guests]) return [...OVERRIDES[guests]].sort(biggestFirst)

  // Use as few dishes as possible, and the smallest combination that covers everyone
  for (let count = 1; count <= maxDishes; count++) {
    const fitting = sizeCombos(count)
      .map((sizes) => ({
        sizes,
        capacity: sizes.reduce((sum, size) => sum + BASE_CAPACITY[size], 0),
      }))
      .filter((option) => option.capacity >= guests)
      .sort(
        (a, b) =>
          a.capacity - b.capacity ||
          SIZE_ORDER.indexOf(a.sizes.at(-1)) - SIZE_ORDER.indexOf(b.sizes.at(-1))
      )

    if (fitting.length) return [...fitting[0].sizes].sort(biggestFirst)
  }

  // Very large groups: every pasta/noodle dish in XL, and the other dishes make up the rest
  return Array(maxDishes).fill('XL')
}
