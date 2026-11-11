import { looks } from '../data'

/**
 * Triptych hero styled to sit under the nav: an inset rounded card on the
 * nav's gutters, cream seams between three portrait panels, warm-toned
 * photographs, and pill controls in the nav's language. Motion: panels
 * unveil on load with a slow push-in; on scroll-out the photos sink (CSS
 * view timeline, index.css). Older heroes live in src/archive/.
 */
const PANELS = [looks[0], looks[1], looks[3]]

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

export default function HeroTriptych() {
  return (
    <section className="px-4 pt-6 pb-2 md:px-9 md:pt-7" aria-labelledby="hero-title">
      <div className="hero-timeline relative h-[max(580px,calc(100svh-50px-40px))] overflow-hidden rounded-xl bg-ink shadow-lift">
        {/* Photographs: one panel on phones, three from tablet up, cream seams between. */}
        <div className="hero-sink absolute inset-0 grid grid-cols-1 gap-1.5 md:grid-cols-3">
          {PANELS.map((look, n) => (
            <a
              key={look.id}
              href={`/product/${look.lead}`}
              aria-label={`Look ${look.id}: ${look.title.join(' ')}`}
              className={
                'group animate-unveil relative overflow-hidden bg-surface ' +
                (n === 0 ? 'block' : 'hidden md:block')
              }
              style={delay(150 + n * 160)}
            >
              <img
                src={look.image}
                alt=""
                loading="eager"
                fetchPriority={n === 0 ? 'high' : 'auto'}
                decoding="async"
                className="animate-settle h-full w-full object-cover object-[50%_20%] sepia-[0.35] brightness-[0.95] transition-[filter] duration-700 ease-sf group-hover:sepia-[0.15] group-hover:brightness-100"
                style={{ ...delay(150 + n * 160), animationDuration: '2.6s' }}
              />
              <span className="mono absolute top-4 left-4 rounded-full border border-ink/25 bg-ink/15 px-3 py-1.5 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 ease-sf group-hover:opacity-100 group-focus-visible:opacity-100">
                Look {String(look.id).padStart(2, '0')}
              </span>
            </a>
          ))}
        </div>

        {/* Warm foot shade, tinted from the brand brown rather than black. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#2b1810]/85 via-[#2b1810]/35 to-transparent"
          aria-hidden="true"
        />

        {/* Copy */}
        <div className="pointer-events-none relative flex h-full items-end p-5 md:p-9">
          <div className="pointer-events-auto flex w-full flex-wrap items-end justify-between gap-x-12 gap-y-7">
            <div>
              <p
                className="mono animate-fade inline-flex items-center gap-2 rounded-full border border-ink/25 bg-ink/10 px-3 py-1.5 text-ink backdrop-blur-sm"
                style={delay(600)}
              >
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                Hand-embroidered · AW26
              </p>
              <h1
                id="hero-title"
                className="mt-5 font-serif text-[clamp(44px,5.4vw,88px)] leading-[0.95] font-normal tracking-[-0.025em] text-ink"
              >
                {['Embroidered by hand,', 'never hurried.'].map((line, n) => (
                  <span key={line} className="block overflow-hidden pb-[0.08em]">
                    <span className={'animate-rise block' + (n ? ' italic' : '')} style={delay(650 + n * 120)}>
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
            </div>

            {/* Same pill pair as the nav: solid cream for the lead, glass for the second. */}
            <div className="animate-fade flex flex-wrap items-center gap-2" style={delay(950)}>
              <a
                href="/shop"
                className="mono inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-6 text-bone shadow-soft transition-[background-color,color,transform] duration-300 ease-sf hover:bg-coral-ink hover:text-ink active:scale-[0.97]"
              >
                Shop the collection <span aria-hidden="true">→</span>
              </a>
              <a
                href="/lookbook"
                className="mono inline-flex min-h-11 items-center rounded-full border border-ink/30 bg-ink/10 px-6 text-ink backdrop-blur-sm transition-colors duration-300 ease-sf hover:bg-ink/20"
              >
                Commission a piece
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
