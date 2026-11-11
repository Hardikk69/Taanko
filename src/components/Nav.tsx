import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'CUSTOM ORDER', href: '/lookbook' },
  { label: 'ABOUT', href: '/about' },
  { label: 'JOURNAL', href: '/journal' },
]

const CURRENT =
  LINKS.find(
    (l) =>
      l.href !== '/' &&
      window.location.pathname.replace(/^\/product/, '/shop').startsWith(l.href),
  )?.label ??
  'HOME'

export default function Nav({ bagCount = 0 }: { bagCount?: number }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Shrink + lift the bar once the page scrolls past the hero's top strip.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on Escape and lock scroll while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div
        className={
          'mx-auto flex items-center gap-4 border-b transition-[height,background-color,border-color,backdrop-filter] duration-500 ease-sf ' +
          (scrolled
            ? 'h-[56px] border-line bg-ink/80 backdrop-blur-md'
            : 'h-[72px] border-transparent bg-transparent') +
          ' px-4 md:px-9'
        }
      >
        {/* Wordmark — serif, with a coral stitch dot */}
        <a className="group inline-flex flex-none items-baseline gap-1.5" href="/">
          <span className="font-serif text-[26px] leading-none tracking-[-0.02em] text-bone">
            Taanko
          </span>
          <span className="size-[6px] translate-y-[-2px] rounded-full bg-accent transition-transform duration-500 ease-sf group-hover:scale-125" />
        </a>

        {/* Center pill — primary links */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          aria-label="Primary"
        >
          <ul className="flex items-center gap-0.5 rounded-full border border-line bg-surface/60 p-1 backdrop-blur-sm">
            {LINKS.map((l) => {
              const on = l.label === CURRENT
              return (
                <li key={l.label}>
                  <a
                    className={
                      'mono relative inline-flex min-h-8 items-center rounded-full px-3.5 transition-colors duration-300 ease-sf ' +
                      (on
                        ? 'bg-ink text-bone shadow-soft'
                        : 'text-bone-60 hover:text-bone')
                    }
                    href={l.href}
                    aria-current={on ? 'page' : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex flex-none items-center gap-1.5">
          <button
            type="button"
            className="mono inline-flex min-h-8 items-center gap-1.5 rounded-full bg-bone px-4 py-1 text-[11px] text-ink transition-[transform,background-color] duration-300 ease-sf hover:bg-coral-ink active:scale-[0.97]"
            aria-label={`Bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
          >
            BAG
            <span className="grid size-[18px] place-items-center rounded-full bg-ink/20 text-[10px] tabular-nums">
              {bagCount}
            </span>
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center md:hidden"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="relative block h-2.5 w-[18px]" aria-hidden="true">
              <i
                className={
                  'absolute inset-x-0 top-0 h-px bg-bone transition-transform duration-[450ms] ease-sf ' +
                  (open ? 'translate-y-[4.5px] rotate-45' : '')
                }
              />
              <i
                className={
                  'absolute inset-x-0 bottom-0 h-px bg-bone transition-transform duration-[450ms] ease-sf ' +
                  (open ? '-translate-y-[4.5px] -rotate-45' : '')
                }
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="nav-sheet"
        className={
          'fixed inset-x-0 bottom-0 top-[56px] bg-ink px-4 pt-2 md:hidden ' +
          (open ? 'block' : 'hidden')
        }
        hidden={!open}
      >
        <ul className="grid">
          {LINKS.map((l) => {
            const on = l.label === CURRENT
            return (
              <li key={l.label}>
                <a
                  className={
                    'flex items-center justify-between border-b border-line py-2.5 font-serif text-[40px] leading-[1.2] font-normal tracking-[-0.01em] transition-colors duration-300 ease-sf ' +
                    (on ? 'text-bone' : 'text-bone-60')
                  }
                  href={l.href}
                  aria-current={on ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                  {on && <span className="size-2 rounded-full bg-accent" aria-hidden="true" />}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
