// PLACEHOLDERS: replace names, descriptions, and prices with your real products.
// Every product uses the same 3 bilao sizes; adjust diameters/servings to match yours.

const sizes = (small, medium, large) => [
  { name: 'Small',  diameter: '10"', serves: { min: 6,  max: 8  }, price: small },
  { name: 'Medium', diameter: '14"', serves: { min: 10, max: 15 }, price: medium },
  { name: 'Large',  diameter: '18"', serves: { min: 20, max: 25 }, price: large },
]

export const products = [
  {
    id: 'pancit-palabok',
    name: 'Pancit Palabok',
    category: 'Noodles',
    description: 'Silky rice noodles under a rich shrimp sauce, crowned with egg, chicharon, and fresh calamansi.',
    image: null, // later: import from '../assets/images/products/palabok.jpg'
    sizes: sizes(450, 750, 1300),
  },
  {
    id: 'pancit-canton',
    name: 'Pancit Canton Guisado',
    category: 'Noodles',
    description: 'Wok-tossed egg noodles with crisp vegetables and savory meats, the celebration classic for long life.',
    image: null,
    sizes: sizes(400, 700, 1200),
  },
  {
    id: 'pancit-bihon',
    name: 'Pancit Bihon',
    category: 'Noodles',
    description: 'Light, fragrant rice noodles sautéed with garlic, chicken, and vegetables. Easy to love at any table.',
    image: null,
    sizes: sizes(400, 700, 1200),
  },
  {
    id: 'sotanghon',
    name: 'Sotanghon Guisado',
    category: 'Noodles',
    description: 'Glass noodles simmered in golden annatto broth with chicken and mushrooms. Comforting and glossy.',
    image: null,
    sizes: sizes(420, 720, 1250),
  },
  {
    id: 'party-spaghetti',
    name: 'Party Spaghetti',
    category: 'Pasta',
    description: 'Sweet-style Filipino spaghetti with hotdog slices and a generous cheese topping. A kid-approved favorite.',
    image: null,
    sizes: sizes(450, 780, 1350),
  },
  {
    id: 'baked-macaroni',
    name: 'Baked Macaroni',
    category: 'Pasta',
    description: 'Creamy baked macaroni with a golden, bubbly cheese crust and a rich meat sauce.',
    image: null,
    sizes: sizes(480, 820, 1400),
  },
  {
    id: 'puto-kutsinta',
    name: 'Puto & Kutsinta Medley',
    category: 'Kakanin',
    description: 'Soft steamed puto and chewy kutsinta, served with freshly grated coconut.',
    image: null,
    sizes: sizes(350, 600, 1050),
  },
  {
    id: 'biko',
    name: 'Biko',
    category: 'Kakanin',
    description: 'Sticky rice slow-cooked in coconut milk and brown sugar, finished with caramelized latik.',
    image: null,
    sizes: sizes(380, 650, 1100),
  },
  {
    id: 'sapin-sapin',
    name: 'Sapin-Sapin',
    category: 'Kakanin',
    description: 'Colorful, layered coconut rice cake with a soft, chewy bite. Festive on every table.',
    image: null,
    sizes: sizes(400, 680, 1150),
  },
]
