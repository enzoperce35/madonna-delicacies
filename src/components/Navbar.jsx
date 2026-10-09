import { MessageCircle, Sparkles } from 'lucide-react'
import logo from '../assets/images/logo.png'
import { siteConfig } from '../data/siteConfig'

const links = [
  { label: 'Our Products', href: '#products' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onHelpClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-5">
        <a href="#top" aria-label={siteConfig.name}>
          <img src={logo} alt={`${siteConfig.name} logo`} className="h-14 w-auto sm:h-16" />
        </a>

        {/* Phones & small tablets: jump to the products */}
        <a
          href="#products"
          className="py-2.5 text-sm font-medium text-berry transition-colors hover:text-berry-dark md:hidden"
        >
          Our Products
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
      </nav>
    </header>
  )
}
