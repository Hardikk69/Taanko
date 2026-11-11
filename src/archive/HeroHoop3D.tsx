import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { products, money } from '../data'
import type { Product } from '../data'

/**
 * Scroll-driven WebGL hero: a wooden embroidery hoop with cloth stretched in
 * it, the featured piece printed on the cloth, and a coral thread being sewn
 * round the hoop by a steel needle. Each scroll chapter turns the hoop
 * edge-on and swaps the piece at the moment the cloth is invisible.
 */
const CHAPTERS = [
  {
    slug: 'raw-wool-coat',
    title: 'Stretched on the hoop.',
    body: 'Every piece starts as plain cloth pulled drum-tight in a wooden hoop.',
  },
  {
    slug: 'soft-knit-02',
    title: 'Sewn by one hand.',
    body: 'One needle, one thread, a full day on the frame. No machines in between.',
  },
  {
    slug: 'wide-trouser-03',
    title: 'Made to be worn.',
    body: 'Clothing, totes, purses and small objects, in runs that are never repeated.',
  },
]

const CLOTH = 1.9 // cloth radius incl. the part that drapes behind the hoop
const INNER = 1.55 // where the hoop grips the cloth
const STITCH_R = 1.36 // radius of the running stitch

type Shared = { p: number; px: number; py: number; onChapter: (n: number) => void }

/** Linen disc with a ragged edge; the photo fills the part inside the hoop. */
function clothCanvas(img: HTMLImageElement | null) {
  const S = 1024
  const mid = S / 2
  const rIn = (mid * INNER) / CLOTH
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')!

  g.beginPath()
  for (let i = 0; i <= 240; i++) {
    const a = (i / 240) * Math.PI * 2
    const r = mid * (0.95 + 0.025 * Math.sin(a * 37) * Math.sin(a * 11))
    const x = mid + Math.cos(a) * r
    const y = mid + Math.sin(a) * r
    if (i) g.lineTo(x, y)
    else g.moveTo(x, y)
  }
  g.fillStyle = '#ece4ca'
  g.fill()
  g.save()
  g.clip()
  g.fillStyle = 'rgba(132,74,52,0.07)' // weave
  for (let v = 0; v < S; v += 4) {
    g.fillRect(v, 0, 1, S)
    g.fillRect(0, v, S, 1)
  }
  g.restore()

  if (img) {
    g.save()
    g.beginPath()
    g.arc(mid, mid, rIn, 0, Math.PI * 2)
    g.clip()
    const s = Math.max((2 * rIn) / img.width, (2 * rIn) / img.height)
    const w = img.width * s
    const h = img.height * s
    g.drawImage(img, mid - w / 2, mid - rIn - (h - 2 * rIn) * 0.18, w, h)
    // Soft shade where the cloth dips into the hoop.
    const shade = g.createRadialGradient(mid, mid, rIn * 0.8, mid, mid, rIn)
    shade.addColorStop(0, 'rgba(60,30,20,0)')
    shade.addColorStop(1, 'rgba(60,30,20,0.28)')
    g.fillStyle = shade
    g.fillRect(0, 0, S, S)
    g.restore()
  }
  return c
}

/** Beech grain running along the ring: long wavy streaks plus fine pores. */
function woodCanvas() {
  const W = 2048
  const H = 128
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = '#c99862'
  g.fillRect(0, 0, W, H)
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 70; i++) {
    const y0 = rnd() * H
    const amp = 2 + rnd() * 6
    const freq = 0.002 + rnd() * 0.006
    const dark = rnd() < 0.5
    g.strokeStyle = dark
      ? `rgba(120,68,32,${0.12 + rnd() * 0.25})`
      : `rgba(240,200,150,${0.08 + rnd() * 0.15})`
    g.lineWidth = 0.6 + rnd() * 2.2
    g.beginPath()
    for (let x = 0; x <= W; x += 16) {
      const y = y0 + Math.sin(x * freq + i) * amp
      if (x) g.lineTo(x, y)
      else g.moveTo(x, y)
    }
    g.stroke()
  }
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = `rgba(90,50,25,${rnd() * 0.18})`
    g.fillRect(rnd() * W, rnd() * H, 2 + rnd() * 5, 1)
  }
  return c
}

/** Plain-weave height map for the linen: warp and weft rising and dipping. */
function weaveCanvas() {
  const S = 64
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')!
  const img = g.createImageData(S, S)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const cx = (x % 8) / 8
      const cy = (y % 8) / 8
      const over = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0
      const v = over ? Math.sin(cy * Math.PI) : Math.sin(cx * Math.PI)
      const n = 110 + v * 120 + (Math.random() - 0.5) * 30
      const i = (y * S + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = n
      img.data[i + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)
  return c
}

/** Six-strand floss: diagonal twist stripes. */
function flossCanvas() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const g = c.getContext('2d')!
  g.fillStyle = '#fff'
  g.fillRect(0, 0, 64, 64)
  g.strokeStyle = '#6a6a6a'
  g.lineWidth = 5
  for (let i = -64; i < 128; i += 11) {
    g.beginPath()
    g.moveTo(i, 0)
    g.lineTo(i + 64, 64)
    g.stroke()
  }
  return c
}

function startScene(canvas: HTMLCanvasElement, shared: Shared, pieces: Product[]) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  scene.environmentIntensity = 0.55

  // Warm window key (casts shadows), cool fill, and a rim from behind.
  const sun = new THREE.DirectionalLight('#fff0dc', 2.4)
  sun.position.set(-3.5, 4.5, 6)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -5
  sun.shadow.camera.right = sun.shadow.camera.top = 5
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 20
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.02
  sun.shadow.radius = 6
  const fill = new THREE.DirectionalLight('#dfe8ff', 0.5)
  fill.position.set(4, -1, 3)
  const rim = new THREE.DirectionalLight('#ffd6b0', 1.2)
  rim.position.set(2, 3, -4)
  scene.add(sun, fill, rim)

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  const hoop = new THREE.Group()
  const stage = new THREE.Group() // layout offset; hoop handles rotation
  stage.add(hoop)
  scene.add(stage)

  // Soft shadow the hoop throws onto the page behind it.
  const catcher = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ color: '#4a2a1a', opacity: 0.18 }),
  )
  catcher.position.z = -1.6
  catcher.receiveShadow = true
  stage.add(catcher)

  const aniso = renderer.capabilities.getMaxAnisotropy()
  const tex = (c: HTMLCanvasElement, srgb: boolean, rx = 1, ry = 1) => {
    const t = new THREE.CanvasTexture(c)
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(rx, ry)
    t.anisotropy = aniso
    return t
  }
  const woodC = woodCanvas()
  const woodMap = tex(woodC, true, 1, 1)
  const woodBump = tex(woodC, false, 1, 1)
  const weave = tex(weaveCanvas(), false, 46, 46)
  const flossC = flossCanvas()
  const flossBump = tex(flossC, false, STITCH_R * 160, 1)

  // Cloth textures, one per piece. Plain linen until the photo loads.
  const textures = pieces.map((piece) => {
    const t = new THREE.CanvasTexture(clothCanvas(null))
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = aniso
    const img = new Image()
    img.onload = () => {
      t.image = clothCanvas(img)
      t.needsUpdate = true
    }
    img.src = piece.image
    return t
  })

  // Cloth: dense grid, alpha-cut to the ragged disc, displaced every frame.
  const clothGeo = new THREE.PlaneGeometry(CLOTH * 2, CLOTH * 2, 110, 110)
  const base = Float32Array.from(clothGeo.attributes.position.array)
  const clothMat = new THREE.MeshPhysicalMaterial({
    map: textures[0],
    bumpMap: weave,
    bumpScale: 1.4,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
    roughness: 0.95,
    sheen: 1,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color('#fff6e6'),
  })
  const cloth = new THREE.Mesh(clothGeo, clothMat)
  cloth.castShadow = cloth.receiveShadow = true
  hoop.add(cloth)

  const wood = new THREE.MeshPhysicalMaterial({
    map: woodMap,
    bumpMap: woodBump,
    bumpScale: 0.6,
    roughness: 0.42,
    clearcoat: 0.35, // light lacquer
    clearcoatRoughness: 0.45,
  })
  const steel = new THREE.MeshStandardMaterial({ color: '#e4e4e4', metalness: 1, roughness: 0.18 })
  const brass = new THREE.MeshStandardMaterial({ color: '#c9a35a', metalness: 1, roughness: 0.32 })

  // Outer ring is split at the top where the screw closes it.
  const GAP = 0.09
  const outer = new THREE.Mesh(new THREE.TorusGeometry(1.64, 0.07, 32, 220, Math.PI * 2 - GAP), wood)
  outer.rotation.z = Math.PI / 2 + GAP / 2
  const inner = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.058, 28, 220), wood)
  inner.position.z = -0.075
  const lugGeo = new THREE.BoxGeometry(0.11, 0.24, 0.15, 1, 1, 1)
  const lugL = new THREE.Mesh(lugGeo, wood)
  const lugR = new THREE.Mesh(lugGeo, wood)
  lugL.position.set(-0.085, 1.75, 0)
  lugR.position.set(0.085, 1.75, 0)
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.46, 20), brass)
  screw.rotation.z = Math.PI / 2
  screw.position.set(0.02, 1.8, 0)
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.07, 32), brass)
  knob.rotation.z = Math.PI / 2
  knob.position.set(0.26, 1.8, 0)
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 6), brass)
  nut.rotation.z = Math.PI / 2
  nut.position.set(-0.2, 1.8, 0)
  for (const m of [outer, inner, lugL, lugR, screw, knob, nut]) {
    m.castShadow = m.receiveShadow = true
    hoop.add(m)
  }

  // Running stitch: the thread dips under the cloth every other step,
  // so the opaque cloth hides those parts and leaves separate stitches.
  const STITCHES = 44
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < STITCHES * 4; i++) {
    const a = Math.PI / 2 - (i / (STITCHES * 4)) * Math.PI * 2
    const z = [0.022, 0.022, -0.035, -0.035][i % 4]
    pts.push(new THREE.Vector3(Math.cos(a) * STITCH_R, Math.sin(a) * STITCH_R, z))
  }
  const curve = new THREE.CatmullRomCurve3(pts, true)
  const SEG = STITCHES * 24
  const RAD = 6
  const threadGeo = new THREE.TubeGeometry(curve, SEG, 0.017, RAD, true)
  const threadMat = new THREE.MeshPhysicalMaterial({
    color: '#e8283f',
    bumpMap: flossBump,
    bumpScale: 2,
    roughness: 0.55,
    sheen: 1,
    sheenRoughness: 0.35,
    sheenColor: new THREE.Color('#ff9aa6'),
  })
  const thread = new THREE.Mesh(threadGeo, threadMat)
  thread.castShadow = true
  hoop.add(thread)

  // Needle: tapered shaft, point, and an open eye at the top.
  const NEEDLE_LEN = 0.62
  const needle = new THREE.Group()
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.008, NEEDLE_LEN, 16), steel)
  shaft.position.y = NEEDLE_LEN / 2
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.07, 16), steel)
  tip.rotation.x = Math.PI
  tip.position.y = -0.035
  const eye = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.005, 8, 24), steel)
  eye.scale.set(0.7, 1.6, 1)
  eye.position.y = NEEDLE_LEN - 0.03
  needle.add(shaft, tip, eye)
  needle.traverse((o) => (o.castShadow = true))
  needle.rotation.set(Math.PI / 2 - 0.5, 0, -0.4) // lean out of the cloth toward the viewer
  hoop.add(needle)
  const eyeOffset = new THREE.Vector3(0, NEEDLE_LEN - 0.03, 0).applyEuler(needle.rotation)

  // Loose tail running from the last stitch up through the needle's eye.
  const tail = new THREE.Mesh(new THREE.BufferGeometry(), threadMat)
  tail.castShadow = true
  hoop.add(tail)
  const tailCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  )

  // Layout: hoop sits right of the copy on wide screens, above it on narrow.
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    const aspect = w / h
    camera.aspect = aspect
    const wide = aspect > 1.1
    const fit = wide ? 4.6 : 4.4 / Math.min(1, aspect)
    camera.position.z = fit / (2 * Math.tan(THREE.MathUtils.degToRad(16)))
    camera.updateProjectionMatrix()
    const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(16))
    stage.position.set(wide ? visH * aspect * 0.2 : 0, wide ? 0 : visH * 0.14, 0)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const cur = { p: shared.p, px: 0, py: 0 }
  const pos = clothGeo.attributes.position as THREE.BufferAttribute
  const tmp = new THREE.Vector3()
  const clock = new THREE.Clock()
  let chapter = -1
  let frame = 0
  let visible = true

  const tick = () => {
    frame = 0
    const t = reduced ? 0 : clock.getElapsedTime()
    const k = reduced ? 1 : 0.08
    cur.p += (shared.p - cur.p) * k
    cur.px += (shared.px - cur.px) * 0.06
    cur.py += (shared.py - cur.py) * 0.06

    // Chapter turn: face-on mid chapter, edge-on at each boundary.
    const n = pieces.length
    const seg = Math.min(cur.p * n, n - 0.0001)
    const idx = Math.floor(seg)
    let f = seg - idx - 0.5
    if (idx === 0) f = Math.max(f, 0)
    if (idx === n - 1) f = Math.min(f, 0)
    const turn = Math.sign(f) * Math.pow(Math.abs(2 * f), 3)
    const calm = 1 - turn * turn // mouse tilt fades near edge-on so the swap stays hidden
    hoop.rotation.y = (turn * Math.PI) / 2 + cur.px * 0.35 * calm
    hoop.rotation.x = -0.14 + cur.py * 0.25 + Math.sin(t * 0.6) * 0.03
    hoop.rotation.z = 0.06 + Math.sin(t * 0.4) * 0.02
    hoop.position.y = Math.sin(t * 0.8) * 0.05
    if (idx !== chapter) {
      chapter = idx
      clothMat.map = textures[idx]
      shared.onChapter(idx)
    }

    // Cloth: gentle breathing inside the hoop, drape behind it outside.
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      const d = Math.hypot(x, y)
      let z: number
      let dy = 0
      if (d < INNER) {
        z = 0.018 * Math.sin(t * 1.3 - d * 3) * (1 - (d / INNER) ** 2)
      } else {
        const e = d - INNER
        z = -e * e * 2.4 - e * 0.35
        dy = -e * e * 0.9
      }
      pos.setXYZ(i, x, y + dy, z)
    }
    pos.needsUpdate = true
    clothGeo.computeVertexNormals()

    // Thread sews itself round as you scroll; the needle rides its end.
    const sewn = Math.min(1, 0.06 + cur.p * 1.02)
    const count = Math.floor(sewn * SEG) * RAD * 6
    threadGeo.setDrawRange(0, count)
    curve.getPointAt(Math.min(sewn, 0.9999), tmp)
    // Needle hovers just ahead of the sewn end, pulling the tail taut on each lift.
    const lift = Math.abs(Math.sin(t * 2.2))
    needle.position.set(tmp.x, tmp.y, 0.04 + lift * 0.14)
    tailCurve.v0.set(tmp.x, tmp.y, 0.02)
    tailCurve.v2.copy(needle.position).add(eyeOffset)
    tailCurve.v1
      .copy(tailCurve.v0)
      .lerp(tailCurve.v2, 0.5)
      .add(new THREE.Vector3(0, -0.25 * (1 - lift), 0.05))
    tail.geometry.dispose()
    tail.geometry = new THREE.TubeGeometry(tailCurve, 24, 0.015, 6, false)

    renderer.render(scene, camera)
    if (visible && !reduced) frame = requestAnimationFrame(tick)
  }

  const kick = () => {
    if (!frame) frame = requestAnimationFrame(tick)
  }
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) kick()
  })
  io.observe(canvas)
  kick()

  return {
    kick,
    stop() {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose()
      })
      for (const m of [clothMat, wood, steel, brass, threadMat, catcher.material]) m.dispose()
      for (const t of [...textures, woodMap, woodBump, weave, flossBump]) t.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chapter, setChapter] = useState(0)
  const [failed, setFailed] = useState(false)
  const pieces = CHAPTERS.map((c) => products.find((p) => p.slug === c.slug) ?? products[0])
  const piece = pieces[chapter]

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const shared: Shared = { p: 0, px: 0, py: 0, onChapter: setChapter }

    let scene: ReturnType<typeof startScene>
    try {
      scene = startScene(canvas, shared, pieces)
    } catch {
      setFailed(true) // no WebGL: copy and photo fallback still render
      return
    }

    const onScroll = () => {
      const r = section.getBoundingClientRect()
      const travel = r.height - window.innerHeight || 1
      shared.p = Math.min(1, Math.max(0, -r.top / travel))
      section.style.setProperty('--p', shared.p.toFixed(4))
      scene.kick()
    }
    const onPointer = (e: PointerEvent) => {
      shared.px = (e.clientX / window.innerWidth - 0.5) * 2
      shared.py = (e.clientY / window.innerHeight - 0.5) * 2
      scene.kick()
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
      scene.stop()
    }
    // pieces derive from constants; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[300svh] [--p:0]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        {failed ? (
          <img
            src={piece.image}
            alt=""
            className="absolute top-[8%] right-4 aspect-square w-[min(80vw,520px)] rounded-full object-cover object-[50%_18%] md:right-[8%] md:top-1/2 md:-translate-y-1/2"
          />
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        )}

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end bg-gradient-to-t from-ink via-ink/70 to-transparent to-45% px-4 pb-8 md:justify-center md:bg-none md:px-9 md:pb-0">
          <div className="pointer-events-auto max-w-[540px]">
            <h1 id="hero-title" className="mono flex items-center gap-2.5 text-coral-ink">
              <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
              Taanko AW26 · Hand-embroidered
            </h1>

            {/* All chapters share one grid cell so height never jumps. */}
            <div className="mt-4 grid">
              {CHAPTERS.map((c, n) => (
                <div
                  key={c.slug}
                  aria-hidden={n !== chapter}
                  className={
                    '[grid-area:1/1] transition-[opacity,transform] duration-700 ease-sf ' +
                    (n === chapter
                      ? 'translate-y-0 opacity-100'
                      : n < chapter
                        ? '-translate-y-6 opacity-0'
                        : 'translate-y-6 opacity-0')
                  }
                >
                  <p className="font-serif text-[clamp(46px,7vw,104px)] leading-[0.92] tracking-[-0.03em] text-bone">
                    {c.title}
                  </p>
                  <p className="mt-5 max-w-[40ch] text-[16px] leading-[1.6] text-muted">{c.body}</p>
                </div>
              ))}
            </div>

            <a
              href={`/product/${piece.slug}`}
              className="mono mt-6 inline-flex items-center gap-2 text-bone underline-offset-[5px] hover:text-coral-ink hover:underline"
            >
              On the hoop: {piece.name} · {money(piece.price)} <span aria-hidden="true">→</span>
            </a>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/shop"
                className="mono inline-flex min-h-12 items-center gap-2 rounded-full bg-bone px-6 text-ink transition-[background-color,transform] duration-300 ease-sf hover:bg-coral-ink active:scale-[0.97]"
              >
                Shop the collection <span aria-hidden="true">→</span>
              </a>
              <a
                href="/lookbook"
                className="mono inline-flex min-h-12 items-center rounded-full border border-line-strong px-6 text-bone transition-colors duration-300 ease-sf hover:border-bone hover:bg-bone-10"
              >
                Commission a piece
              </a>
            </div>

            {/* Chapter progress */}
            <div className="mt-9 flex items-center gap-3" aria-hidden="true">
              <span className="mono text-bone">0{chapter + 1}</span>
              <span className="relative h-px w-32 bg-line-strong">
                <span
                  className="absolute inset-y-0 left-0 bg-coral"
                  style={{ width: 'calc(var(--p) * 100%)', height: '2px', top: '-0.5px' }}
                />
              </span>
              <span className="mono text-muted">0{CHAPTERS.length}</span>
            </div>
          </div>
        </div>

        <p
          className="mono pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted transition-opacity duration-500 md:block"
          style={{ opacity: 'calc(1 - var(--p) * 12)' }}
          aria-hidden="true"
        >
          Scroll to sew ↓
        </p>
      </div>
    </section>
  )
}
