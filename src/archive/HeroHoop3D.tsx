import { useCallback, useEffect, useRef, useState } from 'react'
import { products, looks, money, toneSwatch } from '../data'
import type { Product } from '../data'

export type HeroProps = {
  eyebrow?: string
  title?: string
  intro?: string
  defaultProductSlug?: string
}

export default function Hero({
  eyebrow = 'made for',
  title = 'TIMELESS ADORATION',
  intro = 'Pieces drawn from exacting craft and a modern, quieter elegance — shaped to make every ordinary moment unforgettable.',
  defaultProductSlug = 'raw-wool-coat',
}: HeroProps) {
  const [selectedSlug, setSelectedSlug] = useState(defaultProductSlug)
  const heroRef = useRef<HTMLElement>(null)

  // Direct element references for 60fps/120fps flicker-free GPU transforms
  const bgRef = useRef<HTMLDivElement>(null)
  const leftCardRef = useRef<HTMLElement>(null)
  const centerCardRef = useRef<HTMLDivElement>(null)
  const rightCardRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  // Find the selected product (fallback to first product)
  const product: Product =
    products.find((p) => p.slug === selectedSlug) ?? products[0]

  // Find accompanying pieces for the side cards
  const accompanyingLook =
    looks.find((l) => l.lead === product.slug) ?? looks[0]
  const sideProductA =
    products.find((p) => p.slug !== product.slug && accompanyingLook.hotspots.some((h) => h.product === p.slug)) ??
    products[3]
  const sideProductB =
    products.find((p) => p.slug !== product.slug && p.slug !== sideProductA.slug) ??
    products[7]

  /**
   * Parallax state. x and y are pointer position in -1..1. sy is SCROLL
   * PROGRESS in -1..1 (one hero height of travel), not raw pixels — raw
   * pixels grow without bound and tear the layers out of the section.
   */
  const target = useRef({ x: 0, y: 0, sy: 0 })
  const current = useRef({ x: 0, y: 0, sy: 0 })
  const isRunning = useRef(false)
  const frameId = useRef<number>(0)
  const rectRef = useRef<DOMRect | null>(null)
  const reduced = useRef(false)
  /** Set by scroll/resize so the layout read happens once per frame, in the loop. */
  const needsRect = useRef(true)

  const clamp1 = (n: number) => Math.max(-1, Math.min(1, n))

  /** Single layout read per frame. Keeping it out of the scroll handler avoids thrash. */
  const readRect = useCallback(() => {
    const el = heroRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    rectRef.current = rect
    target.current.sy = clamp1(-rect.top / (rect.height || 1))
  }, [])

  // Smooth animation loop that runs only when needed (sleeps when idle)
  const renderFrame = useCallback(() => {
    if (needsRect.current) {
      needsRect.current = false
      readRect()
    }

    // Linear interpolation with smooth dampening
    current.current.x += (target.current.x - current.current.x) * 0.07
    current.current.y += (target.current.y - current.current.y) * 0.07
    current.current.sy += (target.current.sy - current.current.sy) * 0.08

    const { x, y, sy } = current.current

    // 1. Background typography
    if (bgRef.current) {
      const bx = (-x * 22).toFixed(2)
      const by = (-y * 14 + sy * 26).toFixed(2)
      bgRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0)`
    }

    // 2. Left side product card
    if (leftCardRef.current) {
      const lx = (-x * 16).toFixed(2)
      const ly = (-y * 12 - sy * 18).toFixed(2)
      leftCardRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`
    }

    // 3. Center featured product card (3D tilt — perspective lives on the wrapper)
    if (centerCardRef.current) {
      const cx = (x * 10).toFixed(2)
      const cy = (y * 8 + sy * 10).toFixed(2)
      const rx = (-y * 6.5).toFixed(2)
      const ry = (x * 6.5).toFixed(2)
      centerCardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${cx}px, ${cy}px, 0)`
    }

    // 4. Glare / specular light reflection on center card
    if (glareRef.current) {
      const gx = (x * 40).toFixed(2)
      const gy = (y * 40).toFixed(2)
      const op = Math.max(0.08, Math.min(0.35, (Math.abs(x) + Math.abs(y)) * 0.3)).toFixed(2)
      glareRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`
      glareRef.current.style.opacity = op
    }

    // 5. Right side product card
    if (rightCardRef.current) {
      const rx = (x * 16).toFixed(2)
      const ry = (y * 12 - sy * 22).toFixed(2)
      rightCardRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
    }

    // 6. Floating foreground spec badge
    if (badgeRef.current) {
      const bdx = (x * 24).toFixed(2)
      const bdy = (y * 18 - sy * 30).toFixed(2)
      badgeRef.current.style.transform = `translate3d(calc(-50% + ${bdx}px), ${bdy}px, 0)`
    }

    // Check if motion has settled to save CPU cycles
    const dx = Math.abs(target.current.x - current.current.x)
    const dy = Math.abs(target.current.y - current.current.y)
    const dsy = Math.abs(target.current.sy - current.current.sy)

    if (dx > 0.001 || dy > 0.001 || dsy > 0.001) {
      frameId.current = requestAnimationFrame(renderFrame)
    } else {
      isRunning.current = false
    }
  }, [readRect])

  const startLoop = useCallback(() => {
    if (reduced.current || isRunning.current) return
    isRunning.current = true
    frameId.current = requestAnimationFrame(renderFrame)
  }, [renderFrame])

  const onPointerEnter = useCallback(() => {
    needsRect.current = true
    startLoop()
  }, [startLoop])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const rect = rectRef.current
      if (!rect || rect.width === 0 || rect.height === 0) {
        needsRect.current = true
        startLoop()
        return
      }
      // Normalized coordinates from -1 to 1 relative to center
      target.current.x = clamp1(((e.clientX - rect.left) / rect.width - 0.5) * 2)
      target.current.y = clamp1(((e.clientY - rect.top) / rect.height - 0.5) * 2)
      startLoop()
    },
    [startLoop],
  )

  const onPointerLeave = useCallback(() => {
    target.current.x = 0
    target.current.y = 0
    startLoop()
  }, [startLoop])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      reduced.current = mq.matches
    }
    syncMotion()

    // Scroll and resize only flag the loop; the layout read happens in renderFrame.
    const invalidate = () => {
      needsRect.current = true
      startLoop()
    }

    mq.addEventListener('change', syncMotion)
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
    invalidate()

    return () => {
      mq.removeEventListener('change', syncMotion)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
      cancelAnimationFrame(frameId.current)
      isRunning.current = false
    }
  }, [startLoop])

  return (
    <section
      ref={heroRef}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden bg-ink px-4 pt-3 pb-3 select-none md:px-9 md:pt-4 md:pb-4"
      aria-labelledby="hero-title"
    >
      {/* 1. Deep Parallax Layer: Subtle Editorial Watermark */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden text-center select-none will-change-transform"
        aria-hidden="true"
      >
        <span className="font-serif text-[clamp(90px,18vw,230px)] leading-none font-normal tracking-[-0.04em] text-bone/6 uppercase opacity-40">
          TAANKO
        </span>
      </div>

      {/* Hero Header & Typography (Sleek & Compact) */}
      <div className="relative z-10 text-center">
        <p className="font-serif text-[clamp(18px,3.2vw,32px)] leading-none font-normal tracking-[-0.01em] text-coral-ink italic">
          {eyebrow}
        </p>

        <h1
          id="hero-title"
          className="mt-0.5 text-[clamp(22px,6.2vw,36px)] leading-[0.94] font-normal tracking-[-0.02em] whitespace-normal text-bone uppercase md:text-[clamp(28px,6vw,76px)] md:whitespace-nowrap"
        >
          {title}
        </h1>

        {/* Product selector tabs */}
        <div className="mt-2 flex items-center justify-center gap-1">
          {products.slice(0, 3).map((p, idx) => {
            const on = p.slug === selectedSlug
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setSelectedSlug(p.slug)}
                className={
                  'mono inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97] ' +
                  (on
                    ? 'border-coral-ink bg-coral-ink text-ink font-medium shadow-sm'
                    : 'border-line-strong text-bone-60 hover:border-coral-ink hover:text-coral-ink hover:bg-coral-12')
                }
                aria-pressed={on}
              >
                <span>0{idx + 1}</span>
                <span className="hidden sm:inline">{p.name.toUpperCase()}</span>
                <span>{money(p.price)}</span>
              </button>
            )
          })}
        </div>

        {/* Short right-aligned standfirst */}
        <p className="mono mx-auto mt-1.5 max-w-[42ch] text-center text-[10.5px] leading-[1.4] tracking-[0.01em] text-muted normal-case md:ml-auto md:mr-0 md:max-w-[28ch] md:text-right">
          {intro}
        </p>
      </div>

      {/* 2. Multi-Layer Parallax Interactive Stage */}
      <div className="relative z-10 mt-2 grid grid-cols-2 items-center gap-3 md:-mt-2 md:grid-cols-[1fr_auto_1fr] md:gap-6 lg:gap-8">
        {/* Parallax Layer Left: Accompanying Detail Product A */}
        <figure
          ref={leftCardRef}
          className="group col-span-1 grid max-w-none grid-rows-[auto_auto] gap-1.5 justify-self-stretch self-start will-change-transform md:col-start-1 md:max-w-[150px] md:justify-self-start md:self-center lg:max-w-[190px]"
        >
          <a
            href={`/product/${sideProductA.slug}`}
            className="block aspect-[4/5] overflow-hidden border border-line bg-surface transition-[border-color] duration-300 hover:border-bone focus-visible:border-bone"
            aria-label={`View ${sideProductA.name}`}
          >
            <img
              src={sideProductA.image}
              alt={sideProductA.name}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-sf group-hover:scale-105"
            />
          </a>
          <figcaption className="grid gap-0.5">
            <span className="mono tracking-[0.1em] text-bone text-[10px]">
              {sideProductA.tag}
            </span>
            <span className="mono tracking-[0.01em] text-muted normal-case text-[10px]">
              {sideProductA.name} · {money(sideProductA.price)}
            </span>
          </figcaption>
        </figure>

        {/* Parallax Layer Center: Hero Featured Product with 3D Tilt */}
        <div className="order-first col-span-full aspect-[4/5] w-full max-w-[250px] sm:max-w-[280px] md:order-none md:col-span-1 md:col-start-2 md:max-w-[310px] lg:max-w-[340px] max-h-[46vh] justify-self-center [perspective:1200px]">
          <div
            ref={centerCardRef}
            className="group relative h-full w-full overflow-hidden border border-line-strong bg-surface shadow-2xl will-change-transform [backface-visibility:hidden]"
          >
            {/* Featured Product Image */}
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-[50%_18%] transition-transform duration-700 ease-sf group-hover:scale-105"
            />

            {/* Smooth dynamic highlight overlay (no mix-blend-mode to avoid GPU flicker) */}
            <div
              ref={glareRef}
              className="pointer-events-none absolute inset-[-30%] opacity-10 bg-[radial-gradient(circle_300px_at_center,rgba(255,255,255,0.7),transparent_70%)] will-change-transform"
              aria-hidden="true"
            />

            {/* Tone swatch and live indicator */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-ink/90 px-2 py-1 backdrop-blur-sm">
              <span
                className="size-2 rounded-full border border-bone/40"
                style={{ background: toneSwatch[product.tone] }}
                aria-hidden="true"
              />
              <span className="mono text-[9.5px] tracking-wider text-bone">
                {product.tone.toUpperCase()}
              </span>
            </div>

            {/* Quick action bar overlaid on bottom of center card */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-ink/95 px-3 py-2 backdrop-blur-sm">
              <div className="grid">
                <span className="mono text-[9px] text-muted">{product.sku}</span>
                <span className="font-medium text-bone text-xs">{product.name}</span>
              </div>
              <a
                href={`/product/${product.slug}`}
                className="mono inline-flex items-center gap-1 border border-coral-ink bg-coral-ink px-2.5 py-1 text-[10px] font-medium text-ink transition-colors hover:bg-bone hover:border-bone"
              >
                <span>{money(product.price)}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Parallax Layer Right: Accompanying Detail Product B */}
        <figure
          ref={rightCardRef}
          className="group col-span-1 mb-0 grid max-w-none gap-1.5 justify-self-stretch self-start will-change-transform md:col-start-3 md:mb-[5%] md:max-w-[150px] md:justify-self-end md:self-end lg:max-w-[190px]"
        >
          <a
            href={`/product/${sideProductB.slug}`}
            className="block aspect-[4/5] overflow-hidden border border-line bg-surface transition-[border-color] duration-300 hover:border-bone focus-visible:border-bone"
            aria-label={`View ${sideProductB.name}`}
          >
            <img
              src={sideProductB.image}
              alt={sideProductB.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-sf group-hover:scale-105"
            />
          </a>
          <figcaption className="grid gap-0.5">
            <span className="mono tracking-[0.1em] text-bone text-[10px]">
              {sideProductB.tag}
            </span>
            <span className="mono tracking-[0.01em] text-muted normal-case text-[10px]">
              {sideProductB.name} · {money(sideProductB.price)}
            </span>
          </figcaption>
        </figure>
      </div>

      {/* 3. Floating Foreground Parallax Spec Pill */}
      <div
        ref={badgeRef}
        className="pointer-events-none absolute bottom-9 left-1/2 z-20 hidden md:block will-change-transform"
        style={{ transform: 'translate3d(-50%, 0, 0)' }}
      >
        <div className="pointer-events-auto inline-flex items-center gap-3 border border-line-strong bg-ink/90 px-3.5 py-1.5 shadow-lg backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          <span className="mono text-[10px] text-bone">
            {product.tag} / {product.name.toUpperCase()} / {product.color.toUpperCase()} / {money(product.price)}
          </span>
          <a
            href={`/product/${product.slug}`}
            className="mono text-[10px] text-accent underline underline-offset-4 hover:text-bone"
          >
            DETAILS
          </a>
        </div>
      </div>

      {/* Full-bleed divider band closing the hero */}
      <div className="-mx-4 mt-3 h-5 bg-bone md:-mx-9 md:mt-4 md:h-7" aria-hidden="true" />
    </section>
  )
}
