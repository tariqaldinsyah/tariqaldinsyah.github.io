import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Parses '5+', '20+', '+20%', '40%', '3x' → { prefix, num, suffix }
// Returns null for non-animatable strings like '↑', '↓', '7→3'
function parse(val) {
  const m = String(val).match(/^([^0-9]*)(\d+\.?\d*)([^0-9]*)$/)
  if (!m || m[2] === '') return null
  if (/\d/.test(m[3])) return null // suffix contains digit (e.g. '7→3')
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3] }
}

export default function CountUp({ value, className, style }) {
  const ref    = useRef(null)
  const parsed = parse(value)

  useEffect(() => {
    if (!parsed || !ref.current) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el  = ref.current
    const obj = { val: 0 }

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: parsed.num,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = parsed.prefix + Math.round(obj.val) + parsed.suffix
          },
        })
      },
    })
    return () => st.kill()
  }, [value])

  if (!parsed) return <span className={className} style={style}>{value}</span>

  return (
    <span ref={ref} className={className} style={style}>
      {parsed.prefix}{Math.round(parsed.num)}{parsed.suffix}
    </span>
  )
}
