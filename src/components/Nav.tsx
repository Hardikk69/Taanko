import { useEffect, useState } from 'react'
import './Nav.css'

const LINKS = [
  { label: 'AW26', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'LOOKBOOK', href: '/lookbook' },
  { label: 'ARCHIVE', href: '/archive' },
  { label: 'ABOUT', href: '/about' },
]

const CURRENT = 'AW26'

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
    <header className="nav">
      <a className="nav-logo" href="/">
        <span className="nav-mark">STATIC FORM</span>
      </a>

      <nav className="nav-links" aria-label="Primary">
        <ul>
          {LINKS.map((l) => {
            const on = l.label === CURRENT
            return (
              <li key={l.label}>
                <a
                  className={'mono nav-link' + (on ? ' on' : '')}
                  href={l.href}
                  aria-current={on ? 'page' : undefined}
                >
                  {on && <span className="nav-dot" aria-hidden="true" />}
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="nav-right">
        <button type="button" className="mono nav-bag">
          BAG ({bagCount})
        </button>
        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={'burger' + (open ? ' on' : '')} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div
        id="nav-sheet"
        className={'nav-sheet' + (open ? ' on' : '')}
        hidden={!open}
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a className="serif nav-sheet-link" href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
