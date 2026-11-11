import type { CSSProperties } from 'react'
import { looks, products } from '../data'
import RollButton from './RollButton'

/**
 * Scroll-expand hero. A tall section with a pinned stage: at rest the
 * headline sits either side of a small photo card; scrolling opens the card
 * to a full-screen spread of three looks while the words slide apart and the
 * copy turns light. All scroll motion is CSS (.xh-* in index.css); without
 * scroll timelines or with reduced motion the stage stays at rest.
 * Older heroes live in src/archive/.
 */
const SPREAD = [looks[1], looks[0], looks[2]]

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

export default function Hero() {
  return (
    <section className="xh -mt-[46px] md:-mt-[50px]" aria-labelledby="hero-title">
      <div className="xh-pin xh-stage relative h-[100svh] min-h-[600px] overflow-hidden">
        {/* The spread. Clipped to a card at rest, opened to the full screen on scroll. */}
        <div className="xh-frame absolute inset-0">
          <div className="animate-fade grid h-full grid-cols-1 gap-1.5 bg-ink md:grid-cols-3" style={delay(250)}>
            {SPREAD.map((look, n) => (
              <a
                key={look.id}
                href={`/product/${look.lead}`}
                aria-label={`Look ${look.id}: ${look.title.join(' ')}`}
                tabIndex={n === 1 ? undefined : -1}
                className={'relative overflow-hidden bg-surface ' + (n === 1 ? 'block' : 'hidden md:block')}
              >
                <img
                  src={look.image}
                  alt=""
                  loading="eager"
                  fetchPriority={n === 1 ? 'high' : 'auto'}
                  decoding="async"
                  className="xh-img h-full w-full object-cover object-[50%_28%]"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Neutral scrim so the copy reads once the photos fill the screen. */}
        <div
          className="xh-scrim pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/60 to-transparent"
          aria-hidden="true"
        />

        {/* Headline either side of the card: left and right on desktop, above and below on phones. */}
        <h1
          id="hero-title"
          className="pointer-events-none absolute inset-x-4 top-[11%] bottom-[29%] flex flex-col items-center justify-between font-serif text-[clamp(60px,18vw,104px)] leading-[0.85] font-normal tracking-[-0.03em] text-bone md:inset-x-9 md:top-0 md:bottom-0 md:flex-row md:text-[clamp(72px,10vw,184px)]"
        >
          <span className="xh-left block">
            <span className="animate-blur-in block" style={delay(150)}>
              Sewn
            </span>
          </span>{' '}
          <span className="xh-right block">
            <span className="animate-blur-in block" style={delay(280)}>
              by hand.
            </span>
          </span>
        </h1>

        {/* Corner notes, gone once the scroll starts. */}
        <div className="xh-fade absolute inset-x-9 top-[96px] hidden justify-between gap-6 text-[15px] text-muted md:flex">
          <span className="animate-blur-in" style={delay(500)}>
            Hand-embroidered in London
          </span>
          <span className="animate-blur-in" style={delay(560)}>
            AW26 — {products.length} pieces
          </span>
        </div>

        {/* Intro and action: dark on the ground at rest, light over the photos once open. */}
        <div className="xh-ink absolute inset-x-4 bottom-6 flex flex-col gap-5 text-bone md:inset-x-9 md:bottom-9 md:flex-row md:items-end md:justify-between md:gap-10">
          <p
            className="animate-blur-in max-w-[34ch] text-[15px] leading-[1.5] md:max-w-[44ch] md:text-[17px]"
            style={delay(650)}
          >
            Clothing, totes, purses and small objects, each worked on the frame one stitch at a time.
          </p>

          <div className="animate-blur-in flex flex-wrap items-center gap-x-6 gap-y-3" style={delay(760)}>
            <RollButton href="/shop">Shop the collection</RollButton>
            <a
              href="/lookbook"
              className="hidden py-2 sm:inline text-[15px] font-medium underline decoration-current/30 underline-offset-[6px] transition-[text-decoration-color] duration-300 ease-sf hover:decoration-current"
            >
              Commission a piece
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
