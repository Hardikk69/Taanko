import { looks, products } from '../data'

type Img = { src: string; alt: string }

export type EditorialProps = {
  collageEyebrow?: string
  collageTitle?: string
  collage?: [Img, Img, Img, Img, Img]
  featureImage?: Img
  featureEyebrow?: string
  featureTitle?: string
  featureBody?: string
  featureCta?: string
  outroEyebrow?: string
  outroTitle?: string
}

const DEFAULT_COLLAGE: [Img, Img, Img, Img, Img] = [
  { src: looks[1].image, alt: 'Long coat in bone grey wool twill, shot full length' },
  { src: products[3].image, alt: 'Heavy rib mock neck knit in brushed alpaca blend' },
  { src: looks[4].image, alt: 'Stone rib knit vest layered over black' },
  { src: looks[3].image, alt: 'Washed canvas work jacket worn side on' },
  { src: products[11].image, alt: 'Two metres of dense brushed wool scarf' },
]

/** Dark pill with a circular arrow knob, as in the reference. */
function PillCta({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 rounded-full bg-coral-ink py-1.5 pr-1.5 pl-5 text-ink transition-colors duration-300 ease-sf hover:bg-bone focus-visible:bg-bone"
    >
      <span className="mono">{label}</span>
      <span className="grid size-8 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-sf group-hover:translate-x-1">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="square"
          />
        </svg>
      </span>
    </a>
  )
}

function Frame({ image, className }: { image: Img; className?: string }) {
  return (
    <div className={'overflow-hidden bg-surface ' + (className ?? '')}>
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
  collageTitle = 'CLOTH AND WEIGHT',
  collage = DEFAULT_COLLAGE,
  featureImage = {
    src: looks[0].image,
    alt: 'Raw wool coat held at the shoulder, the opening look of AW26',
  },
  featureEyebrow = 'designed',
  featureTitle = 'WITH INTENTION',
  featureBody = 'Twelve pieces cut in raw wool, washed canvas and heavy rib. Each run is small, restocked only when the cloth allows, and built to be worn hard rather than kept aside.',
  featureCta = 'VIEW THE COLLECTION',
  outroEyebrow = 'born from',
  outroTitle = 'THE WORKROOM',
}: EditorialProps) {
  return (
    <section className="bg-ink px-4 pt-10 pb-14 md:px-9 md:pt-16 md:pb-24" aria-labelledby="editorial-title">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-3">
        <span className="mono text-coral-ink">AW26 / EDITORIAL</span>
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

      {/* Feature: image left, copy right. */}
      <div className="mt-14 grid items-center gap-6 md:mt-24 md:grid-cols-[1.25fr_1fr] md:gap-12">
        <Frame image={featureImage} className="aspect-[4/5] md:aspect-[5/6]" />

        {/* Everything in this column shares one right-hand axis. */}
        <div className="md:pr-6 md:text-right">
          <p className="font-serif text-[clamp(26px,4.6vw,54px)] leading-none font-normal tracking-[-0.01em] text-green-ink italic">
            {featureEyebrow}
          </p>
          <h3 className="-mt-[0.08em] text-[clamp(22px,6vw,40px)] leading-[0.95] font-normal tracking-[-0.03em] text-bone uppercase">
            {featureTitle}
          </h3>
          <span className="mt-6 block h-px w-14 bg-coral md:ml-auto" aria-hidden="true" />
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.75] text-muted md:ml-auto">
            {featureBody}
          </p>
          <div className="mt-8 flex md:justify-end">
            <PillCta label={featureCta} href="/shop" />
          </div>
        </div>
      </div>

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
