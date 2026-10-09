import { Sparkles, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { products } from '../data/products'

export default function ProductsGrid({ onHelpClick }) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-5 py-14 md:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
          <span className="h-px w-8 bg-gold" />
          Our Signature Meals
          <span className="h-px w-8 bg-gold" />
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-cocoa sm:text-4xl md:text-5xl">
          More reasons to celebrate
        </h2>
        <p className="mt-4 text-base leading-relaxed text-cocoa/70">
          Choose your favorites, then message us on Messenger to place your order.
          Every bilao is freshly prepared for your occasion.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Help Me Choose card */}
      <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl bg-mint-light px-6 py-7 text-center sm:mt-14 sm:flex-row sm:px-8 sm:text-left">
        <div className="flex items-start gap-4">
          <div className="hidden rounded-full bg-white p-3 text-berry sm:block">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-cocoa">
              Not sure how much to order?
            </h3>
            <p className="mt-1 text-sm text-cocoa/70">
              Tell us how many guests you're expecting and we'll suggest the right bilao.
            </p>
          </div>
        </div>
        <button
          onClick={onHelpClick}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-berry px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-berry-dark sm:w-auto"
        >
          Help Me Choose
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}
