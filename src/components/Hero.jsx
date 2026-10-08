import { ArrowRight, ChefHat, Clock, Users } from 'lucide-react'
import OrderButtons from './OrderButtons'
import { siteConfig } from '../data/siteConfig'

export default function Hero({ onHelpClick }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-mint-light blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        {/* Text */}
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
            <span className="h-px w-8 bg-gold" />
            Artisan Bilao Spreads
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] text-berry sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>

          <h2 className="mt-5 text-2xl font-medium italic leading-snug text-cocoa sm:text-3xl">
            Bilao spreads made to gather the people you love.
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-cocoa/75">
            From birthdays and baptisms to reunions and Noche Buena, our handcrafted
            bilao bring generous flavor and a festive feel to every table.
          </p>

          <OrderButtons size="lg" className="mt-8" />

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

        {/* Image placeholder: swap with a real bilao photo later */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full rounded-b-3xl border-2 border-gold/50" />
          <div className="relative flex aspect-[4/5] items-center justify-center rounded-t-full rounded-b-3xl bg-mint-light">
            {/* Later: <img src={heroPhoto} alt="..." className="h-full w-full rounded-t-full rounded-b-3xl object-cover" /> */}
            <div className="text-center text-cocoa/40">
              <ChefHat size={56} className="mx-auto" strokeWidth={1.25} />
              <p className="mt-3 text-xs font-medium uppercase tracking-widest">
                Your signature bilao photo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative border-y border-cream-dark bg-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-5 py-5 text-sm text-cocoa/80 sm:flex-row sm:gap-12">
          <span className="inline-flex items-center gap-2">
            <ChefHat size={18} className="text-gold-dark" /> Freshly made to order
          </span>
          <span className="inline-flex items-center gap-2">
            <Users size={18} className="text-gold-dark" /> Sizes for 6 to 25 guests
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={18} className="text-gold-dark" /> Open {siteConfig.hours}
          </span>
        </div>
      </div>
    </section>
  )
}
