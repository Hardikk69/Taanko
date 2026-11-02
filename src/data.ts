export type Tone = 'charcoal' | 'bone' | 'stone' | 'olive' | 'black' | 'oatmeal' | 'ash'

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

export const toneSwatch: Record<Tone, string> = {
  charcoal: '#383634',
  bone: '#E5E1D8',
  stone: '#B5AEA3',
  olive: '#5A634E',
  black: '#1D1C1A',
  oatmeal: '#DDD7C7',
  ash: '#969288',
}

const CLOTHING = 'XS,S,M,L,XL'
const TROUSER = '44,46,48,50,52'
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

export const products: Product[] = [
  p('raw-wool-coat', 'Raw Wool Coat', 'TK-AW26-OW-04', 'outerwear', 420, 'Charcoal', 'charcoal', 'WOOL COAT 04', CLOTHING, 'XS',
    'A long straight coat in brushed raw wool. Dropped shoulder, concealed placket, no lining at the back to let it move.',
    'rd7ybe0UgMSoS4c5qcBe2OEIBsY.webp'),
  p('long-coat-01', 'Long Coat 01', 'TK-AW26-OW-01', 'outerwear', 480, 'Ash', 'ash', 'LONG COAT 01', CLOTHING, '',
    'Single breasted, ankle length, cut in a bone grey wool twill. Quiet from the front, severe in motion.',
    'sqpF5doNREx0lIFgsHEBZ8KS6g.webp'),
  p('work-jacket-02', 'Work Jacket 02', 'TK-AW26-OW-02', 'outerwear', 310, 'Olive Grey', 'olive', 'WORK JACKET 02', CLOTHING, 'XL',
    'A boxy short jacket in washed canvas with four patch pockets. Built for use, kept strict.',
    'hMJqoN9zq5KtuJS87g68qfuvWY.webp'),
  p('soft-knit-02', 'Soft Knit 02', 'TK-AW26-KN-02', 'knit', 190, 'Oatmeal', 'oatmeal', 'SOFT KNIT 02', CLOTHING, '',
    'A heavy rib mock neck in brushed alpaca blend. Oversized through the body, narrow at the cuff.',
    'ufrlu9H9Q5CdndAcmitVcLjMXiU.webp'),
  p('rib-knit-vest', 'Rib Knit Vest', 'TK-AW26-KN-05', 'knit', 140, 'Stone', 'stone', 'KNIT VEST 05', CLOTHING, '',
    'A sleeveless chunky rib in stone wool. Layer it over a shirt or wear it alone.',
    'LSdninF0aui4WTj2K5BbDuqwB6s.webp'),
  p('structured-shirt', 'Structured Shirt', 'TK-AW26-SH-03', 'shirts', 165, 'Bone', 'bone', 'SHIRT 03', CLOTHING, 'XS,S',
    'A stiff poplin shirt with an oversized collar and a high, straight hem.',
    'oEDPtt9Kxi8fPaeYC2wNEDf8w.webp'),
  p('layered-tee', 'Layered Tee', 'TK-AW26-SH-06', 'shirts', 85, 'Washed Grey', 'ash', 'LAYERED TEE 06', CLOTHING, '',
    'Washed jersey with a second, longer black layer sewn into the hem.',
    '3eB2nkAdp2WJs1DwpVF6ievuPs.webp'),
  p('fold-trouser', 'Fold Trouser', 'TK-AW26-TR-01', 'trousers', 210, 'Off-black', 'black', 'FOLD TROUSER 01', TROUSER, '44',
    'A wide trouser with a double fold at the front and a deep break. Falls straight from the hip.',
    '6YDakt7k90BRrRTGKGxlXWmaUrE.webp'),
  p('wide-trouser-03', 'Wide Trouser 03', 'TK-AW26-TR-03', 'trousers', 230, 'Charcoal', 'charcoal', 'WIDE TROUSER 03', TROUSER, '',
    'Charcoal flannel, cut wide with one deep pleat. Sits high, finishes on the shoe.',
    'ls9gxYgRiy1Hiq98dM90w8aEh1A.webp'),
  p('utility-bag', 'Utility Bag', 'TK-AW26-OB-01', 'objects', 175, 'Black', 'black', 'UTILITY BAG', ONE, '',
    'A technical nylon carry piece with a webbing strap, one steel buckle and nothing else.',
    'OKd8mJSKFTxBiTC1jrqu8FbzcI.webp'),
  p('leather-object-03', 'Leather Object 03', 'TK-AW26-OB-03', 'objects', 260, 'Black', 'black', 'LEATHER OBJECT 03', ONE, '',
    'A folded leather pouch that works as a bag, a case, or an object on a table.',
    'tgfGQWKNsqq9YlmBt49dS7UNA.webp'),
  p('heavy-scarf-01', 'Heavy Scarf 01', 'TK-AW26-OB-05', 'objects', 120, 'Charcoal', 'charcoal', 'SCARF 01', ONE, '',
    'Two metres of dense brushed wool. Wrap it once and let it hang.',
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
  look(1, 'Raw wool,', 'held at the shoulder',
    'The opening look. A coat that keeps its weight, over a soft rib and a wide fold.',
    'raw-wool-coat', '1fdmffvXEbZby1Mv5OamwJ4XtRg.webp',
    'raw-wool-coat:27:52\nsoft-knit-02:50:31\nfold-trouser:52:76'),
  look(2, 'Long line,', 'no ceremony',
    'Bone grey to the ankle. A plain layered tee underneath and a bag with one buckle.',
    'long-coat-01', 'TyYDFFCaO3yv8nezVk3y41E4LY.webp',
    'long-coat-01:30:46\nlayered-tee:50:30\nutility-bag:43:68\nwide-trouser-03:55:82'),
  look(3, 'One shirt,', 'built like a wall',
    'Stiff poplin, oversized collar, nothing tucked. The trousers do the rest.',
    'structured-shirt', '6XqttJer8B2ltisVVXJR9idkf0.webp',
    'structured-shirt:45:26\nfold-trouser:47:66'),
  look(4, 'Work jacket,', 'side on',
    'Washed canvas cut short and boxy, a bag across the body, a narrow leg below.',
    'work-jacket-02', 'DSvpP5V90ORu75jurPjvvU2cOPY.webp',
    'work-jacket-02:42:24\nutility-bag:30:39\nwide-trouser-03:50:66'),
  look(5, 'Rib over black,', 'stone on charcoal',
    'A sleeveless knit pulled over black layers. Everything stays flat and hard.',
    'rib-knit-vest', 'ZptDcON6Y8ZOTm6gwDcVQG0XDS4.webp',
    'rib-knit-vest:46:24\nwide-trouser-03:45:66'),
  look(6, 'Two tees,', 'one long scarf',
    'Grey over black jersey. A scarf that is nearly as long as the trouser.',
    'layered-tee', 'XPA7VyYC6IYxNuIzqK0TjYKfzwQ.webp',
    'layered-tee:30:26\nheavy-scarf-01:57:40\nfold-trouser:46:70'),
  look(7, 'Closed coat,', 'one small object',
    'The long coat buttoned to the neck, and a folded leather object held low.',
    'long-coat-01', '5bbO54H051cgniE6n9BVlmXbfTc.webp',
    'long-coat-01:40:34\nleather-object-03:31:50'),
  look(8, 'All black,', 'hard light',
    'Knit, pleat and scarf in one tone. The closing look of the collection.',
    'heavy-scarf-01', 'A5W6arKPcC32pUUvT8NVRtFvE4.webp',
    'heavy-scarf-01:36:36\nsoft-knit-02:53:40\nfold-trouser:50:80'),
]

export const money = (n: number) => '£' + n
