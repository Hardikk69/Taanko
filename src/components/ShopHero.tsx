import { looks, products } from '../data'

/**
 * Centered editorial hero: serif kicker, large uppercase title, then a wide
 * figure plate. The previous wordmark/cut-out hero now runs on the About
 * page; the older index-style hero lives in src/archive/ShopHeroIndex.tsx.
 */
const pad = (n: number) => String(n).padStart(2, '0')

export default function ShopHero() {
  return (
    <header className="px-4 md:px-9" aria-labelledby="shop-title">
      {/* Top strip */}
      <div className="flex items-end justify-between gap-6 border-b border-line pt-10 pb-3 md:pt-16">
        <span className="mono text-coral-ink">TAANKO / SHOP</span>
        <span className="mono text-green-ink">AW26 — {pad(products.length)} PIECES</span>
      </div>

      <div className="mt-12 text-center md:mt-20">
        <p className="font-serif text-[clamp(22px,4vw,44px)] leading-none text-pink-ink italic">
          to stitch with thread
        </p>
        <h1
          id="shop-title"
          className="mx-auto -mt-[0.05em] max-w-[14ch] text-[clamp(40px,11vw,148px)] leading-[0.88] font-normal tracking-[-0.04em] text-bone uppercase"
        >
          The AW26 collection
        </h1>
        <p className="mx-auto mt-6 max-w-[48ch] text-[16px] leading-[1.7] text-muted">
          Hand embroidered, one frame at a time. Clothing, totes, purses and small objects, made in short runs
          from one London workroom.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#grid"
            className="mono inline-flex min-h-11 items-center rounded-full bg-bone px-6 text-ink transition-[transform,background-color] duration-300 ease-sf hover:bg-accent active:scale-[0.97]"
          >
            SHOP NOW →
          </a>
          <a
            href="/lookbook"
            className="mono inline-flex min-h-11 items-center rounded-full border border-bone/40 px-6 transition-colors duration-300 ease-sf hover:border-bone"
          >
            EXPLORE THE LOOKBOOK
          </a>
        </div>
      </div>

      <figure className="reveal relative mt-12 overflow-hidden rounded-xl bg-surface shadow-lift md:mt-20">
        <img
          src={looks[3].image}
          alt="Sashiko work jacket and wool trousers, a crossbody pouch slung behind"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/5] w-full object-cover md:aspect-[21/9]"
        />
        <figcaption className="mono absolute bottom-4 left-4 rounded-full bg-ink/85 px-3.5 py-1.5 backdrop-blur-sm md:bottom-6 md:left-6">
          ALL THREAD, HARD LIGHT
        </figcaption>
      </figure>
    </header>
  )
}
