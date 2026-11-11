import { useEffect, useRef } from 'react'
import { looks, products } from '../data'
import RollButton from './RollButton'

type Img = { src: string; alt: string }

export type EditorialProps = {
  collageEyebrow?: string
  collageTitle?: string
  collage?: [Img, Img, Img, Img, Img]
  featureTitle?: string
  featureCta?: string
  outroEyebrow?: string
  outroTitle?: string
}

const DEFAULT_COLLAGE: [Img, Img, Img, Img, Img] = [
  { src: looks[1].image, alt: 'Satin-stitch jacket in bone cotton twill, shot full length' },
  { src: products[3].image, alt: 'Grand tote in oatmeal canvas with a hand-embroidered panel' },
  { src: looks[4].image, alt: 'Madder market tote carried against a clutch' },
  { src: looks[3].image, alt: 'Sashiko work jacket worn side on' },
  { src: products[10].image, alt: 'Embroidered scarf with a hand-run border' },
]

/**
 * Horizontal scroll gallery. The block is made as tall as the row is wide, its
 * stage pins, and the row of looks slides left as the page scrolls down
 * (.hs-* in index.css). The script only measures how far the row must travel.
 * Without scroll timelines, or with reduced motion, the row is a swipeable strip.
 */
function LookGallery({ title, body, cta }: { title: string; body: string; cta: string }) {
  const section = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const measure = () => {
      if (!section.current || !view.current || !track.current) return
      const dist = Math.max(0, track.current.scrollWidth - view.current.clientWidth)
      section.current.style.setProperty('--hs-dist', dist + 'px')
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (view.current) ro.observe(view.current)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={section} className="hs -mx-4 mt-24 md:-mx-9 md:mt-36">
      <div className="hs-pin flex h-[100svh] min-h-[560px] flex-col justify-center gap-8 pt-16 md:flex-row md:items-center md:gap-0 md:pt-14">
        <div className="px-4 md:w-[34%] md:flex-none md:px-9">
          <h3 className="reveal font-serif text-[clamp(44px,5.6vw,96px)] leading-[0.92] font-normal tracking-[-0.035em] text-bone">
            {title}
          </h3>
          <p className="reveal mt-5 max-w-[36ch] text-[16px] leading-[1.6] text-bone md:mt-8 md:text-[17px]">{body}</p>
          <div className="reveal mt-6 md:mt-10">
            <RollButton href="/shop">{cta}</RollButton>
          </div>
        </div>

        <div ref={view} className="hs-view min-w-0 flex-1">
          <ul ref={track} className="hs-track flex w-max gap-3 px-4 md:gap-5 md:pr-9 md:pl-0">
            {looks.map((look) => (
              <li key={look.id} className="flex-none">
                <a href={`/product/${look.lead}`} className="group block">
                  <div className="aspect-[2/3] h-[40svh] overflow-hidden rounded-[18px] bg-surface md:h-[66svh]">
                    <img
                      src={look.image}
                      alt={`Look ${look.id}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-sf group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-4 text-[14px]">
                    <span className="text-bone">Look {String(look.id).padStart(2, '0')}</span>
                    <span className="text-muted transition-colors duration-300 ease-sf group-hover:text-bone">
                      Shop the look →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Frame({ image, className }: { image: Img; className?: string }) {
  return (
    <div className={'overflow-hidden rounded-lg bg-surface shadow-soft ' + (className ?? '')}>
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-sf hover:scale-[1.03]"
      />
    </div>
  )
}

export default function Editorial({
  collageEyebrow = 'an edit of',
  collageTitle = 'THREAD AND HAND',
  collage = DEFAULT_COLLAGE,
  featureTitle = 'Made with intention.',
  featureCta = 'View the collection',
  outroEyebrow = 'born from',
  outroTitle = 'THE WORKROOM',
}: EditorialProps) {
  return (
    <section className="bg-ink px-4 pt-10 pb-14 md:px-9 md:pt-16 md:pb-24" aria-labelledby="editorial-title">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-3">
        <span className="mono text-coral-ink">TAANKO / EDITORIAL</span>
        <span className="mono text-green-ink">PLATE 01—05</span>
      </div>

      <header className="mt-7 text-center md:mt-10">
        <p className="font-serif text-[clamp(24px,4.4vw,52px)] leading-none font-normal tracking-[-0.01em] text-coral-ink italic">
          {collageEyebrow}
        </p>
        {/* Pulled up so the italic line sits into the display type, not above it. */}
        <h2
          id="editorial-title"
          className="-mt-[0.12em] text-[clamp(24px,9vw,40px)] leading-[0.9] font-normal tracking-[-0.035em] text-bone uppercase md:text-[clamp(34px,8.4vw,112px)]"
        >
          {collageTitle}
        </h2>
      </header>

      {/* Collage: tall left, stacked middle, 60/40 stacked right. Height is
          capped by the row so the band stays shallow on tall viewports. */}
      <div className="mt-6 grid grid-cols-2 grid-rows-[auto_auto] gap-2 md:mt-9 md:h-[clamp(560px,82vh,860px)] md:grid-cols-3 md:grid-rows-1 md:gap-2.5">
        <Frame image={collage[0]} className="row-span-2 aspect-[3/4] md:row-span-1 md:aspect-auto md:h-full" />

        <div className="grid grid-rows-[3fr_7fr] gap-2 md:h-full md:gap-2.5">
          <Frame image={collage[1]} className="aspect-square md:aspect-auto md:h-full" />
          <Frame image={collage[2]} className="aspect-square md:aspect-auto md:h-full" />
        </div>

        <div className="col-span-2 grid aspect-[16/9] grid-rows-[3fr_2fr] gap-2 md:col-span-1 md:aspect-auto md:h-full md:gap-2.5">
          <Frame image={collage[3]} />
          <Frame image={collage[4]} />
        </div>
      </div>

      {/* Feature: pinned headline with the looks gliding sideways past it. */}
      <LookGallery
        title={featureTitle}
        body={`${products.length} pieces — clothing, totes, purses and small objects — each hand-embroidered, made in small numbers and built to be worn hard.`}
        cta={featureCta}
      />

      {/* Outro line closing the section. */}
      <div className="mt-20 text-center md:mt-32">
        <p className="font-serif text-[clamp(24px,4.4vw,52px)] leading-none font-normal tracking-[-0.01em] text-pink-ink italic">
          {outroEyebrow}
        </p>
        <h2 className="-mt-[0.12em] text-[clamp(24px,9vw,40px)] leading-[0.9] font-normal tracking-[-0.035em] text-bone uppercase md:text-[clamp(34px,8.4vw,112px)]">
          {outroTitle}
        </h2>
      </div>
    </section>
  )
}
