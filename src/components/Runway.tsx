import { useCallback, useEffect, useRef, useState } from 'react'
import { bySlug, looks, money, toneSwatch } from '../data'
import type { Look, Product } from '../data'

const pad = (n: number) => String(n).padStart(2, '0')
const LAST = looks.length - 1
/** How long the pointer must rest on a hotspot before the panel opens. */
const HOVER_DELAY = 1000

/** Shared by every line that rises out of a clipped box. */
const MASK = '-mb-[0.12em] block overflow-hidden pb-[0.12em]'

export default function Runway() {
  const [i, setI] = useState(0)
  const [spot, setSpot] = useState<string | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false })
  // Hover opens the drawer, but a short close delay keeps it from flickering
  // while the pointer travels from the dot to the panel.
  const closeTimer = useRef<number | undefined>(undefined)
  // Hover intent: the pointer must rest on a dot before the panel opens, so
  // sweeping across the image does not fire every hotspot on the way.
  const openTimer = useRef<number | undefined>(undefined)

  const look = looks[i]
  const lead = bySlug(look.lead)

  /** Opens at once — used by click, keyboard focus and the drawer's own chips. */
  const openSpot = useCallback((slug: string) => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    setSpot(slug)
  }, [])

  /** Opens only once the pointer has rested on the hotspot. */
  const hoverSpot = useCallback((slug: string) => {
    window.clearTimeout(closeTimer.current)
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setSpot(slug), HOVER_DELAY)
  }, [])

  const closeSpot = useCallback((delay = 180) => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setSpot(null), delay)
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current)
      window.clearTimeout(closeTimer.current)
    },
    [],
  )

  const go = useCallback((next: number) => {
    setI(Math.max(0, Math.min(LAST, next)))
    window.clearTimeout(closeTimer.current)
    setSpot(null)
  }, [])

  const next = useCallback(() => go(i < LAST ? i + 1 : 0), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])

  // Arrow keys move through the looks while the stage has focus.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Pointer drag: commit a move past a 60px threshold.
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, active: true }
  }

  const onUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.x
    drag.current.active = false
    if (Math.abs(dx) < 60) return
    if (dx < 0) next()
    else prev()
  }

  const spec = lead
    ? `LOOK ${pad(look.id)} / ${lead.tag} / ${lead.color.toUpperCase()} / ${money(lead.price)}`
    : `LOOK ${pad(look.id)}`

  return (
    <section
      className="relative isolate h-auto min-h-0 w-full overflow-hidden bg-ink text-bone [--gap:40px] [--pd-w:420px] [--rail-x:352px] [--slide-w:min(46vw,420px)] md:h-[calc(100svh-50px)] md:min-h-[560px] lg:[--gap:76px] lg:[--rail-x:43%] lg:[--slide-w:min(32vw,480px)]"
      aria-roledescription="carousel"
      aria-label="Collection runway"
      role="region"
    >
      <div
        className="relative inset-auto grid cursor-grab touch-pan-y select-none active:cursor-grabbing md:absolute md:inset-0 md:block"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={`Look ${pad(look.id)} of ${looks.length}. Use arrow keys to change look.`}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current.active = false)}
      >
        {/* Oversized serif numeral behind the meta column */}
        <div
          className="pointer-events-none absolute top-0 bottom-auto left-[calc(1rem-0.06em)] z-0 font-serif text-[160px] leading-[0.74] font-normal tracking-[-0.04em] text-surface not-italic md:top-auto md:bottom-10 md:left-[calc(2.25rem-0.06em)] md:text-[clamp(220px,30vw,440px)]"
          aria-hidden="true"
        >
          {pad(look.id)}
        </div>

        {/*
          The rail is masked out behind the text column and fades in over a short
          ramp, so a slide sliding past never shows through the headline.
        */}
        <div className="relative inset-auto z-[1] h-[72svh] min-h-[420px] md:absolute md:inset-0 md:h-auto md:min-h-0 md:[--mask-end:calc(var(--rail-x)*0.8)] md:[mask-image:linear-gradient(to_right,transparent_0,transparent_calc(var(--mask-end)-26px),#000_calc(var(--mask-end)+67px))]">
          {/*
            The whole rail slides as one unit. Each slide keeps a fixed left
            offset and only the rail translates, so the motion is one glide.
          */}
          <div
            className="absolute inset-0 translate-x-0 md:translate-x-[calc(var(--i)*(var(--slide-w)+var(--gap))*-1)] md:transition-transform md:duration-[850ms] md:ease-sf md:will-change-transform"
            style={{ '--i': i } as React.CSSProperties}
          >
            {looks.map((l, n) => {
              const cur = n === i
              return (
                <figure
                  key={l.id}
                  className={
                    'group/slide absolute top-0 bottom-0 left-0 w-full origin-[50%_60%] transition-opacity duration-600 ease-sf md:top-[18px] md:bottom-[86px] md:left-[calc(var(--rail-x)+var(--n)*(var(--slide-w)+var(--gap)))] md:w-[var(--slide-w)] ' +
                    (cur
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none cursor-pointer opacity-0 md:pointer-events-auto md:opacity-100')
                  }
                  style={{ '--n': n } as React.CSSProperties}
                  onClick={cur ? undefined : () => go(n)}
                  aria-hidden={!cur}
                >
                  <div className="absolute inset-0 overflow-hidden bg-surface">
                    <img
                      src={l.image}
                      alt={cur ? `${l.title[0]} ${l.title[1]}` : ''}
                      draggable={false}
                      loading={n <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="pointer-events-none absolute top-0 left-[-10%] h-full w-[120%] max-w-none object-cover object-[50%_12%]"
                    />
                    <span
                      className={
                        'pointer-events-none absolute inset-0 bg-ink transition-opacity duration-600 ease-sf ' +
                        (cur ? '' : 'group-hover/slide:opacity-35!')
                      }
                      style={{ opacity: cur ? 0 : 0.55 }}
                    />
                    <span className="mono absolute top-0 left-0 bg-ink px-2.5 py-1.5 text-bone">
                      {pad(l.id)}
                    </span>
                  </div>

                  {/* The active hotspot's rule runs past the image to the drawer */}
                  <div
                    className={
                      'pointer-events-none absolute inset-0 ' +
                      (cur ? 'overflow-visible' : 'overflow-hidden')
                    }
                  >
                    {l.hotspots.map((h, k) => {
                      const prod = bySlug(h.product)
                      if (!prod) return null
                      const on = cur && spot === h.product
                      return (
                        <button
                          key={h.product}
                          type="button"
                          className={
                            'group/hs absolute z-[2] -mt-[22px] -ml-[22px] size-11 ' +
                            (cur ? 'pointer-events-auto' : 'pointer-events-none opacity-0')
                          }
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                          tabIndex={cur ? 0 : -1}
                          aria-label={`${pad(k + 1)} ${prod.name}, ${prod.color}, open details`}
                          aria-expanded={on}
                          onPointerEnter={() => cur && hoverSpot(h.product)}
                          onPointerLeave={() => cur && closeSpot()}
                          onFocus={() => cur && openSpot(h.product)}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (on) closeSpot(0)
                            else openSpot(h.product)
                          }}
                        >
                          <span
                            className={
                              'absolute inset-0 block before:absolute before:top-1/2 before:left-1/2 before:-mt-2 before:-ml-2 before:size-4 before:rounded-full before:border before:border-bone before:bg-ink-60 before:transition-[transform,background-color,border-color] before:duration-600 before:ease-sf before:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-mt-0.5 after:-ml-0.5 after:size-1 after:rounded-full after:bg-bone after:content-[""] group-hover/hs:before:scale-150 group-focus-visible/hs:before:scale-150 group-active/hs:before:scale-120 ' +
                              (on
                                ? 'before:scale-140 before:border-accent before:bg-accent after:opacity-0'
                                : '')
                            }
                          />
                          <span
                            className={
                              'mono pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-2 px-[9px] py-[5px] whitespace-nowrap ' +
                              (h.x > 55
                                ? 'right-[34px] left-auto flex-row-reverse '
                                : 'left-[34px] ') +
                              (on ? 'bg-ink' : 'bg-ink-80')
                            }
                          >
                            <b className="font-medium">{pad(k + 1)}</b>
                            <span
                              className={
                                'block overflow-hidden transition-[max-width,opacity] duration-700 ease-sf group-hover/hs:max-w-[220px] group-hover/hs:opacity-100 group-focus-visible/hs:max-w-[220px] group-focus-visible/hs:opacity-100 ' +
                                (on ? 'max-w-[220px] opacity-100' : 'max-w-0 opacity-0')
                              }
                            >
                              {prod.name}
                            </span>
                          </span>
                          {/*
                            Rule running from the active dot out to the drawer
                            edge. Drawn far wider than needed, clipped by the slide.
                          */}
                          {on && (
                            <span
                              className="pointer-events-none absolute top-1/2 left-1/2 h-px w-[150vw] origin-[0_50%] animate-connect bg-bone"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </figure>
              )
            })}
          </div>
        </div>

        <div className="pointer-events-none relative inset-auto z-[3] w-auto max-w-none px-4 pt-[18px] md:absolute md:top-[18px] md:bottom-[86px] md:left-9 md:w-[320px] md:max-w-[calc(100%-4.5rem)] md:px-0 md:pt-0 lg:w-[min(34vw,420px)]">
          {/*
            The spec line pins to the top; the title block is centred in the
            remaining height, which puts the serif headline at mid-page.
          */}
          <div className="grid h-full grid-rows-[auto_1fr] gap-3.5 md:gap-[18px]" key={look.id}>
            <span className={MASK}>
              <span className="mono block animate-rise text-xs">{spec}</span>
            </span>

            <div className="flex min-h-0 flex-col justify-center gap-[18px]">
              <h1 className="text-[34px] leading-[1.04] font-normal tracking-[-0.015em] md:text-[clamp(40px,4.2vw,62px)]">
                <span className={MASK + ' font-serif tracking-[-0.01em]'}>
                  <span className="block animate-rise">{look.title[0]}</span>
                </span>
                <span className={MASK + ' font-serif tracking-[-0.01em]'}>
                  <span className="block animate-rise italic [animation-delay:0.06s]">
                    {look.title[1]}
                  </span>
                </span>
              </h1>

              <span className={MASK + ' max-w-[34ch] text-bone-60'}>
                <span className="block animate-rise [animation-delay:0.12s]">{look.note}</span>
              </span>

              <span className={MASK}>
                <span className="block animate-rise">
                  <ul className="pointer-events-auto mt-1 border-t border-line md:mt-2.5">
                    {look.hotspots.map((h, k) => {
                      const prod = bySlug(h.product)
                      if (!prod) return null
                      const on = spot === h.product
                      return (
                        <li key={h.product}>
                          <button
                            type="button"
                            className={
                              'grid min-h-11 w-full grid-cols-[30px_1fr_auto] items-center gap-2 border-b border-line text-left transition-[padding,color,background-color] duration-600 ease-sf hover:pl-2 active:opacity-70 ' +
                              (on ? 'pl-2' : '')
                            }
                            aria-expanded={on}
                            onPointerEnter={() => hoverSpot(h.product)}
                            onPointerLeave={() => closeSpot()}
                            onFocus={() => openSpot(h.product)}
                            onClick={() => (on ? closeSpot(0) : openSpot(h.product))}
                          >
                            <span className="mono text-muted">{pad(k + 1)}</span>
                            <span className={on ? 'underline underline-offset-[5px]' : ''}>
                              {prod.name}
                            </span>
                            <span className="mono">{money(prod.price)}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative inset-auto z-[4] flex h-auto items-center justify-between gap-4 px-4 pt-[18px] pb-6 md:absolute md:right-9 md:bottom-0 md:left-9 md:h-[84px] md:px-0 md:py-0">
          <div className="flex items-center gap-5">
            <span className="mono" aria-live="polite">
              {pad(look.id)} / {pad(looks.length)}
            </span>
            <ul className="hidden md:flex md:gap-0.5">
              {looks.map((l, n) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className={
                      'relative h-11 w-7 after:absolute after:top-1/2 after:right-0.5 after:left-0.5 after:-mt-px after:h-0.5 after:transition-[background-color,transform] after:duration-500 after:ease-sf after:content-[""] hover:after:bg-bone-60 ' +
                      (n === i ? 'after:scale-y-200 after:bg-bone' : 'after:bg-line-strong')
                    }
                    aria-label={`Go to look ${pad(l.id)}`}
                    aria-current={n === i}
                    onClick={() => go(n)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="grid size-11 place-items-center border border-line-strong transition-[border-color,opacity,background-color] duration-400 disabled:cursor-default disabled:opacity-30 enabled:hover:border-bone enabled:hover:bg-bone-10 enabled:active:opacity-60"
              onClick={prev}
              disabled={i === 0}
              aria-label="Previous look"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              className="mono group/next inline-flex min-h-11 items-center gap-[22px] bg-bone px-5 text-xs text-ink transition-[opacity,background-color] duration-300 hover:bg-bone-88 active:opacity-[0.78]"
              onClick={next}
            >
              <span>NEXT LOOK</span>
              <Arrow
                dir="right"
                className="transition-transform duration-600 ease-sf group-hover/next:translate-x-1.5 group-focus-visible/next:translate-x-1.5"
              />
            </button>
          </div>
        </div>
      </div>

      {spot && (
        <Drawer
          product={bySlug(spot)!}
          look={look}
          index={look.hotspots.findIndex((h) => h.product === spot)}
          onPick={openSpot}
          onHold={() => openSpot(spot)}
          onRelease={() => closeSpot()}
          onClose={() => closeSpot(0)}
        />
      )}
    </section>
  )
}

function Arrow({ dir, className }: { dir: 'left' | 'right'; className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={dir === 'right' ? 'M2 7h10M8 3l4 4-4 4' : 'M12 7H2M6 3L2 7l4 4'}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}

function Drawer({
  product,
  look,
  index,
  onPick,
  onHold,
  onRelease,
  onClose,
}: {
  product: Product
  look: Look
  index: number
  onPick: (slug: string) => void
  onHold: () => void
  onRelease: () => void
  onClose: () => void
}) {
  const [size, setSize] = useState<string | null>(null)

  // Picking a different piece should start its size choice fresh.
  useEffect(() => setSize(null), [product.slug])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <aside
      className="fixed inset-x-0 top-auto bottom-0 z-40 flex max-h-[88svh] w-auto animate-sheet-in flex-col border-t border-line-strong bg-ink md:absolute md:inset-x-auto md:top-0 md:right-0 md:bottom-0 md:max-h-none md:w-[var(--pd-w)] md:animate-slide-in md:border-t-0 md:border-l"
      role="dialog"
      aria-modal="false"
      aria-label={product.name}
      onPointerEnter={onHold}
      onPointerLeave={onRelease}
    >
      <header className="flex min-h-14 items-center justify-between border-b border-line py-1.5 pr-2 pl-4 md:pl-6">
        <span className="mono text-muted">
          LOOK {pad(look.id)} / PIECE {pad(index + 1)} OF {pad(look.hotspots.length)}
        </span>
        <button
          type="button"
          className="grid size-11 place-items-center transition-[background-color,opacity] duration-300 hover:bg-bone-10 active:opacity-60"
          onClick={onClose}
        >
          <span className="sr-only">Close details</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-3 md:px-6 md:pt-5 md:pb-6">
        <div className="relative mb-[22px] aspect-[5/4] overflow-hidden rounded-lg border border-line bg-surface shadow-soft">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[50%_20%]"
          />
          {/* Registration cross on the drawer image */}
          <span
            className='pointer-events-none absolute top-1/2 left-1/2 -mt-[11px] -ml-[11px] size-[22px] before:absolute before:top-0 before:bottom-0 before:left-1/2 before:w-px before:bg-bone before:content-[""] after:absolute after:top-1/2 after:right-0 after:left-0 after:h-px after:bg-bone after:content-[""]'
            aria-hidden="true"
          />
          <span className="mono absolute bottom-0 left-0 bg-ink px-2.5 py-[5px]">{product.sku}</span>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl leading-[1.05] font-medium tracking-[-0.03em] md:text-[30px]">
            {product.name}
          </h2>
          <span className="mono">{money(product.price)}</span>
        </div>

        <div className="mt-2 flex items-center gap-2.5">
          <span
            className="inline-block size-3 flex-none border border-line-strong"
            style={{ background: toneSwatch[product.tone] }}
          />
          <span className="mono text-muted">
            {product.color.toUpperCase()} / {product.sku}
          </span>
        </div>

        <fieldset className="mt-[22px] min-w-0 border-0 p-0">
          <legend className="mono mb-2.5 p-0 text-muted">SIZE</legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const out = product.soldOut.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  className={
                    'min-h-11 min-w-11 rounded-md border px-3.5 font-mono text-xs tracking-[0.06em] transition-[background-color,color,border-color,opacity] duration-400 ease-sf disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 enabled:hover:border-bone enabled:hover:bg-bone-12 enabled:active:opacity-70 ' +
                    (size === s ? 'border-bone bg-bone text-ink' : 'border-line-strong')
                  }
                  disabled={out}
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                >
                  {s}
                  {out && <span className="sr-only"> sold out</span>}
                </button>
              )
            })}
          </div>
        </fieldset>

        <p className="mt-3 max-w-[44ch] text-sm text-bone-60 md:mt-[18px] md:text-[15px]">
          {product.short}
        </p>

        {/* Other pieces in the same look */}
        <div className="mt-[26px]">
          <p className="mono text-muted">IN THIS LOOK</p>
          <ul className="mt-2.5 flex gap-2">
            {look.hotspots.map((h) => {
              const other = bySlug(h.product)
              if (!other) return null
              const on = h.product === product.slug
              return (
                <li key={h.product}>
                  <button
                    type="button"
                    className={
                      'grid w-[78px] gap-1.5 border p-[3px] text-left transition-[border-color] duration-400 ' +
                      (on ? 'border-bone' : 'border-transparent hover:border-line-strong')
                    }
                    aria-label={other.name}
                    onPointerEnter={() => onPick(h.product)}
                    onClick={() => onPick(h.product)}
                  >
                    <img
                      src={other.image}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      className="aspect-[4/5] w-full bg-surface object-cover"
                    />
                    <span
                      className={'text-[9.5px] leading-[1.25] ' + (on ? 'text-bone' : 'text-bone-60')}
                    >
                      {other.tag}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <footer className="grid gap-1 border-t border-line px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] md:px-6 md:pt-3.5 md:pb-[18px]">
        <button
          type="button"
          className='relative isolate flex min-h-11 w-full items-center justify-between gap-[18px] overflow-hidden rounded-full border border-bone bg-bone px-5 font-mono text-xs tracking-[0.08em] text-ink uppercase transition-[color,opacity] duration-500 ease-sf before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:bg-ink before:transition-transform before:duration-[550ms] before:ease-sf before:content-[""] disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:text-bone enabled:hover:before:translate-y-0 enabled:active:opacity-[0.78]'
          disabled={!size}
        >
          <span>{size ? 'ADD TO BAG' : 'SELECT A SIZE'}</span>
          <span>{money(product.price)}</span>
        </button>
        <a
          href={`/product/${product.slug}`}
          className="mono inline-flex min-h-11 items-center gap-1.5 justify-self-start hover:underline hover:underline-offset-[5px]"
        >
          FULL DETAILS <Arrow dir="right" />
        </a>
      </footer>
    </aside>
  )
}
