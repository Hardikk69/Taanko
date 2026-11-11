import Stitch from '../components/Stitch'
import { looks, products, toneSwatch } from '../data'

const CHAPTERS = [
  {
    no: '01',
    head: 'The name',
    body: 'Taanko means to stitch with thread. It is the oldest word we know for what we do, and the only one that holds all of it: slow, made by hand, honest about the time it takes.',
  },
  {
    no: '02',
    head: 'The frame',
    body: 'Every piece is stretched on a wooden frame and worked by hand, stitch by stitch. An overshirt takes a full day. Nothing is printed, nothing is machine-filled.',
  },
  {
    no: '03',
    head: 'The house',
    body: 'Clothing, totes, purses and small objects, made in small runs from one London workroom. When a run is gone it is gone; the next one is stitched fresh.',
  },
]

const PROCESS = [
  { step: 'Draw', note: 'Each motif starts as a pencil line on paper, sized to the garment.', img: products[3].image, alt: 'Grand tote with a hand-embroidered panel' },
  { step: 'Trace', note: 'The line is pricked and pounced onto the cloth, then set in the frame.', img: looks[2].image, alt: 'Embroidered shirt with a small stitched crest' },
  { step: 'Stitch', note: 'Chain, satin, sashiko and cross stitch, worked in dyed cotton floss.', img: looks[0].image, alt: 'Chain-stitch overshirt, the opening look of the collection' },
  { step: 'Finish', note: 'Pressed, knotted off, checked by hand and signed inside the hem.', img: products[10].image, alt: 'Embroidered scarf with a hand-run border' },
]

const VALUES = [
  { dot: 'bg-coral', tone: 'text-coral-ink', head: 'Slow on purpose', body: 'We would rather make fewer things well than more things fast. The hours are the point.' },
  { dot: 'bg-green', tone: 'text-green-ink', head: 'Made to mend', body: 'Heavy cotton, canvas and twill, built to be worn hard. Bring it back and we will re-stitch it.' },
  { dot: 'bg-pink', tone: 'text-pink-ink', head: 'Small runs', body: 'Each piece is made in a short run. No overstock, no end-of-season burn, no waste on the floor.' },
]

const STATS = [
  { n: String(products.length), label: 'PIECES IN THE COLLECTION' },
  { n: String(Object.keys(toneSwatch).length), label: 'THREAD TONES' },
  { n: '1', label: 'DAY PER OVERSHIRT' },
  { n: '0', label: 'MACHINES' },
]

// Manifesto, split into words for the scroll reveal. The class marks the emphasised phrases.
const MANIFESTO = (
  [
    ['We believe a thing made slowly', ''],
    ['is worth keeping.', 'text-bone'],
    ['That a stitch you can see', ''],
    ['tells the truth', 'text-bone italic'],
    ['about the hands that made it.', ''],
  ] as const
).flatMap(([text, cls]) => text.split(' ').map((w) => ({ w, cls })))

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

export default function About() {
  return (
    <div>
      {/* Hero: giant wordmark behind a cut-out figure, so the model walks
          through the type. Previously the shop hero. */}
      <header
        aria-labelledby="about-title"
        className="relative isolate h-[max(560px,calc(100svh-50px))] overflow-hidden border-b border-line bg-ink"
      >
        <h1
          id="about-title"
          className="animate-fade absolute inset-x-0 top-[46%] z-0 -translate-y-1/2 text-center text-[clamp(84px,23vw,380px)] leading-[0.8] font-semibold tracking-[-0.05em] text-bone uppercase select-none"
          style={delay(100)}
        >
          Taanko
        </h1>

        {/* Figure, feet on the floor line, soft contact shadow under the shoes. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[94%] justify-center">
          <div className="relative h-full">
            <span className="absolute bottom-[3%] left-1/2 h-4 w-[60%] -translate-x-1/2 rounded-[50%] bg-bone/25 blur-md" />
            <img
              src="/images/shop-hero-cutout.webp"
              alt="Model in a sashiko work jacket and wool trousers, a crossbody pouch slung behind"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="animate-fade relative h-full w-auto object-contain object-bottom grayscale-[0.2]"
              style={delay(250)}
            />
          </div>
        </div>

        {/* Corner copy. */}
        <div className="relative z-20 flex h-full flex-col justify-between px-4 py-8 md:px-9 md:py-12">
          <p className="mono max-w-[16ch] leading-[1.9] tracking-[0.24em] text-bone-60">
            to stitch
            <br />
            with thread.
            <span className="mt-3 block h-px w-8 bg-bone/50" />
          </p>

          <div className="flex items-end justify-between gap-6">
            <p className="mono max-w-[26ch] leading-[1.9] tracking-[0.24em] text-bone-60">
              A hand-embroidery house. Clothing, totes, purses and small objects, worked on the frame one stitch
              at a time.
            </p>

            <p className="mono hidden text-right leading-[1.9] tracking-[0.24em] text-bone-60 sm:block">
              EST. 2026
              <br />
              London
              <span className="mt-3 ml-auto block h-px w-8 bg-bone/50" />
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-9">
      {/* Manifesto */}
      <section className="mx-auto max-w-[56rem] py-24 text-center md:py-36" aria-label="Manifesto">
        <p className="font-serif text-[clamp(28px,4.6vw,60px)] leading-[1.12] tracking-[-0.015em] text-bone-60 [view-timeline-name:--manifesto]">
          {MANIFESTO.map(({ w, cls }, i) => {
            // Each word fills in over its own slice of the scroll, left to right.
            const start = 18 + (i / MANIFESTO.length) * 34
            return (
              <span
                key={i}
                className={'word-reveal ' + cls}
                style={{ animationRange: `cover ${start}% cover ${start + 8}%` }}
              >
                {w}{' '}
              </span>
            )
          })}
        </p>
      </section>

      {/* Story: sticky image + chapters */}
      <section className="grid gap-10 border-t border-line pt-14 md:grid-cols-2 md:gap-16 md:pt-20" aria-labelledby="story-head">
        <div className="md:sticky md:top-24 md:self-start">
          <div className="overflow-hidden rounded-lg bg-surface shadow-soft">
            <img
              src={looks[3].image}
              alt="Sashiko work jacket worn side on"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>

        <div>
          <span className="mono text-coral-ink">OUR STORY</span>
          <h2 id="story-head" className="mt-4 font-serif text-[clamp(34px,5vw,64px)] leading-[0.98] tracking-[-0.02em] text-bone">
            Started with one needle and a borrowed frame.
          </h2>

          <ol className="mt-12 border-t border-line">
            {CHAPTERS.map((c) => (
              <li key={c.no} className="reveal grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-8">
                <span className="mono pt-2 text-coral-ink">{c.no}</span>
                <div>
                  <h3 className="font-serif text-[clamp(24px,3vw,32px)] leading-tight text-bone">{c.head}</h3>
                  <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.75] text-muted">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Numbers */}
      <section className="mt-24 grid grid-cols-2 border-y border-line md:mt-32 md:grid-cols-4" aria-label="In numbers">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={
              'reveal px-2 py-10 text-center md:py-14 ' +
              (i % 2 ? 'border-l border-line ' : '') +
              (i === 2 ? 'md:border-l ' : '') +
              (i > 1 ? 'border-t border-line md:border-t-0' : '')
            }
          >
            <p className="font-serif text-[clamp(56px,8vw,112px)] leading-none tracking-[-0.03em] text-bone tabular-nums">
              {s.n}
            </p>
            <p className="mono mt-3 text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="pt-24 md:pt-32" aria-labelledby="process-head">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mono text-green-ink">THE PROCESS</span>
            <h2 id="process-head" className="mt-4 font-serif text-[clamp(34px,5vw,64px)] leading-[0.98] tracking-[-0.02em] text-bone">
              Four steps, <span className="italic">no shortcuts.</span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-[15px] leading-[1.7] text-muted">
            The same way embroidery has been done for centuries. We have not found a faster way that is also better.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <li key={p.step} className="reveal group">
              <div className="overflow-hidden rounded-lg bg-surface shadow-soft">
                <img
                  src={p.img}
                  alt={p.alt}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-[1200ms] ease-sf group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 flex items-baseline gap-3 border-t border-line pt-3">
                <span className="mono text-coral-ink">0{i + 1}</span>
                <h3 className="font-serif text-[26px] leading-none text-bone">{p.step}</h3>
              </div>
              <p className="mt-2 text-[14px] leading-[1.65] text-muted">{p.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <Stitch tone="coral" className="-mx-4 mt-16 md:-mx-9 md:mt-24" />

      {/* Values */}
      <section aria-labelledby="values-head">
        <div className="text-center">
          <span className="mono text-pink-ink">WHAT WE HOLD TO</span>
          <h2 id="values-head" className="mt-4 font-serif text-[clamp(34px,5vw,64px)] leading-[0.98] tracking-[-0.02em] text-bone">
            Three rules for the workroom
          </h2>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <li key={v.head} className="reveal rounded-xl border border-line bg-surface/70 p-7 shadow-soft md:p-9">
              <span className={'block size-2.5 rounded-full ' + v.dot} aria-hidden="true" />
              <h3 className={'mt-8 font-serif text-[30px] leading-tight ' + v.tone}>{v.head}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Thread tones */}
      <section className="mt-24 border-t border-line pt-10 md:mt-32" aria-labelledby="tones-head">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="tones-head" className="mono text-coral-ink">THE THREAD WE USE</h2>
          <p className="mono text-muted">HAND-DYED COTTON FLOSS</p>
        </div>
        <ul className="mx-auto mt-8 grid max-w-[60rem] grid-cols-4 gap-3 md:grid-cols-7 md:gap-6">
          {Object.entries(toneSwatch).map(([name, hex]) => (
            <li key={name} className="reveal">
              <span
                className="block aspect-square rounded-full border border-line shadow-soft"
                style={{ background: hex }}
                aria-hidden="true"
              />
              <p className="mono mt-3 text-center text-muted">{name}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Founder quote */}
      <section className="reveal mx-auto max-w-[40ch] py-24 text-center md:py-36" aria-label="From the founder">
        <span className="font-serif text-[80px] leading-none text-coral" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="-mt-6 font-serif text-[clamp(24px,3.4vw,42px)] leading-[1.2] tracking-[-0.01em] text-bone italic">
          I keep coming back to the needle. It is the only tool that makes you slow down enough to mean it.
        </blockquote>
        <p className="mono mt-8 text-muted">— THE FOUNDER / LONDON</p>
      </section>

      {/* CTA */}
      <section className="mb-16 overflow-hidden rounded-xl bg-bone px-6 py-16 text-center text-ink md:mb-24 md:py-24" aria-labelledby="cta-head">
        <p className="font-serif text-[clamp(20px,3vw,32px)] leading-none italic opacity-80">see it up close</p>
        <h2 id="cta-head" className="mt-2 text-[clamp(36px,7vw,96px)] leading-[0.9] font-normal tracking-[-0.035em] uppercase">
          Wear the work
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/shop"
            className="mono inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-bone transition-[transform,background-color] duration-300 ease-sf hover:bg-surface active:scale-[0.97]"
          >
            SHOP THE COLLECTION →
          </a>
          <a
            href="/journal"
            className="mono inline-flex min-h-11 items-center rounded-full border border-ink/40 px-6 transition-colors duration-300 ease-sf hover:border-ink"
          >
            READ THE JOURNAL
          </a>
        </div>
      </section>
      </div>
    </div>
  )
}
