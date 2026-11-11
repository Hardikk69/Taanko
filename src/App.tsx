import About from './pages/About'
import Footer from './components/Footer'
import Nav from './components/Nav'
import CustomOrder from './pages/CustomOrder'
import Home from './pages/Home'
import Journal from './pages/Journal'
import Product from './pages/Product'
import Shopping from './pages/Shopping'

export default function App() {
  // ponytail: pathname read once, full page loads only. Add a router when a
  // link needs to switch pages without a reload.
  const path = window.location.pathname

  return (
    <>
      <a
        className="mono absolute left-4 md:left-9 -top-[100px] z-100 bg-bone px-4 py-2.5 text-ink transition-[top] duration-200 focus:top-2.5"
        href="#main"
      >
        SKIP TO CONTENT
      </a>

      <Nav />

      <main id="main" className="pt-[46px] md:pt-[50px]">
        {path === '/shop' ? (
          <Shopping />
        ) : path.startsWith('/product') ? (
          <Product />
        ) : path.startsWith('/journal') ? (
          <Journal />
        ) : path.startsWith('/about') ? (
          <About />
        ) : path.startsWith('/lookbook') ? (
          <CustomOrder />
        ) : (
          <Home />
        )}
      </main>

      <Footer />
    </>
  )
}
