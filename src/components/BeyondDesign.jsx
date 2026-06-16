import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scale, Users, Network, BarChart2, RefreshCw } from 'lucide-react'
import { splitWords, splitChars } from '../utils/splitText'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { Icon: Scale,     title: 'User & Business Balance',        desc: 'Balancing user needs with operational and business objectives to deliver meaningful, sustainable solutions.' },
  { Icon: Users,     title: 'Cross Functional Collaboration', desc: 'Working closely with product, engineering, and stakeholders to ship impactful solutions together.' },
  { Icon: Network,   title: 'System & Ecosystem Thinking',    desc: 'Designing interconnected products and platforms that scale cohesively across a larger digital ecosystem.' },
  { Icon: BarChart2, title: 'Data-Informed Design',           desc: 'Using research, usability feedback, and metrics to continuously refine and improve product experiences.' },
  { Icon: RefreshCw, title: 'Continuous Iteration',           desc: 'Constantly testing assumptions, gathering feedback, and refining solutions to ensure long-term product relevance and impact.' },
]

export default function BeyondDesign() {
  const { theme } = useTheme()
  const lr = (a) => theme === 'light' ? `rgba(92,138,0,${a})` : `rgba(192,245,61,${a})`
  const borderDefaultRef = useRef('')
  useEffect(() => {
    borderDefaultRef.current = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
  }, [theme])

  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const cardsRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const st    = { trigger: sectionRef.current, start: 'top 78%' }
      const h2 = headRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.09, ease: 'power3.out', scrollTrigger: st })
        gsap.from(chars, { y: '105%', stagger: 0.055, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: st })
      }

      gsap.fromTo(cardsRef.current?.children, { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: cardsRef.current, start: 'top 82%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  return (
    <section ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="mb-16">
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">Beyond </span>
            <span className="font-serif italic font-semibold text-lime">Interface Design</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {cards.map((c, i) => (
            <div key={c.title}
              className={`rounded-2xl p-6 group cursor-default
                ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
                ${i === 4 ? 'sm:col-span-2 lg:col-span-3' : ''}`}
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              {...(canHover ? {
                onMouseEnter: (e) => {
                  e.currentTarget.style.willChange = 'transform'
                  gsap.to(e.currentTarget, {
                    y: -4,
                    borderColor: lr(0.3),
                    boxShadow: `0 0 30px ${lr(0.10)}`,
                    duration: 0.25, ease: 'power2.out', overwrite: 'auto',
                  })
                },
                onMouseLeave: (e) => {
                  const el = e.currentTarget
                  gsap.to(el, {
                    y: 0,
                    borderColor: borderDefaultRef.current,
                    boxShadow: 'none',
                    duration: 0.4, ease: 'power2.out', overwrite: 'auto',
                    onComplete: () => { el.style.willChange = 'auto' },
                  })
                },
              } : {})}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{ background: lr(0.08), border: `1px solid ${lr(0.15)}` }}>
                <c.Icon size={15} aria-hidden="true" style={{ color: 'var(--lime-text)' }} />
              </div>
              <h3 className="text-white font-bold text-base mb-3 group-hover:text-lime transition-colors leading-snug">
                {c.title}
              </h3>
              <p className="text-white/35 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
