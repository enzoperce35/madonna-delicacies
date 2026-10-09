import { ArrowRight, ChefHat, Clock, Users } from 'lucide-react'
import OrderButtons from './OrderButtons'
import { siteConfig } from '../data/siteConfig'
import heroPhoto from '../assets/images/hero.webp'

export default function Hero({ onHelpClick }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-mint-light blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:py-14 md:grid-cols-2 md:gap-12 md:py-24">
        {/* Text */}
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
            <span className="h-px w-8 bg-gold" />
            Artisan Bilao Spreads
          </p>

          <h1 className="text-[2.75rem] font-semibold leading-[1.05] text-berry sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>

          <h2 className="mt-5 text-2xl font-medium italic leading-snug text-cocoa sm:text-3xl">
            Bilao spreads made to gather the people you love.
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-cocoa/75">
            From birthdays and baptisms to reunions and Noche Buena, our handcrafted
            bilao bring generous flavor and a festive feel to every table.
          </p>
        </div>

        {/* Hero photo (4-dish collage) */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border-2 border-gold/50" />
          <div className="relative aspect-[7/6] overflow-hidden rounded-3xl bg-white shadow-xl shadow-cocoa/10">
            <img
              src={heroPhoto}
              alt="Madonna Delicacies bilao spread: puto, lumpiang shanghai, chicken fillet, and palabok"
              width="1400"
              height="1200"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <button
            onClick={onHelpClick}
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-cocoa/80 transition-colors hover:text-berry"
          >
            <span className="border-b border-gold pb-0.5">
              Not sure what to order? Let us help you choose
            </span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
      </div>

      {/* Trust strip */}
      <div className="relative border-y border-cream-dark bg-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-5 py-5 text-sm text-cocoa/80 sm:flex-row sm:gap-12">
          <span className="inline-flex items-center gap-2">
            <ChefHat size={18} className="text-gold-dark" /> Freshly made to order
          </span>
          <span className="inline-flex items-center gap-2">
            <Users size={18} className="text-gold-dark" /> Sizes for 5 to 40+ guests
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={18} className="text-gold-dark" /> Open {siteConfig.hours}
          </span>
        </div>
      </div>
    </section>
  )
}
