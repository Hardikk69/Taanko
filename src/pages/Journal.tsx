import Stitch from '../components/Stitch'
import { posts, postBySlug } from '../data'

/** Single entry when the path is /journal/<slug>, otherwise the index. */
export default function Journal() {
  const slug = window.location.pathname.replace(/^\/journal\/?/, '')
  const post = slug ? postBySlug(slug) : undefined

  if (slug && !post) {
    return (
      <section className="px-4 py-24 text-center md:px-9" aria-label="Journal">
        <p className="mono text-muted">ENTRY NOT FOUND.</p>
        <a
          href="/journal"
          className="mono mt-4 inline-flex min-h-9 items-center text-coral-ink hover:underline hover:underline-offset-[5px]"
        >
          ← BACK TO THE JOURNAL
        </a>
      </section>
    )
  }

  if (post) {
    return (
      <article className="mx-auto max-w-[62ch] px-4 pt-10 pb-20 md:px-9 md:pt-16 md:pb-28">
        <a
          href="/journal"
          className="mono inline-flex min-h-8 items-center text-bone-60 transition-colors duration-300 ease-sf hover:text-bone"
        >
          ← THE JOURNAL
        </a>

        <div className="mono mt-8 flex items-center justify-between gap-4 border-b border-line pb-3 text-muted">
          <span className="text-coral-ink">NO. {post.no} / {post.kind}</span>
          <span>{post.date}</span>
        </div>

        <h1 className="mt-7 font-serif text-[clamp(34px,7vw,64px)] leading-[0.98] font-normal tracking-[-0.02em] text-bone">
          {post.title}
        </h1>
        <p className="mt-4 font-serif text-[clamp(18px,3vw,26px)] leading-snug text-coral-ink italic">
          {post.lead}
        </p>

        <span className="mt-8 block h-px w-14 bg-coral" aria-hidden="true" />

        <div className="mt-8 grid gap-5 text-[16px] leading-[1.8] text-muted">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <p className="mono mt-12 text-muted">— THE FOUNDER / LONDON</p>
      </article>
    )
  }

  return (
    <section className="px-4 pt-10 pb-20 md:px-9 md:pt-16 md:pb-28" aria-labelledby="journal-head">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-3">
        <span className="mono text-coral-ink">TAANKO / JOURNAL</span>
        <span className="mono text-green-ink">{String(posts.length).padStart(2, '0')} ENTRIES</span>
      </div>

      <header className="mt-10 text-center md:mt-14">
        <p className="font-serif text-[clamp(22px,4vw,44px)] leading-none font-normal text-pink-ink italic">
          written by hand
        </p>
        <h1
          id="journal-head"
          className="-mt-[0.1em] text-[clamp(30px,10vw,44px)] leading-[0.9] font-normal tracking-[-0.035em] text-bone uppercase md:text-[clamp(44px,8.4vw,120px)]"
        >
          FOUNDER&rsquo;S JOURNAL
        </h1>
        <p className="mono mx-auto mt-4 max-w-[46ch] text-muted normal-case">
          The story behind the house, blog notes, and letters — posted when there is something true to say.
        </p>
      </header>

      <Stitch tone="coral" className="-mx-4 md:-mx-9" />

      {posts.length === 0 ? (
        <p className="mono mt-16 text-center text-muted">NOTHING WRITTEN YET.</p>
      ) : (
        <ul className="mx-auto mt-12 max-w-[72ch] border-t border-line md:mt-16">
          {posts.map((p) => (
            <li key={p.slug}>
              <a
                href={`/journal/${p.slug}`}
                className="group grid gap-2 border-b border-line py-7 transition-[padding] duration-500 ease-sf hover:pl-2 md:grid-cols-[auto_1fr] md:gap-8"
              >
                <div className="mono flex items-center gap-4 text-muted md:flex-col md:items-start md:gap-1">
                  <span className="text-coral-ink">NO. {p.no}</span>
                  <span>{p.date}</span>
                  <span className="text-green-ink">{p.kind}</span>
                </div>
                <div>
                  <h2 className="font-serif text-[clamp(24px,4vw,34px)] leading-tight font-normal tracking-[-0.01em] text-bone group-hover:underline group-hover:underline-offset-[6px]">
                    {p.title}
                  </h2>
                  <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.7] text-muted">{p.lead}</p>
                  <span className="mono mt-3 inline-flex items-center gap-1.5 text-bone-60 transition-colors duration-300 group-hover:text-bone">
                    READ <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
