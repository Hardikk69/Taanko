const COLS = [
  {
    tone: 'text-coral-ink',
    head: 'SHOP',
    links: [
      { label: 'Clothing', href: '/shop?c=clothing' },
      { label: 'Totes', href: '/shop?c=totes' },
      { label: 'Purses', href: '/shop?c=purses' },
      { label: 'Accessories', href: '/shop?c=accessories' },
    ],
  },
  {
    tone: 'text-green-ink',
    head: 'INFO',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
  },
  {
    tone: 'text-pink-ink',
    head: 'CONTACT',
    links: [
      { label: 'Stockists', href: '/stockists' },
      { label: 'Press', href: '/press' },
      { label: 'Instagram', href: 'https://instagram.com/taanko' },
    ],
  },
]

const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line px-4 md:px-9">
      <div className="flex flex-col justify-between gap-9 pt-9 pb-8 md:flex-row md:gap-12 md:pt-14 md:pb-12">
        <div>
          <p className="mb-2.5 font-serif text-[clamp(48px,8vw,112px)] leading-[0.92] font-normal tracking-[-0.02em]">
            Taanko
          </p>
          <p className="mono text-muted">HAND-EMBROIDERY HOUSE</p>
        </div>

        <div className="flex flex-none flex-wrap gap-8 md:flex-nowrap md:gap-14">
          {COLS.map((c) => (
            <div key={c.head}>
              <p className={'mono ' + c.tone}>{c.head}</p>
              <ul className="mt-3 grid gap-0.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="inline-flex min-h-8 items-center text-bone-60 transition-colors duration-300 ease-sf hover:text-bone focus-visible:text-bone"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-4 pb-6">
        <span className="mono text-muted">© 2026 TAANKO</span>
        <ul className="flex items-center gap-5">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="mono inline-flex min-h-8 items-center text-muted transition-colors duration-300 ease-sf hover:text-bone focus-visible:text-bone"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="mono text-muted">LONDON</span>
      </div>
    </footer>
  )
}
