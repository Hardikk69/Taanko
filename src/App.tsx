import Footer from './components/Footer'
import Nav from './components/Nav'
import Runway from './components/Runway'
import { products } from './data'
import './App.css'

export default function App() {
  return (
    <>
      <a className="skip mono" href="#main">
        SKIP TO CONTENT
      </a>

      <Nav />

      <main id="main">
        <Runway />

        <section className="index" aria-labelledby="index-head">
          <div className="index-head">
            <h2 id="index-head" className="mono muted">
              AW26 INDEX / {String(products.length).padStart(2, '0')} PIECES
            </h2>
            <a href="/shop" className="mono index-all">
              VIEW ALL
            </a>
          </div>

          <ul className="grid">
            {products.map((p) => (
              <li key={p.slug}>
                <a className="card" href={`/product/${p.slug}`}>
                  <div className="card-crop">
                    <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
                  </div>
                  <div className="card-row">
                    <span className="card-name">{p.name}</span>
                    <span className="mono">£{p.price}</span>
                  </div>
                  <span className="mono muted">{p.color}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  )
}
