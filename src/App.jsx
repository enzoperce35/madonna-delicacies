import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false) // the modal will use this later

  return (
    <>
      <Navbar onHelpClick={() => setHelpOpen(true)} />
      <main>
        <Hero onHelpClick={() => setHelpOpen(true)} />
      </main>
    </>
  )
}
