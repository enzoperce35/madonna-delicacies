// Auto-load every image in assets/images/products, matched by filename = product id
const images = import.meta.glob('../assets/images/products/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const imageFor = (id) => {
  const match = Object.entries(images).find(
    ([path]) => path.split('/').pop().replace(/\.\w+$/, '') === id
  )
  return match ? match[1] : null
}

// pax = a number (e.g. 10) or a [min, max] range (e.g. [15, 20])
// pieces = optional piece count shown next to the size name
const s = (name, price, pax, pieces = null) => ({
  name,
  price,
  pieces,
  pax: Array.isArray(pax) ? { min: pax[0], max: pax[1] } : { min: pax, max: pax },
})

// Lumpiang Shanghai: a standard gathering is 3-6 pcs per person
const lumpiaPax = (pcs) => [Math.round(pcs / 6), Math.round(pcs / 3)]

const baseProducts = [
  {
    id: 'palabok',
    name: 'Palabok',
    category: 'Noodles',
    description: 'Silky noodles under a rich, savory sauce with all the classic toppings. A fiesta staple.',
    image: null, // later: import from '../assets/images/products/palabok.jpg'
    sizes: [s('Medium', 500, 10), s('Large', 700, 15), s('XL', 850, 20)],
  },
  {
    id: 'carbonara',
    name: 'Carbonara',
    category: 'Pasta',
    description: 'Creamy, comforting pasta that disappears first at every party.',
    image: null,
    sizes: [s('Medium', 550, 10), s('Large', 750, 15), s('XL', 950, 20)],
  },
  {
    id: 'spaghetti',
    name: 'Spaghetti',
    category: 'Pasta',
    description: 'Sweet-style Filipino party spaghetti, a kid-approved celebration favorite.',
    image: null,
    sizes: [s('Medium', 550, 10), s('Large', 750, 15), s('XL', 950, 20)],
  },
  {
    id: 'pansit-bihon',
    name: 'Pansit Bihon',
    category: 'Noodles',
    description: 'Light, fragrant noodles sautéed with vegetables. A wish for long life on every table.',
    image: null,
    sizes: [s('Medium', 600, 10), s('Large', 850, 15), s('XL', 1050, 20)],
  },
  {
    id: 'puto',
    name: 'Puto',
    category: 'Kakanin',
    description: 'Soft, fluffy steamed rice cakes. The perfect sweet companion to any savory dish.',
    image: null,
    sizes: [
      s('Medium', 300, [15, 20], 35),
      s('Large', 400, [25, 30], 50),
      s('XL', 550, [30, 40], 70),
    ],
  },
  {
    id: 'chicken-fillet',
    name: 'Chicken Fillet',
    category: 'Chicken',
    description: 'Golden, tender chicken fillet that everyone from kids to lolas will reach for.',
    image: null,
    sizes: [
      s('Small', 320, [5, 7]),
      s('Medium', 610, [12, 15]),
      s('Large', 900, [18, 22]),
      s('XL', 1200, [25, 30]),
    ],
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    category: 'Chicken',
    description: 'Juicy, flavorful wings piled high. Great for barkada nights and big family tables.',
    image: null,
    sizes: [
      s('Medium', 730, [7, 10], 30),
      s('Large', 900, [10, 14], 40),
      s('XL', 1100, [13, 18], 50),
    ],
  },
  {
    id: 'siomai',
    name: 'Siomai',
    category: 'Dimsum',
    description: 'Plump, savory dumplings, steamed and ready to share. Bite-sized and easy to love.',
    image: null,
    sizes: [
      s('Medium', 400, [10, 12], 50),
      s('Large', 600, [15, 18], 75),
      s('XL', 800, [20, 25], 100),
    ],
  },
  {
    id: 'lumpiang-shanghai',
    name: 'Lumpiang Shanghai',
    category: 'Lumpia',
    description: 'Crisp, golden rolls packed with savory filling. The party snack nobody can stop at one.',
    image: null,
    sizes: [
      s('Medium', 500, lumpiaPax(72), 72),
      s('Large', 750, lumpiaPax(108), 108),
      s('XL', 1000, lumpiaPax(144), 144),
    ],
  },
]

export const products = baseProducts.map((product) => ({
  ...product,
  image: imageFor(product.id),
}))
