import { money, products } from '../data'

export type ProductDropProps = {
  season?: string
  place?: string
  titleLeft?: string
  titleRight?: string
  script?: string
  /** Anchor the browse cue scrolls to. */
  browseHref?: string
}

/**
 * Deck geometry. x is in vw so the spread scales with the viewport; y and the
 * rotation are fixed, which keeps the arc reading the same at every width.
 */
const DECK = [
  { x: -21, y: 30, rot: -12, z: 'z-[1]' },
  { x: -10.5, y: -4, rot: -6, z: 'z-[2]' },
  { x: 0, y: -28, rot: 2, z: 'z-[5]' },
  { x: 10.5, y: -4, rot: 7, z: 'z-[3]' },
  { x: 21, y: 30, rot: 13, z: 'z-[1]' },
]

const TONE_COUNT = new Set(products.map((p) => p.tone)).size
const pad = (n: number) => String(n).padStart(2, '0')

export default function ProductDrop({
  season = 'AW26 / INDEX',
  place = 'LONDON',
  titleLeft = 'SHOP',
  titleRight = 'ALL',
  script = 'the whole table',
  browseHref = '#grid',
}: ProductDropProps) {
  const deck = DECK.map((slot, n) => ({ ...slot, product: products[n % products.length] }))

  return (
    <header className="relative flex min-h-[72svh] flex-col justify-between overflow-hidden border-b border-line bg-ink md:min-h-[84svh]">
      {/* Telemetry bar */}
      <div className="mono relative z-20 flex items-center justify-between gap-4 px-4 pt-5 text-muted md:px-9 md:pt-7">
        <span>{season}</span>
        <span>{place}</span>
      </div>

      <div className="relative flex-1">
        {/* Display pair, split wide so the deck lands between the words. */}
        <h1 className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3 md:px-8">
          <span className="sr-only">
            {titleLeft} {titleRight} — {script}
          </span>
          <span
            aria-hidden="true"
            className="text-[clamp(44px,13vw,190px)] leading-[0.8] font-normal tracking-[-0.045em] text-bone uppercase"
          >
            {titleLeft}
          </span>
          <span
            aria-hidden="true"
            className="text-[clamp(44px,13vw,190px)] leading-[0.8] font-normal tracking-[-0.045em] text-bone uppercase"
          >
            {titleRight}
          </span>
        </h1>

        {/* Cards dropped on a studio table: tilted, overlapping, straightening on hover. */}
        <ul className="absolute inset-0">
          {deck.map((c, n) => (
            <li
              key={c.product.slug + n}
              className={'absolute top-1/2 left-1/2 ' + c.z}
              style={
                {
                  left: `calc(50% + ${c.x}vw)`,
                  '--r': `${c.rot}deg`,
                  '--ty': `${c.y}px`,
                } as React.CSSProperties
              }
            >
              <a
                href={`/product/${c.product.slug}`}
                className="group block w-[clamp(78px,13.5vw,176px)] -translate-x-1/2 translate-y-[calc(-50%+var(--ty))] rotate-[var(--r)] border border-line-strong bg-ink p-1.5 shadow-[0_6px_18px_rgba(132,74,52,0.10)] transition-[rotate,scale,box-shadow] duration-500 ease-sf hover:z-30 hover:scale-105 hover:rotate-0 hover:shadow-[0_22px_48px_rgba(132,74,52,0.26)] focus-visible:z-30 focus-visible:scale-105 focus-visible:rotate-0"
              >
                <div className="aspect-[4/5] overflow-hidden bg-surface">
                  <img
                    src={c.product.image}
                    alt={c.product.name}
                    loading={n < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover object-[50%_18%]"
                  />
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-1.5">
                  <span className="mono truncate text-muted">{c.product.sku}</span>
                  <span className="mono opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {money(c.product.price)}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Script line sits under the deck, over the words. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 text-center font-serif text-[clamp(24px,4.6vw,56px)] leading-none font-normal tracking-[-0.01em] text-accent italic"
        >
          {script}
        </span>
      </div>

      {/* Ledger + browse cue */}
      <div className="relative z-20 flex items-end justify-between gap-6 border-t border-line px-4 py-5 md:px-9 md:py-7">
        <p className="mono text-muted">
          {pad(products.length)} PIECES / {pad(TONE_COUNT)} TONES
        </p>

        <a
          href={browseHref}
          className="mono group/b inline-flex min-h-9 items-center gap-2.5 border border-line-strong px-3.5 transition-[border-color,background-color] duration-300 ease-sf hover:border-bone hover:bg-bone-10"
        >
          BROWSE
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-500 ease-sf group-hover/b:translate-y-1"
          >
            <path
              d="M7 2v10M3 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </a>
      </div>
    </header>
  )
}
