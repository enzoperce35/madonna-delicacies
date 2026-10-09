import { useState } from 'react'
import { Menu, X, MessageCircle, Sparkles } from 'lucide-react'
import logo from '../assets/images/logo.png'
import { siteConfig } from '../data/siteConfig'

const links = [
  { label: 'Our Bilao', href: '#products' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onHelpClick }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
        <a href="#top" aria-label={siteConfig.name}>
          <img src={logo} alt={`${siteConfig.name} logo`} className="h-14 w-auto sm:h-16" />
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cocoa/80 transition-colors hover:text-berry"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onHelpClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-berry hover:text-berry-dark"
          >
            <Sparkles size={16} />
            Help Me Choose
          </button>
          <a
            href={siteConfig.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-berry px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-berry/20 transition-colors hover:bg-berry-dark"
          >
            <MessageCircle size={16} />
            Order on Messenger
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 text-cocoa md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-1 border-t border-cream-dark bg-cream px-5 pb-5 pt-3 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-base font-medium text-cocoa"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              onHelpClick()
            }}
            className="flex items-center gap-2 py-2.5 text-base font-medium text-berry"
          >
            <Sparkles size={18} />
            Help Me Choose
          </button>
          <a
            href={siteConfig.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-berry py-3 font-medium text-white shadow-md shadow-berry/20"
          >
            <MessageCircle size={18} />
            Order on Messenger
          </a>
        </div>
      )}
    </header>
  )
}
