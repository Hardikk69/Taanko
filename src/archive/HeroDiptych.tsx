import { looks, products } from '../data'

/**
 * Quiet editorial hero: a type column on the cream ground beside two
 * lookbook photographs set edge to edge. Motion is a single staggered
 * reveal on load; nothing loops. Archived; live hero is src/components/Hero.tsx.
 */
const PHOTOS = [looks[0], looks[1]]

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

export default function Hero() {
  return (
    <section
      className="grid md:h-[calc(100svh-50px)] md:min-h-[640px] md:grid-cols-[minmax(360px,0.95fr)_1fr_1fr]"
      aria-labelledby="hero-title"
    >
      {/* Type column */}
      <div className="flex flex-col justify-between gap-12 px-4 pt-10 pb-10 md:px-9 md:pt-12 md:pb-9">
        <p className="mono animate-fade flex items-center gap-2.5 text-muted" style={delay(100)}>
          <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
          Autumn / Winter 2026
        </p>

        <div>
          <h1
            id="hero-title"
            className="font-serif text-[clamp(48px,5.6vw,92px)] leading-[0.95] font-normal tracking-[-0.025em] text-bone"
          >
            {['Embroidered', 'by hand,', 'never hurried.'].map((line, n) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span
                  className={'animate-rise block' + (n === 2 ? ' italic' : '')}
                  style={delay(200 + n * 110)}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="animate-fade mt-7 max-w-[38ch] text-[16px] leading-[1.65] text-muted"
            style={delay(650)}
          >
            Clothing, totes and purses worked stitch by stitch in small runs. Each piece takes days on
            the frame, and no two are quite alike.
          </p>

          <div className="animate-fade mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" style={delay(780)}>
            <a
              href="/shop"
              className="mono inline-flex min-h-12 items-center bg-bone px-7 text-ink transition-colors duration-300 ease-sf hover:bg-coral-ink"
            >
              Shop the collection
            </a>
            <a
              href="/lookbook"
              className="mono inline-flex min-h-12 items-center text-bone underline decoration-line-strong underline-offset-[6px] transition-[text-decoration-color] duration-300 ease-sf hover:decoration-bone"
            >
              Commission a piece
            </a>
          </div>
        </div>

        <dl
          className="animate-fade grid grid-cols-3 gap-4 border-t border-line pt-4"
          style={delay(900)}
        >
          {[
            ['Pieces', String(products.length)],
            ['Made', 'By hand'],
            ['Runs', 'Limited'],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1">
              <dt className="mono text-muted">{k}</dt>
              <dd className="text-[15px] text-bone">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Diptych */}
      <div className="grid grid-cols-2 md:contents">
        {PHOTOS.map((look, n) => (
          <a
            key={look.id}
            href={`/product/${look.lead}`}
            className="group animate-unveil relative block aspect-[2/3] overflow-hidden bg-surface md:aspect-auto md:h-full"
            style={delay(300 + n * 180)}
          >
            <img
              src={look.image}
              alt={`Look ${look.id}: ${look.title.join(' ')}`}
              loading="eager"
              fetchPriority={n === 0 ? 'high' : 'auto'}
              decoding="async"
              className="animate-settle h-full w-full object-cover object-[50%_25%] transition-transform duration-[1600ms] ease-sf group-hover:scale-[1.03]"
              style={delay(300 + n * 180)}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pt-16 pb-4 md:px-5 md:pb-5">
              <p className="mono text-white/70">Look {String(look.id).padStart(2, '0')}</p>
              <p className="mt-1 font-serif text-[clamp(18px,1.6vw,24px)] leading-tight text-white">
                {look.title[0]} <span className="italic">{look.title[1]}</span>
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
