import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import RollButton from '../components/RollButton'
import { looks, toneSwatch } from '../data'
import type { Tone } from '../data'

const ORDER_EMAIL = 'studio@taanko.com'

// Each kind of piece shows its own photograph on the summary card.
const PIECES = [
  { name: 'Clothing', img: looks[0].image, pos: '50% 25%' },
  { name: 'Tote', img: looks[1].image, pos: '30% 55%' },
  { name: 'Purse', img: looks[6].image, pos: '35% 55%' },
  { name: 'Accessory', img: looks[5].image, pos: '55% 30%' },
  { name: 'Not sure yet', img: looks[7].image, pos: '50% 30%' },
]

const TONES = Object.keys(toneSwatch) as Tone[]

const STEPS = [
  { head: 'Brief', body: 'Tell us the idea: a motif, a monogram, a piece in your own colours.' },
  { head: 'Drawing & price', body: 'The studio replies within a week with a drawing and a quote.' },
  { head: 'Made by hand', body: 'Once you say yes, it is embroidered in our London workroom.' },
]

/** Field set into the sentence: underlined, grows with its text, entered words in madder.
    Autofill is held to the page colours so Chrome's blue box never shows. */
const FIELD =
  'mx-1 rounded-none border-b-2 border-bone/20 bg-transparent px-1 pb-0.5 font-serif text-accent caret-accent transition-colors duration-300 ease-sf [field-sizing:content] placeholder:text-bone/25 hover:border-bone/45 focus:border-accent focus:outline-none autofill:shadow-[inset_0_0_0_100px_var(--color-ink)] autofill:[-webkit-text-fill-color:var(--color-accent)]'
const INLINE = FIELD + ' min-w-[5ch]'

/**
 * Piece picker set into the sentence. Replaces a native select, whose open list
 * cannot be styled: a light panel with a photo per piece, opened by click or
 * keyboard (select-only combobox pattern: arrows move, Enter picks, Escape closes).
 */
function PiecePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLSpanElement>(null)
  const id = useId()
  const current = PIECES.findIndex((p) => p.name === value)

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  const show = () => {
    setActive(current)
    setOpen(true)
  }
  const pick = (i: number) => {
    onChange(PIECES[i].name)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const n = PIECES.length
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    if (e.key === 'ArrowDown') setActive((a) => (a + 1) % n)
    else if (e.key === 'ArrowUp') setActive((a) => (a - 1 + n) % n)
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(n - 1)
    else if (e.key === 'Enter' || e.key === ' ') pick(active)
    else if (e.key === 'Escape' || e.key === 'Tab') return setOpen(false)
    else return
    e.preventDefault()
  }

  return (
    <span ref={root} className="relative inline-block">
      <button
        type="button"
        role="combobox"
        aria-label="Kind of piece"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={FIELD + ' inline-flex cursor-pointer items-baseline gap-[0.25em] lowercase'}
      >
        {value}
        <span
          aria-hidden="true"
          className={'text-[0.4em] transition-transform duration-300 ease-sf ' + (open ? 'rotate-180' : '')}
        >
          ▼
        </span>
      </button>

      <ul
        id={id}
        role="listbox"
        aria-label="Kind of piece"
        className={
          'absolute top-full left-0 z-20 mt-3 w-[min(280px,78vw)] origin-top-left rounded-[20px] bg-bone p-2 font-sans text-[15px] leading-normal tracking-normal text-ink shadow-lift transition-[opacity,scale,visibility] duration-300 ease-sf ' +
          (open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0')
        }
      >
        {PIECES.map((p, i) => (
          <li
            key={p.name}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === current}
            onPointerEnter={() => setActive(i)}
            onClick={() => pick(i)}
            className={
              'flex cursor-pointer items-center gap-3 rounded-[14px] p-1.5 pr-3 transition-colors duration-200 ' +
              (i === active ? 'bg-ink/12' : '')
            }
          >
            <img
              src={p.img}
              alt=""
              loading="lazy"
              className="size-10 flex-none rounded-[10px] object-cover"
              style={{ objectPosition: p.pos }}
            />
            <span className="flex-1 font-medium">{p.name}</span>
            {i === current && (
              <span aria-hidden="true" className="text-accent">
                ✓
              </span>
            )}
          </li>
        ))}
      </ul>
    </span>
  )
}

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

export default function CustomOrder() {
  const [name, setName] = useState('')
  const [piece, setPiece] = useState(PIECES[1].name)
  const [qty, setQty] = useState(1)
  const [tones, setTones] = useState<Tone[]>(['madder'])
  const [brief, setBrief] = useState('')
  const [sent, setSent] = useState(false)

  const toggle = (t: Tone) => setTones((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))

  // No backend: compose a mailto draft from the form so the brief reaches the
  // studio. ponytail: mailto handoff, wire a real endpoint when orders scale.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = [
      `Name: ${name}`,
      `Email: ${f.get('email')}`,
      `Piece: ${qty} × ${piece}`,
      `Colours: ${tones.join(', ') || 'open to suggestion'}`,
      '',
      'The idea:',
      brief,
    ].join('\n')
    window.location.href =
      `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent('Custom order — ' + name)}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="px-4 pb-24 md:px-9 md:pb-36">
      {/* Hero, split: title, intro, action and the three steps on the left; one tall
          photograph running to the right edge. The photo unveils on load and sinks a
          little as the hero scrolls away (hero-timeline / hero-sink in index.css). */}
      <header
        className="hero-timeline -mx-4 grid md:-mr-9 md:-ml-9 md:h-[max(660px,calc(100svh-50px))] md:grid-cols-2 md:grid-rows-1"
        aria-labelledby="order-head"
      >
        <div className="flex flex-col justify-between gap-12 px-4 pt-12 md:gap-10 md:py-10 md:pr-14 md:pl-9 lg:pr-20">
          <div>
            <h1
              id="order-head"
              className="font-serif text-[clamp(56px,6.6vw,116px)] leading-[0.88] font-normal tracking-[-0.035em] text-bone"
            >
              {['Commission', 'a piece.'].map((w, i) => (
                <span key={w} className="block overflow-hidden pb-[0.06em]">
                  <span className="animate-rise block" style={delay(120 + i * 110)}>
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="animate-blur-in mt-6 max-w-[40ch] text-[17px] leading-[1.6] text-bone md:text-[18px]"
              style={delay(420)}
            >
              Something made only for you, embroidered by hand to your brief. Tell us the idea and the studio replies
              within a week.
            </p>
            <div className="animate-blur-in mt-8" style={delay(520)}>
              <RollButton href="#brief">Start your brief</RollButton>
            </div>
          </div>

          <ol className="grid gap-5">
            {STEPS.map((s, i) => (
              <li
                key={s.head}
                className="animate-blur-in grid grid-cols-[2.75rem_1fr] items-start gap-4"
                style={delay(640 + i * 90)}
              >
                <span className="font-serif text-[44px] leading-[0.8] text-accent tabular-nums">{i + 1}</span>
                <div>
                  <h2 className="text-[17px] font-medium text-bone">{s.head}</h2>
                  <p className="mt-1 max-w-[38ch] text-[15px] leading-[1.55] text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div
          className="animate-unveil order-first mt-6 aspect-[4/5] overflow-hidden bg-surface md:order-none md:mt-0 md:aspect-auto md:h-full"
          style={delay(200)}
        >
          <div className="hero-sink h-full">
            <img
              src={looks[2].image}
              alt="Model in a crisp white shirt and wide dark trousers against a concrete wall"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="animate-settle h-full w-full object-cover object-[50%_6%]"
              style={{ ...delay(200), animationDuration: '2.6s' }}
            />
          </div>
        </div>
      </header>

      {sent ? (
        <section className="mx-auto mt-24 max-w-[44rem] py-16 text-center md:mt-36" aria-labelledby="sent-head">
          <h2
            id="sent-head"
            className="animate-blur-in font-serif text-[clamp(44px,6vw,88px)] leading-[0.95] tracking-[-0.03em] text-bone"
          >
            Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
          </h2>
          <p className="animate-blur-in mx-auto mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-bone" style={delay(120)}>
            An email draft opened in your mail app. Send it and the studio will reply within a week. No draft? Write to{' '}
            <a href={`mailto:${ORDER_EMAIL}`} className="text-accent underline underline-offset-4">
              {ORDER_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-10 text-[15px] font-medium text-bone underline decoration-bone/30 underline-offset-[6px] transition-[text-decoration-color] duration-300 ease-sf hover:decoration-bone"
          >
            Start another brief
          </button>
        </section>
      ) : (
        <form
          id="brief"
          onSubmit={onSubmit}
          className="mt-24 grid scroll-mt-24 gap-12 md:mt-36 md:grid-cols-12 md:gap-x-10"
          aria-labelledby="brief-head"
        >
          {/* The brief, written as one sentence with the fields set into it. */}
          <div className="flex flex-col md:col-span-7">
            <h2 id="brief-head" className="reveal text-[17px] font-medium text-bone">
              Your brief
            </h2>

            <div className="reveal relative z-10 mt-6 font-serif text-[clamp(30px,3.4vw,52px)] leading-[1.45] tracking-[-0.015em] text-bone">
              Hello, my name is
              <input
                name="name"
                required
                aria-label="Your name"
                autoComplete="name"
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INLINE}
              />
              and you can reach me at
              <input
                name="email"
                type="email"
                required
                aria-label="Your email"
                autoComplete="email"
                placeholder="you@email.com"
                className={INLINE}
              />
              and I would like
              <input
                name="qty"
                type="number"
                min={1}
                max={50}
                required
                aria-label="Quantity"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className={FIELD + ' w-[1.4em] text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none'}
              />
              ×
              <PiecePicker value={piece} onChange={setPiece} />
              in these colours:
            </div>

            {/* Colour picker: toggle any of the house's seven tones. */}
            <fieldset className="reveal mt-6">
              <legend className="sr-only">Colours</legend>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => {
                  const on = tones.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(t)}
                      className={
                        'inline-flex min-h-11 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[15px] capitalize transition-[background-color,color,transform] duration-300 ease-sf active:scale-95 ' +
                        (on ? 'bg-bone text-ink' : 'bg-surface text-bone hover:bg-bone/10')
                      }
                    >
                      <span
                        aria-hidden="true"
                        className="size-8 rounded-full ring-1 ring-black/10"
                        style={{ background: toneSwatch[t] }}
                      />
                      {t}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <label className="reveal mt-12 flex flex-1 flex-col">
              <span className="font-serif text-[clamp(30px,3.4vw,52px)] leading-[1.2] tracking-[-0.015em] text-bone">
                Here is the idea:
              </span>
              <textarea
                name="brief"
                required
                rows={5}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="The motif, monogram or picture you have in mind, where it goes, and any size or date it is for."
                className="mt-4 min-h-40 w-full flex-1 resize-none rounded-[20px] bg-surface px-5 py-4 text-[17px] leading-[1.6] text-bone transition-shadow duration-300 ease-sf placeholder:text-muted focus:shadow-[0_0_0_2px_var(--color-accent)] focus:outline-none"
              />
            </label>
          </div>

          {/* Live summary: follows the form as it is filled, and sends it. Both columns
              stretch to one height, so the idea box and the card end on the same line. */}
          <aside className="md:col-span-5" aria-label="Summary of your brief">
            <div className="flex h-full flex-col rounded-[28px] bg-bone p-3 text-ink">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-ink/10">
                {PIECES.map((p) => (
                  <img
                    key={p.name}
                    src={p.img}
                    alt=""
                    loading={p.name === piece ? 'eager' : 'lazy'}
                    decoding="async"
                    className={
                      'absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-sf ' +
                      (p.name === piece ? 'scale-100 opacity-100' : 'scale-105 opacity-0')
                    }
                    style={{ objectPosition: p.pos }}
                  />
                ))}
              </div>

              <dl className="grid flex-1 content-start gap-4 px-4 pt-6 pb-6 text-[15px] md:px-5">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-ink/60">For</dt>
                  <dd className="truncate font-medium">{name || '—'}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-ink/60">Piece</dt>
                  <dd key={qty + piece} className="animate-blur-in font-medium">
                    {qty} × {piece}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <dt className="text-ink/60">Colours</dt>
                  <dd className="flex flex-wrap justify-end gap-1.5">
                    {tones.length ? (
                      tones.map((t) => (
                        <span
                          key={t}
                          title={t}
                          className="animate-blur-in size-6 rounded-full ring-1 ring-white/20"
                          style={{ background: toneSwatch[t] }}
                        />
                      ))
                    ) : (
                      <span className="font-medium">Open to suggestion</span>
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-ink/60">Reply</dt>
                  <dd className="font-medium">Within a week</dd>
                </div>
                <div>
                  <dt className="text-ink/60">The idea</dt>
                  <dd className="mt-1.5 line-clamp-3 min-h-[4.5em] leading-[1.5] text-ink/90">
                    {brief || 'Your idea will appear here as you write it.'}
                  </dd>
                </div>
              </dl>

              <RollButton light className="w-full justify-between">Send the brief</RollButton>
            </div>
          </aside>
        </form>
      )}
    </div>
  )
}
