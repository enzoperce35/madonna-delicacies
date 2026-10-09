import { Sparkles, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { products } from '../data/products'

export default function ProductsGrid({ onHelpClick }) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
          <span className="h-px w-8 bg-gold" />
          Our Signature Bilao
          <span className="h-px w-8 bg-gold" />
        </p>
        <h2 className="mt-4 text-4xl font-semibold text-cocoa sm:text-5xl">
          Nine reasons to celebrate
        </h2>
        <p className="mt-4 text-base leading-relaxed text-cocoa/70">
          Choose your favorites, then call or message us to place your order.
          Every bilao is freshly prepared for your occasion.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Help Me Choose card */}
      <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl bg-mint-light px-8 py-8 text-center sm:flex-row sm:text-left">
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
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-berry px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-berry-dark"
        >
          Help Me Choose
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}
