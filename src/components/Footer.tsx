import './Footer.css'

const COLS = [
  { head: 'SHOP', links: ['Outerwear', 'Knit', 'Shirts', 'Trousers', 'Objects'] },
  { head: 'INFO', links: ['About', 'Shipping', 'Returns', 'Privacy'] },
  { head: 'CONTACT', links: ['Stockists', 'Press', 'Instagram'] },
]

export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-top">
        <div className="ft-brand">
          <p className="serif ft-word">Static Form</p>
          <p className="mono muted">AUTUMN / WINTER 2026</p>
        </div>

        <div className="ft-cols">
          {COLS.map((c) => (
            <div key={c.head} className="ft-col">
              <p className="mono muted">{c.head}</p>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="ft-link">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="ft-bar">
        <span className="mono muted">© 2026 STATIC FORM</span>
        <span className="mono muted">LONDON</span>
      </div>
    </footer>
  )
}
