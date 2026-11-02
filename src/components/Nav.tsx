import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'AW26', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'LOOKBOOK', href: '/lookbook' },
  { label: 'ARCHIVE', href: '/archive' },
  { label: 'ABOUT', href: '/about' },
]

const CURRENT =
  LINKS.find((l) => l.href !== '/' && window.location.pathname.startsWith(l.href))?.label ??
  'AW26'

export default function Nav({ bagCount = 0 }: { bagCount?: number }) {
  const [open, setOpen] = useState(false)

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
    <header className="fixed inset-x-0 top-0 z-20 flex h-[46px] items-center gap-[20px] border-b border-line bg-ink px-4 md:h-[50px] md:px-9">
      <a className="inline-flex min-h-8 flex-none items-center" href="/">
        <span className="font-mono text-xs font-medium tracking-[0.16em] uppercase">
          TAANKO
        </span>
      </a>

      {/* Vertical rule between the wordmark and the links */}
      <nav
        className="relative hidden pl-[20px] before:absolute before:top-1/2 before:left-0 before:-mt-2 before:h-4 before:border-l before:border-line-strong before:content-[''] md:block"
        aria-label="Primary"
      >
        <ul className="flex items-center gap-0.5">
          {LINKS.map((l) => {
            const on = l.label === CURRENT
            return (
              <li key={l.label}>
                <a
                  className={
                    'mono relative inline-flex min-h-8 items-center gap-[6px] px-2.5 transition-colors duration-300 ease-sf hover:text-bone focus-visible:text-bone ' +
                    (on ? 'text-bone underline underline-offset-[5px]' : 'text-bone-60')
                  }
                  href={l.href}
                  aria-current={on ? 'page' : undefined}
                >
                  {on && (
                    <span className="size-[5px] flex-none rounded-full bg-accent" aria-hidden="true" />
                  )}
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="ml-auto flex flex-none items-center gap-1">
        <button
          type="button"
          className="mono inline-flex min-h-8 items-center border border-line-strong px-2.5 py-1 text-[11px] transition-[border-color,background-color,transform] duration-300 hover:border-coral-ink hover:bg-coral-12 hover:text-coral-ink active:scale-[0.97]"
          aria-label={`Bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
        >
          BAG ({bagCount})
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

      <div
        id="nav-sheet"
        className={
          'fixed inset-x-0 bottom-0 top-[46px] bg-ink px-4 pt-2 md:top-[50px] md:px-9 ' +
          (open ? 'block md:hidden' : 'hidden')
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
                    'block border-b border-line py-2.5 font-serif text-[40px] leading-[1.2] font-normal tracking-[-0.01em] transition-colors duration-300 ease-sf ' +
                    (on ? 'text-bone' : 'text-bone-60')
                  }
                  href={l.href}
                  aria-current={on ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
