export type Tone = 'indigo' | 'bone' | 'madder' | 'olive' | 'ink' | 'oatmeal' | 'saffron'

export type Product = {
  slug: string
  name: string
  sku: string
  category: string
  price: number
  color: string
  tone: Tone
  tag: string
  sizes: string[]
  soldOut: string[]
  short: string
  image: string
}

// Thread tones — the dyed-floss colours the pieces are embroidered in.
export const toneSwatch: Record<Tone, string> = {
  indigo: '#33425C',
  bone: '#E5E1D8',
  madder: '#9E3B36',
  olive: '#5A634E',
  ink: '#1D1C1A',
  oatmeal: '#DDD7C7',
  saffron: '#C98A2B',
}

const CLOTHING = 'XS,S,M,L,XL'
const ONE = 'ONE SIZE'

const p = (
  slug: string,
  name: string,
  sku: string,
  category: string,
  price: number,
  color: string,
  tone: Tone,
  tag: string,
  sizes: string,
  soldOut: string,
  short: string,
  image: string,
): Product => ({
  slug,
  name,
  sku,
  category,
  price,
  color,
  tone,
  tag,
  sizes: sizes.split(','),
  soldOut: soldOut ? soldOut.split(',') : [],
  short,
  image: '/images/' + image,
})

// Slugs are kept stable so the lookbook hotspots and /product pages resolve.
// Every piece is hand-embroidered; the tone is the lead thread colour.
export const products: Product[] = [
  p('raw-wool-coat', 'Chain-Stitch Overshirt', 'TK-CL-04', 'clothing', 240, 'Indigo', 'indigo', 'OVERSHIRT 04', CLOTHING, 'XS',
    'A boxy overshirt in washed cotton, run with a chain-stitch field across the back yoke. Each one takes a full day on the frame.',
    'rd7ybe0UgMSoS4c5qcBe2OEIBsY.webp'),
  p('long-coat-01', 'Satin-Stitch Jacket', 'TK-CL-01', 'clothing', 320, 'Bone', 'bone', 'JACKET 01', CLOTHING, '',
    'A long unlined jacket in bone cotton twill, the lapel and cuffs filled in dense satin stitch. Quiet until it moves.',
    'sqpF5doNREx0lIFgsHEBZ8KS6g.webp'),
  p('work-jacket-02', 'Sashiko Work Jacket', 'TK-CL-02', 'clothing', 285, 'Olive', 'olive', 'WORK JACKET 02', CLOTHING, 'XL',
    'A short boxy jacket in olive canvas, reinforced with running sashiko across both panels. Built to be mended, not replaced.',
    'hMJqoN9zq5KtuJS87g68qfuvWY.webp'),
  p('soft-knit-02', 'Grand Tote', 'TK-TB-02', 'totes', 110, 'Oatmeal', 'oatmeal', 'GRAND TOTE 02', ONE, '',
    'A heavy oatmeal canvas tote with a full hand-embroidered panel and webbing handles. Holds the week without complaint.',
    'ufrlu9H9Q5CdndAcmitVcLjMXiU.webp'),
  p('rib-knit-vest', 'Market Tote', 'TK-TB-05', 'totes', 78, 'Madder', 'madder', 'MARKET TOTE 05', ONE, '',
    'A flat everyday tote in bone cotton, the madder motif stitched low on the front. Folds down to nothing.',
    'LSdninF0aui4WTj2K5BbDuqwB6s.webp'),
  p('structured-shirt', 'Embroidered Shirt', 'TK-CL-03', 'clothing', 165, 'Bone', 'bone', 'SHIRT 03', CLOTHING, 'XS,S',
    'A stiff poplin shirt with an oversized collar and a small stitched crest at the chest. A high, straight hem.',
    'oEDPtt9Kxi8fPaeYC2wNEDf8w.webp'),
  p('layered-tee', 'Stitched Cap', 'TK-AC-06', 'accessories', 48, 'Ink', 'ink', 'CAP 06', ONE, '',
    'A washed six-panel cap with the house mark hand-stitched above the brim. One adjustable strap at the back.',
    '3eB2nkAdp2WJs1DwpVF6ievuPs.webp'),
  p('fold-trouser', 'Coin Purse', 'TK-PU-01', 'purses', 42, 'Ink', 'ink', 'COIN PURSE 01', ONE, '',
    'A small zip purse in off-black cotton with a single embroidered line. Cards, coins, a key — nothing more.',
    '6YDakt7k90BRrRTGKGxlXWmaUrE.webp'),
  p('wide-trouser-03', 'Folded Clutch', 'TK-PU-03', 'purses', 96, 'Indigo', 'indigo', 'CLUTCH 03', ONE, '',
    'A soft fold-over clutch in indigo canvas, the front worked edge to edge in tight cross-stitch.',
    'ls9gxYgRiy1Hiq98dM90w8aEh1A.webp'),
  p('utility-bag', 'Crossbody Pouch', 'TK-PU-01B', 'purses', 88, 'Ink', 'ink', 'CROSSBODY POUCH', ONE, '',
    'A small canvas pouch on a webbing strap, one steel buckle, the flap stitched with a running border.',
    'OKd8mJSKFTxBiTC1jrqu8FbzcI.webp'),
  p('leather-object-03', 'Embroidered Patch Set', 'TK-AC-03', 'accessories', 28, 'Saffron', 'saffron', 'PATCH SET 03', ONE, '',
    'Three iron-on patches worked in saffron and madder floss. Mend a hole or mark a jacket as yours.',
    'tgfGQWKNsqq9YlmBt49dS7UNA.webp'),
  p('heavy-scarf-01', 'Embroidered Scarf', 'TK-AC-05', 'accessories', 72, 'Madder', 'madder', 'SCARF 05', ONE, '',
    'Two metres of soft brushed cotton with a hand-run border down each long edge. Wrap it once and let it hang.',
    'zTL04fG9Tj01W6ibwj5h2NLagk.webp'),
]

export const bySlug = (slug: string) => products.find((x) => x.slug === slug)

export type Hotspot = { product: string; x: number; y: number }

export type Look = {
  id: number
  title: [string, string]
  note: string
  lead: string
  image: string
  hotspots: Hotspot[]
}

const hs = (spec: string): Hotspot[] =>
  spec
    .trim()
    .split('\n')
    .map((line) => {
      const [product, x, y] = line.trim().split(':')
      return { product, x: Number(x), y: Number(y) }
    })

const look = (
  id: number,
  l1: string,
  l2: string,
  note: string,
  lead: string,
  image: string,
  spots: string,
): Look => ({ id, title: [l1, l2], note, lead, image: '/images/' + image, hotspots: hs(spots) })

export const looks: Look[] = [
  look(1, 'Chain stitch,', 'held at the shoulder',
    'The opening look. A hand-worked overshirt carried with the grand tote and a coin purse.',
    'raw-wool-coat', '1fdmffvXEbZby1Mv5OamwJ4XtRg.webp',
    'raw-wool-coat:27:52\nsoft-knit-02:50:31\nfold-trouser:52:76'),
  look(2, 'Long line,', 'no ceremony',
    'The satin-stitch jacket worn open, a stitched cap above and a crossbody pouch slung low.',
    'long-coat-01', 'TyYDFFCaO3yv8nezVk3y41E4LY.webp',
    'long-coat-01:30:46\nlayered-tee:50:30\nutility-bag:43:68\nwide-trouser-03:55:82'),
  look(3, 'One shirt,', 'built like a wall',
    'Stiff poplin, oversized collar, a small crest at the chest. The clutch does the rest.',
    'structured-shirt', '6XqttJer8B2ltisVVXJR9idkf0.webp',
    'structured-shirt:45:26\nfold-trouser:47:66'),
  look(4, 'Work jacket,', 'side on',
    'Sashiko canvas cut short and boxy, a crossbody pouch across the body, a clutch in hand.',
    'work-jacket-02', 'DSvpP5V90ORu75jurPjvvU2cOPY.webp',
    'work-jacket-02:42:24\nutility-bag:30:39\nwide-trouser-03:50:66'),
  look(5, 'Madder on bone,', 'the market tote',
    'The market tote carried against the clutch. Two reds, one stitched flat and hard.',
    'rib-knit-vest', 'ZptDcON6Y8ZOTm6gwDcVQG0XDS4.webp',
    'rib-knit-vest:46:24\nwide-trouser-03:45:66'),
  look(6, 'Cap and scarf,', 'one long border',
    'The stitched cap with the embroidered scarf. A border nearly as long as the strap.',
    'layered-tee', 'XPA7VyYC6IYxNuIzqK0TjYKfzwQ.webp',
    'layered-tee:30:26\nheavy-scarf-01:57:40\nfold-trouser:46:70'),
  look(7, 'Closed jacket,', 'one small purse',
    'The satin-stitch jacket buttoned to the neck, a patch set held low.',
    'long-coat-01', '5bbO54H051cgniE6n9BVlmXbfTc.webp',
    'long-coat-01:40:34\nleather-object-03:31:50'),
  look(8, 'All thread,', 'hard light',
    'Tote, purse and scarf in one dye lot. The closing look of the collection.',
    'heavy-scarf-01', 'A5W6arKPcC32pUUvT8NVRtFvE4.webp',
    'heavy-scarf-01:36:36\nsoft-knit-02:53:40\nfold-trouser:50:80'),
]

export const money = (n: number) => '£' + n

export type Post = {
  slug: string
  no: string
  date: string
  kind: string
  title: string
  lead: string
  /** Each string is one paragraph. */
  body: string[]
}

// Founder's Journal — the story, notes and letters behind the house.
// Add a new entry at the TOP of this array; it carries its own number.
export const posts: Post[] = [
  {
    slug: 'why-taanko',
    no: '01',
    date: '2026 / 11',
    kind: 'STORY',
    title: 'Why Taanko',
    lead: 'The name means to stitch with thread. This is where that started.',
    body: [
      'I keep coming back to the needle. Taanko — to stitch with thread — is the only word that holds everything I wanted this house to be: slow, made by hand, and honest about the time it takes.',
      'This journal is mine to keep. The story of the first pieces, the mistakes on the frame, the people who taught me, and the letters I want to write to whoever is reading. No schedule. I post when there is something true to say.',
      'Thank you for being here early.',
    ],
  },
]

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)
