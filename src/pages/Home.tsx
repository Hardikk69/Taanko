import Editorial from '../components/Editorial'
import Hero from '../components/Hero'
import Runway from '../components/Runway'
import { products } from '../data'

export default function Home() {
  return (
    <>
      <Hero />

      <Runway />

      <section className="px-4 pt-10 pb-12 md:px-9 md:pt-18 md:pb-20" aria-labelledby="index-head">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
          <h2 id="index-head" className="mono text-coral-ink">
            AW26 INDEX / {String(products.length).padStart(2, '0')} PIECES
          </h2>
          <a
            href="/shop"
            className="mono inline-flex min-h-8 items-center text-bone-60 transition-colors duration-300 ease-sf hover:text-bone hover:underline hover:underline-offset-[5px] focus-visible:text-bone"
          >
            VIEW ALL
          </a>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-9 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-x-6 md:gap-y-9">
          {products.map((p) => (
            <li key={p.slug}>
              <a className="group grid gap-1.5" href={`/product/${p.slug}`}>
                <div className="relative mb-1.5 aspect-[4/5] overflow-hidden bg-surface">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-[50%_18%] transition-transform duration-[900ms] ease-sf group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[15px] group-hover:underline group-hover:underline-offset-[5px]">
                    {p.name}
                  </span>
                  <span className="mono text-green-ink">£{p.price}</span>
                </div>
                <span className="mono text-muted">{p.color}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Editorial />
    </>
  )
}
