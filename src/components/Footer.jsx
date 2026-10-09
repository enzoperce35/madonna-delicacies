import { Clock, Sparkles } from 'lucide-react'
import OrderButtons from './OrderButtons'
import logo from '../assets/images/logo.png'
import { siteConfig } from '../data/siteConfig'

// Inline Facebook icon (brand icons are no longer bundled with lucide-react)
function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const quickLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Our Bilao', href: '#products' },
]

export default function Footer({ onHelpClick }) {
  return (
    <footer id="contact" className="bg-cocoa text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="inline-block rounded-2xl bg-cream px-4 py-2">
            <img src={logo} alt={`${siteConfig.name} logo`} className="h-16 w-auto" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            Artisan bilao spreads for every gathering and celebration, made fresh and
            made to share.
          </p>

          {siteConfig.facebookUrl && (
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-gold-light"
            >
              <FacebookIcon />
              Follow us on Facebook
            </a>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-2xl font-semibold text-gold-light">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-cream/80 transition-colors hover:text-gold-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={onHelpClick}
                className="inline-flex items-center gap-1.5 text-cream/80 transition-colors hover:text-gold-light"
              >
                <Sparkles size={15} />
                Help Me Choose
              </button>
            </li>
          </ul>
        </div>

        {/* Hours & ordering */}
        <div>
          <h3 className="text-2xl font-semibold text-gold-light">Place Your Order</h3>

          <p className="mt-4 inline-flex items-center gap-2 text-sm text-cream/80">
            <Clock size={16} className="text-gold" />
            Open {siteConfig.hours}
          </p>

          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            We take orders through Messenger so every detail is in writing.
          </p>

          <OrderButtons variant="dark" className="mt-5" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
