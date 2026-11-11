import { looks, products } from '../data'

export type ShopHeroProps = {
  season?: string
  plate?: string
  titleTop?: string
  titleBottom?: string
  image?: string
  imageAlt?: string
  body?: string
}

const prices = products.map((p) => p.price)
const RANGE = ['£' + Math.min(...prices), '£' + Math.max(...prices)]

/** Category index with live counts, in first-seen order. */
const INDEX = [...new Set(products.map((p) => p.category))].map((c) => ({
  name: c.toUpperCase(),
  count: products.filter((p) => p.category === c).length,
}))

const pad = (n: number) => String(n).padStart(2, '0')

/** Natural pixel size of the look plates in public/images. */
const IMAGE_W = 1024
const IMAGE_H = 1536

const DISPLAY =
  'block text-[clamp(52px,13vw,132px)] leading-[0.82] font-normal tracking-[-0.045em] text-bone uppercase'

export default function ShopHero({
  season = 'TAANKO / INDEX',
  plate = 'PLATE 01',
  titleTop = 'SHOP',
  titleBottom = 'ALL',
  image = looks[0].image,
  imageAlt = 'Campaign plate',
  body = 'Clothing, totes, purses and objects — each hand-embroidered in limited runs and restocked only when the frame is free.',
}: ShopHeroProps) {
  return (
    <header className="grid border-b border-line bg-ink md:min-h-[68svh] md:grid-cols-[auto_1fr]">
      {/*
        Campaign plate. The source files are 1024x1536, so the frame is pinned
        to 2/3 and capped by height — it is never upscaled past its own pixels.
      */}
      <div className="flex items-center justify-center px-4 pt-6 pb-2 md:border-r md:border-line md:p-8">
        <figure className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-xl bg-surface shadow-lift md:max-h-[54svh] md:max-w-[280px]">
          <img
            src={image}
            alt={imageAlt}
            width={IMAGE_W}
            height={IMAGE_H}
            loading="eager"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover object-[50%_22%]"
          />
          <figcaption className="mono absolute bottom-2.5 left-2.5 rounded-full bg-ink/90 px-3 py-1 backdrop-blur-sm">
            {plate} / {season.split(' ')[0]}
          </figcaption>
        </figure>
      </div>

      {/* Type stack */}
      <div className="flex flex-col justify-between gap-8 px-4 py-6 md:gap-10 md:px-9 md:py-9">
        <div className="mono flex items-center justify-between gap-4 text-muted">
          <span>{season}</span>
          <span>{pad(products.length)} PIECES</span>
        </div>

        <h1>
          <span className="sr-only">
            {titleTop} {titleBottom}
          </span>
          <span aria-hidden="true" className={DISPLAY}>
            {titleTop}
          </span>
          <span aria-hidden="true" className={DISPLAY + ' text-accent'}>
            {titleBottom}
          </span>
        </h1>

        {/* Numbered category index with live counts. */}
        <ul className="border-t border-line">
          {INDEX.map((c, n) => (
            <li
              key={c.name}
              className="mono grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-line py-2.5 text-bone-60 transition-colors duration-300 ease-sf hover:text-bone"
            >
              <span className="text-muted">{pad(n + 1)}</span>
              <span className="tracking-[0.12em]">{c.name}</span>
              <span>{pad(c.count)}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-end justify-between gap-5">
          <p className="mono max-w-[38ch] leading-[1.7] tracking-[0.01em] text-muted normal-case">
            {body}
          </p>
          <p className="shrink-0">
            <span className="mono block text-muted">RANGE</span>
            <span className="font-mono text-[clamp(20px,3vw,32px)] leading-none tracking-[-0.02em]">
              {RANGE[0]} — {RANGE[1]}
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}
