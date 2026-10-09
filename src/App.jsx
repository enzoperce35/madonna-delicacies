import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsGrid from './components/ProductsGrid'
import RecommendationModal from './components/RecommendationModal'

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)

  const openHelp = () => setHelpOpen(true)
  const closeHelp = () => setHelpOpen(false)

  return (
    <>
      <Navbar onHelpClick={openHelp} />
      <main>
        <Hero onHelpClick={openHelp} />
        <ProductsGrid onHelpClick={openHelp} />
      </main>
      <RecommendationModal open={helpOpen} onClose={closeHelp} />
    </>
  )
}
