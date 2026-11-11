import { useState } from 'react'
import { bySlug, looks, money, products, toneSwatch } from '../data'

/** /product/<slug> — a single piece: stacked gallery beside a sticky buy panel. */
export default function Product() {
  const slug = window.location.pathname.replace(/^\/product\/?/, '')
  const product = bySlug(slug)
  const [size, setSize] = useState<string | null>(null)

  if (!product) {
    return (
      <section className="px-4 py-24 text-center md:px-9" aria-label="Product">
        <p className="mono text-muted">PIECE NOT FOUND.</p>
        <a
          href="/shop"
          className="mono mt-4 inline-flex min-h-9 items-center text-coral-ink hover:underline hover:underline-offset-[5px]"
        >
          ← BACK TO THE SHOP
        </a>
      </section>
    )
  }

  const soldOut = (s: string) => product.soldOut.includes(s)
  const allOut = product.soldOut.length === product.sizes.length
  const oneSize = product.sizes.length === 1
  const chosen = oneSize ? product.sizes[0] : size

  // Lookbook shots this piece appears in, via the hotspots.
  const seenIn = looks.filter((l) => l.hotspots.some((h) => h.product === product.slug))
  const gallery = [
    { src: product.image, alt: `${product.name} in ${product.color.toLowerCase()}` },
    ...seenIn.map((l) => ({ src: l.image, alt: `${product.name} worn in look ${l.id}: ${l.title.join(' ')}` })),
  ]

  // Same category first, topped up from the rest so the row is always full.
  const related = [
    ...products.filter((x) => x.category === product.category && x.slug !== product.slug),
    ...products.filter((x) => x.category !== product.category),
  ].slice(0, 4)

  return (
    <article className="px-4 md:px-9">
      {/* Breadcrumb strip */}
      <nav
        className="mono flex items-end justify-between gap-6 border-b border-line pt-10 pb-3 md:pt-14"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-2 text-muted">
          <li>
            <a href="/shop" className="transition-colors duration-300 ease-sf hover:text-bone">
              SHOP
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a
              href={`/shop?c=${product.category}`}
              className="transition-colors duration-300 ease-sf hover:text-bone"
            >
              {product.category.toUpperCase()}
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-bone" aria-current="page">
            {product.name.toUpperCase()}
          </li>
        </ol>
        <span className="hidden text-green-ink md:inline">{product.sku}</span>
      </nav>

      <div className="grid gap-10 pt-6 md:grid-cols-[1.25fr_1fr] md:gap-14 md:pt-10 lg:gap-20">
        {/* Gallery: swipe row on phones, stacked plates on desktop. */}
        <div
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:gap-5 md:overflow-visible md:px-0"
          aria-label="Gallery"
        >
          {gallery.map((g, i) => (
            <figure
              key={g.src}
              className="relative w-[86%] flex-none snap-center overflow-hidden rounded-xl bg-surface shadow-soft md:w-auto"
            >
              <img
                src={g.src}
                alt={g.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="aspect-[4/5] w-full object-cover object-[50%_18%]"
              />
              <figcaption className="mono absolute bottom-3 left-3 rounded-full bg-ink/85 px-3 py-1 backdrop-blur-sm">
                {String(i + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
                {i === 0 ? ` — ${product.tag}` : ` — LOOK ${seenIn[i - 1].id}`}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Buy panel */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-serif text-[clamp(20px,2.4vw,26px)] leading-none text-pink-ink italic">
            hand-embroidered
          </p>
          <h1 className="mt-2 font-serif text-[clamp(40px,5.6vw,76px)] leading-[0.95] font-normal tracking-[-0.025em] text-bone">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-5">
            <span className="text-[clamp(22px,2.4vw,28px)] tracking-[-0.01em] text-bone tabular-nums">
              {money(product.price)}
            </span>
            <span className="mono flex items-center gap-2 text-muted">
              <span
                className="size-3 rounded-full border border-line-strong"
                style={{ background: toneSwatch[product.tone] }}
                aria-hidden="true"
              />
              {product.color.toUpperCase()} THREAD
            </span>
          </div>

          <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.75] text-muted">{product.short}</p>

          {!oneSize && (
            <fieldset className="mt-8">
              <div className="flex items-center justify-between">
                <legend className="mono text-bone">SIZE</legend>
                <span className="mono text-muted">{size ? `SELECTED: ${size}` : 'CHOOSE ONE'}</span>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5" role="group" aria-label="Choose a size">
                {product.sizes.map((s) => {
                  const out = soldOut(s)
                  const on = s === size
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={out}
                      aria-pressed={on}
                      aria-label={out ? `${s}, sold out` : s}
                      onClick={() => setSize(s)}
                      className={
                        'mono inline-flex min-h-11 items-center justify-center rounded-md border transition-[color,background-color,border-color] duration-300 ease-sf ' +
                        (out
                          ? 'cursor-not-allowed border-line text-muted line-through opacity-50'
                          : on
                            ? 'border-bone bg-bone text-ink'
                            : 'border-line-strong text-bone hover:border-bone')
                      }
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          <button
            type="button"
            disabled={allOut || !chosen}
            className="group mt-6 inline-flex min-h-13 w-full items-center justify-between rounded-full bg-bone py-1.5 pr-1.5 pl-6 text-ink transition-[background-color,transform] duration-300 ease-sf hover:bg-coral-ink active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted"
          >
            <span className="mono">
              {allOut ? 'SOLD OUT' : chosen ? 'ADD TO BAG' : 'SELECT A SIZE'}
            </span>
            <span className="mono grid h-10 place-items-center rounded-full bg-ink px-4 text-bone tabular-nums transition-transform duration-500 ease-sf group-enabled:group-hover:translate-x-[-2px]">
              {money(product.price)} →
            </span>
          </button>

          <ul className="mono mt-5 grid grid-cols-3 gap-2 text-center text-muted">
            {['HAND-STITCHED', 'SMALL RUN', 'SIGNED HEM'].map((t) => (
              <li key={t} className="rounded-md border border-line px-2 py-2.5">
                {t}
              </li>
            ))}
          </ul>

          {/* Native disclosure: keyboard and screen-reader support for free. */}
          <div className="mt-8 border-t border-line">
            {[
              {
                head: 'Details',
                body: (
                  <dl className="grid gap-2">
                    {[
                      ['Reference', product.sku],
                      ['Category', product.category],
                      ['Thread', product.color],
                      ['Sizes', product.sizes.join(' · ')],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[7rem_1fr] gap-4">
                        <dt className="mono pt-0.5 text-muted">{k}</dt>
                        <dd className="text-bone capitalize">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
              {
                head: 'Care',
                body: (
                  <p>
                    Hand wash cold, inside out. Dry flat, away from direct heat. Press on the reverse
                    through a cloth so the stitches keep their lift.
                  </p>
                ),
              },
              {
                head: 'Shipping & returns',
                body: (
                  <p>
                    See{' '}
                    <a href="/shipping" className="text-bone underline underline-offset-4 hover:text-coral-ink">
                      shipping
                    </a>{' '}
                    and{' '}
                    <a href="/returns" className="text-bone underline underline-offset-4 hover:text-coral-ink">
                      returns
                    </a>{' '}
                    for times, costs and how to send a piece back.
                  </p>
                ),
              },
            ].map((d, i) => (
              <details key={d.head} className="group border-b border-line" open={i === 0}>
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-serif text-[22px] text-bone [&::-webkit-details-marker]:hidden">
                  {d.head}
                  <span
                    className="mono grid size-7 place-items-center rounded-full border border-line-strong transition-transform duration-500 ease-sf group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="pb-6 text-[15px] leading-[1.7] text-muted">{d.body}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Statement band */}
      <section className="reveal mx-auto max-w-[56rem] py-24 text-center md:py-36" aria-label="The making">
        <span className="mono text-coral-ink">ON THE FRAME</span>
        <p className="mt-6 font-serif text-[clamp(28px,4.4vw,56px)] leading-[1.12] tracking-[-0.015em] text-bone-60">
          No two are quite the same. <span className="text-bone">Every stitch is placed by hand,</span> so
          yours will carry <span className="text-bone italic">its own small marks</span> of the person who
          made it.
        </p>
      </section>

      <section className="mt-20 border-t border-line pt-12 pb-20 md:mt-28 md:pt-16 md:pb-28" aria-labelledby="more-head">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="more-head"
            className="font-serif text-[clamp(32px,4.6vw,56px)] leading-none tracking-[-0.02em] text-bone"
          >
            You may <span className="italic">also like</span>
          </h2>
          <a href="/shop" className="mono text-muted transition-colors duration-300 ease-sf hover:text-bone">
            SHOP ALL →
          </a>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {related.map((p) => (
            <li key={p.slug} className="reveal">
              <a className="group grid gap-2.5" href={`/product/${p.slug}`}>
                <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface shadow-soft transition-shadow duration-500 ease-sf group-hover:shadow-lift">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-[50%_18%] transition-transform duration-[900ms] ease-sf group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[15px] text-bone group-hover:underline group-hover:underline-offset-[5px]">
                    {p.name}
                  </span>
                  <span className="text-[15px] text-bone tabular-nums">{money(p.price)}</span>
                </div>
                <span className="mono -mt-1.5 flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-full" style={{ background: toneSwatch[p.tone] }} aria-hidden="true" />
                  {p.color.toUpperCase()} / {p.category.toUpperCase()}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
