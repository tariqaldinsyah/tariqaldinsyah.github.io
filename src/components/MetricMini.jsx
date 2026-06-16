import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Radial ring for percentage values (e.g. "40%")
function RadialRing({ pct }) {
  const arcRef = useRef(null)
  const R      = 20
  const circ   = +(2 * Math.PI * R).toFixed(3)
  const target = +(circ * (1 - pct / 100)).toFixed(3)

  useEffect(() => {
    const el = arcRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Start empty regardless
    gsap.set(el, { strokeDashoffset: circ })

    if (reduced) {
      gsap.set(el, { strokeDashoffset: target })
      return
    }

    const st = ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () =>
        gsap.to(el, { strokeDashoffset: target, duration: 1.3, ease: 'power2.out' }),
    })
    return () => st.kill()
  }, [pct, circ, target])

  return (
    // rotate(-90°) so arc starts from top
    <svg width={48} height={48} viewBox="0 0 48 48" className="mx-auto mb-2"
      style={{ transform: 'rotate(-90deg)', display: 'block' }}
      aria-hidden="true">
      {/* Track */}
      <circle cx={24} cy={24} r={R} fill="none" strokeWidth={3}
        style={{ stroke: 'var(--text-10)' }} />
      {/* Filled arc */}
      <circle ref={arcRef} cx={24} cy={24} r={R} fill="none" strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        style={{ stroke: 'var(--viz-1)' }}
      />
    </svg>
  )
}

// Auto-detect chart type from metric value string
export default function MetricMini({ val }) {
  const s = String(val).trim()

  // Percentage value → radial ring
  if (/^\d+(\.\d+)?%$/.test(s))
    return <RadialRing pct={parseFloat(s)} />

  return null
}
