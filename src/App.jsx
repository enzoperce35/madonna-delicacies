import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsGrid from './components/ProductsGrid'
import Footer from './components/Footer'
import RecommendationModal from './components/RecommendationModal'
import CartButton from './components/CartButton'
import CartSheet from './components/CartSheet'

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)

  const openHelp = () => setHelpOpen(true)
  const closeHelp = () => setHelpOpen(false)

  return (
    <CartProvider>
      <Navbar onHelpClick={openHelp} />
      <main>
        <Hero onHelpClick={openHelp} />
        <ProductsGrid onHelpClick={openHelp} />
      </main>
      <Footer onHelpClick={openHelp} />
      <RecommendationModal open={helpOpen} onClose={closeHelp} />
      <CartButton />
      <CartSheet />
    </CartProvider>
  )
}
