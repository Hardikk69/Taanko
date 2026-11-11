import { useMemo, useState } from 'react'
import ShopHero from '../components/ShopHero'
import { money, products, toneSwatch } from '../data'
import type { Product } from '../data'

const SORTS = {
  LATEST: 'LATEST',
  'PRICE / LOW': 'PRICE_ASC',
  'PRICE / HIGH': 'PRICE_DESC',
} as const

type SortKey = (typeof SORTS)[keyof typeof SORTS]

const CATEGORIES = ['ALL', ...new Set(products.map((p) => p.category.toUpperCase()))]

/** Pure so the filter bar stays trivial to reason about. */
export function selectProducts(all: Product[], category: string, sort: SortKey) {
  const rows =
    category === 'ALL' ? all.slice() : all.filter((p) => p.category.toUpperCase() === category)
  if (sort === 'PRICE_ASC') rows.sort((a, b) => a.price - b.price)
  if (sort === 'PRICE_DESC') rows.sort((a, b) => b.price - a.price)
  return rows
}

const PILL =
  'mono inline-flex min-h-9 items-center rounded-full border px-4 transition-[color,background-color,border-color] duration-300 ease-sf'

export default function Shopping() {
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<SortKey>('LATEST')

  const rows = useMemo(() => selectProducts(products, category, sort), [category, sort])

  return (
    <>
      <ShopHero />

      {/* Filter + sort bar */}
      <div className="sticky top-[46px] z-10 flex flex-col gap-3 border-b border-line bg-ink px-4 py-2.5 md:top-[50px] md:flex-row md:items-center md:justify-between md:px-9">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => {
            const on = c === category
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(c)}
                className={
                  PILL +
                  (on
                    ? ' border-bone bg-bone text-ink'
                    : ' border-line-strong text-bone-60 hover:border-bone hover:text-bone')
                }
              >
                {c}
              </button>
            )
          })}
        </div>

        <label className="mono flex items-center gap-2 text-muted">
          SORT
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="mono min-h-9 border border-line-strong bg-ink px-2.5 text-bone transition-colors duration-300 ease-sf hover:border-bone"
          >
            {Object.entries(SORTS).map(([label, value]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section
        id="grid"
        className="scroll-mt-[46px] px-4 pt-6 pb-14 md:scroll-mt-[50px] md:px-9 md:pt-9 md:pb-20"
        aria-label="Products"
      >
        <p className="mono text-muted" aria-live="polite">
          {String(rows.length).padStart(2, '0')} PIECES
        </p>

        {rows.length === 0 ? (
          <p className="mono mt-10 text-center text-muted">NOTHING IN THIS CATEGORY YET.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-8 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-x-6 md:gap-y-12">
            {rows.map((p) => {
              const out = p.soldOut.length === p.sizes.length
              return (
                <li key={p.slug}>
                  <a className="group grid gap-1.5" href={`/product/${p.slug}`}>
                    <div className="relative mb-1.5 aspect-[4/5] overflow-hidden rounded-lg bg-surface shadow-soft transition-shadow duration-500 ease-sf group-hover:shadow-lift">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-[50%_18%] transition-transform duration-[900ms] ease-sf group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                      />
                      <span className="mono absolute top-2.5 left-2.5 rounded-full bg-ink/90 px-2.5 py-1 backdrop-blur-sm">
                        {p.sku}
                      </span>
                      {out && (
                        <span className="mono absolute right-2.5 bottom-2.5 rounded-full bg-bone px-2.5 py-1 text-ink">
                          SOLD OUT
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] group-hover:underline group-hover:underline-offset-[5px]">
                        {p.name}
                      </span>
                      <span className="mono">{money(p.price)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block size-3 flex-none rounded-full border border-line-strong"
                        style={{ background: toneSwatch[p.tone] }}
                      />
                      <span className="mono text-muted">
                        {p.color.toUpperCase()} / {p.category.toUpperCase()}
                      </span>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
