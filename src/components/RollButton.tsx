/**
 * Dark pill: the label rolls up to a second copy on hover, the arrow slides out
 * and back in. With `href` it is a link; without, a submit button.
 */
export default function RollButton({
  href,
  children,
  light = false,
  className = '',
}: {
  href?: string
  children: string
  /** Light pill, for use on a dark surface. */
  light?: boolean
  className?: string
}) {
  const roll =
    'block transition-transform duration-500 ease-sf group-hover:-translate-y-full group-focus-visible:-translate-y-full'
  const cls =
    'group inline-flex min-h-12 items-center gap-4 rounded-full py-1.5 pr-1.5 pl-6 text-[15px] font-medium transition-transform duration-300 ease-sf active:scale-[0.97] ' +
    (light ? 'bg-ink text-bone ' : 'bg-bone text-ink ') +
    className
  const inner = (
    <>
      <span className="relative block h-[1.3em] overflow-hidden leading-[1.3]">
        <span className={roll}>{children}</span>
        <span aria-hidden="true" className={'absolute inset-x-0 top-full ' + roll}>
          {children}
        </span>
      </span>
      <span aria-hidden="true" className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-accent text-white">
        <span className="transition-transform duration-500 ease-sf group-hover:translate-x-8">→</span>
        <span className="absolute -translate-x-8 transition-transform duration-500 ease-sf group-hover:translate-x-0">→</span>
      </span>
    </>
  )
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button type="submit" className={cls}>
      {inner}
    </button>
  )
}
