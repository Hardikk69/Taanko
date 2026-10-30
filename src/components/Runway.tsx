import { useCallback, useEffect, useRef, useState } from 'react'
import { bySlug, looks, money, toneSwatch } from '../data'
import type { Look, Product } from '../data'
import './Runway.css'

const pad = (n: number) => String(n).padStart(2, '0')
const LAST = looks.length - 1
/** How long the pointer must rest on a hotspot before the panel opens. */
const HOVER_DELAY = 1000

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
      className={'sfr' + (spot ? ' open' : '')}
      aria-roledescription="carousel"
      aria-label="AW26 runway"
      role="region"
    >
      <div
        className="stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={`Look ${pad(look.id)} of ${looks.length}. Use arrow keys to change look.`}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current.active = false)}
      >
        <div className="ghost serif" aria-hidden="true">
          {pad(look.id)}
        </div>

        <div className="rail-mask">
          <div className="rail" style={{ '--i': i } as React.CSSProperties}>
            {looks.map((l, n) => {
              const cur = n === i
              return (
                <figure
                  key={l.id}
                  className={'slide' + (cur ? ' cur' : '')}
                  style={{ '--n': n } as React.CSSProperties}
                  onClick={cur ? undefined : () => go(n)}
                  aria-hidden={!cur}
                >
                  <div className="clip">
                    <img
                      src={l.image}
                      alt={cur ? `${l.title[0]} ${l.title[1]}` : ''}
                      draggable={false}
                      loading={n <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <span className="dim" style={{ opacity: cur ? 0 : 0.55 }} />
                    <span className="sno mono">{pad(l.id)}</span>
                  </div>

                  <div className="spots">
                    {l.hotspots.map((h, k) => {
                      const prod = bySlug(h.product)
                      if (!prod) return null
                      const on = cur && spot === h.product
                      return (
                        <button
                          key={h.product}
                          type="button"
                          className={'hs' + (on ? ' on' : '') + (h.x > 55 ? ' left' : '')}
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
                          <span className="hs-dot" />
                          <span className="hs-label mono">
                            <b>{pad(k + 1)}</b>
                            <span className="hs-name">{prod.name}</span>
                          </span>
                          {on && <span className="connector" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                </figure>
              )
            })}
          </div>
        </div>

        <div className="meta">
          <div className="meta-in" key={look.id}>
            <span className="mask">
              <span className="mask-in">
                <span className="mono mono-m">{spec}</span>
              </span>
            </span>

            <div className="meta-mid">
            <h1>
              <span className="mask serif">
                <span className="mask-in">{look.title[0]}</span>
              </span>
              <span className="mask serif">
                <span className="mask-in italic">{look.title[1]}</span>
              </span>
            </h1>

            <span className="mask note">
              <span className="mask-in">{look.note}</span>
            </span>

            <span className="mask">
              <span className="mask-in">
                <ul className="items">
                  {look.hotspots.map((h, k) => {
                    const prod = bySlug(h.product)
                    if (!prod) return null
                    return (
                      <li key={h.product}>
                        <button
                          type="button"
                          className={'item' + (spot === h.product ? ' on' : '')}
                          aria-expanded={spot === h.product}
                          onPointerEnter={() => hoverSpot(h.product)}
                          onPointerLeave={() => closeSpot()}
                          onFocus={() => openSpot(h.product)}
                          onClick={() =>
                            spot === h.product ? closeSpot(0) : openSpot(h.product)
                          }
                        >
                          <span className="mono muted item-n">{pad(k + 1)}</span>
                          <span className="item-name">{prod.name}</span>
                          <span className="mono item-p">{money(prod.price)}</span>
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

        <div className="ctrl">
          <div className="ticks">
            <span className="mono" aria-live="polite">
              {pad(look.id)} / {pad(looks.length)}
            </span>
            <ul>
              {looks.map((l, n) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className={'tick' + (n === i ? ' on' : '')}
                    aria-label={`Go to look ${pad(l.id)}`}
                    aria-current={n === i}
                    onClick={() => go(n)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="btns">
            <button
              type="button"
              className="prev"
              onClick={prev}
              disabled={i === 0}
              aria-label="Previous look"
            >
              <Arrow dir="left" />
            </button>
            <button type="button" className="next mono mono-m" onClick={next}>
              <span>NEXT LOOK</span>
              <Arrow dir="right" />
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

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
      className="pd side"
      role="dialog"
      aria-modal="false"
      aria-label={product.name}
      onPointerEnter={onHold}
      onPointerLeave={onRelease}
    >
      <header className="pd-head">
        <span className="mono muted">
          LOOK {pad(look.id)} / PIECE {pad(index + 1)} OF {pad(look.hotspots.length)}
        </span>
        <button type="button" className="ib" onClick={onClose}>
          <span className="sr">Close details</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </header>

      <div className="pd-body">
        <div className="pd-crop">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
          <span className="cross" aria-hidden="true" />
          <span className="crop-tag mono">{product.sku}</span>
        </div>

        <div className="pd-title">
          <h2 className="pd-name">{product.name}</h2>
          <span className="mono">{money(product.price)}</span>
        </div>

        <div className="pd-meta">
          <span className="swatch" style={{ background: toneSwatch[product.tone] }} />
          <span className="mono muted">
            {product.color.toUpperCase()} / {product.sku}
          </span>
        </div>

        <fieldset>
          <legend className="mono muted">SIZE</legend>
          <div className="sizes">
            {product.sizes.map((s) => {
              const out = product.soldOut.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  className={'size' + (size === s ? ' on' : '')}
                  disabled={out}
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                >
                  {s}
                  {out && <span className="sr"> sold out</span>}
                </button>
              )
            })}
          </div>
        </fieldset>

        <p className="pd-desc">{product.short}</p>

        <div className="pd-more">
          <p className="mono muted">IN THIS LOOK</p>
          <ul>
            {look.hotspots.map((h) => {
              const other = bySlug(h.product)
              if (!other) return null
              return (
                <li key={h.product}>
                  <button
                    type="button"
                    className={'chip' + (h.product === product.slug ? ' on' : '')}
                    aria-label={other.name}
                    onPointerEnter={() => onPick(h.product)}
                    onClick={() => onPick(h.product)}
                  >
                    <img src={other.image} alt="" draggable={false} loading="lazy" />
                    <span className="mono">{other.tag}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <footer className="pd-foot">
        <button type="button" className="btn" disabled={!size}>
          <span>{size ? 'ADD TO BAG' : 'SELECT A SIZE'}</span>
          <span>{money(product.price)}</span>
        </button>
        <a href={`/product/${product.slug}`} className="full mono">
          FULL DETAILS <Arrow dir="right" />
        </a>
      </footer>
    </aside>
  )
}
