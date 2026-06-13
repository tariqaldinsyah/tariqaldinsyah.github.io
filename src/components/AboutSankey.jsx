import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const H     = 400
const LX    = 110   // left block width
const RX    = 530   // right blocks start x
const RW    = 115   // right block width
const GAP   = 20    // gap between right blocks
const MX    = (LX + RX) / 2
const SVG_W = 860
const LBL_X = RX + RW + 16

const FLOWS = [
  {
    pct: 0.60, color: '#C0F53D', pctLabel: '60%', label: 'Research',
    sub: ['Field Survey & Observation', 'Competitive Analysis', 'Brand Identity & Logo', 'Moodboard & Concept Ideation'],
  },
  {
    pct: 0.10, color: '#8fc93d', pctLabel: '10%', label: 'UX Research',
    sub: ['User Interviews', 'User Flows & Wireframe'],
  },
  {
    pct: 0.30, color: '#5a7a1e', pctLabel: '30%', label: 'UI Design',
    sub: ['Visual Design', 'Design System', 'Hi-Fi Prototype', 'Developer Handoff'],
  },
]

// Pre-compute block positions at module level (runs once)
const totalGap = (FLOWS.length - 1) * GAP
let lY = 0, rY = 0
const computed = FLOWS.map(f => {
  const lH = H * f.pct
  const rH = (H - totalGap) * f.pct
  const c = { ...f, lY0: lY, lH, rY0: rY, rH }
  lY += lH
  rY += rH + GAP
  return c
})

function flowPath({ lY0, lH, rY0, rH }) {
  return [
    `M ${LX} ${lY0}`,
    `C ${MX} ${lY0} ${MX} ${rY0} ${RX} ${rY0}`,
    `L ${RX} ${rY0 + rH}`,
    `C ${MX} ${rY0 + rH} ${MX} ${lY0 + lH} ${LX} ${lY0 + lH}`,
    'Z',
  ].join(' ')
}

export default function AboutSankey() {
  const svgRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: 'top 82%' }
      const paths  = el.querySelectorAll('.s-path')
      const blocks = el.querySelectorAll('.s-block')
      const lbls   = el.querySelectorAll('.s-lbl')

      gsap.fromTo(paths,  { opacity: 0 },
        { opacity: 0.88, duration: 0.8, stagger: 0.18, ease: 'power2.out', scrollTrigger: st })
      gsap.fromTo(blocks, { opacity: 0, x: 14 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.18, ease: 'power3.out', delay: 0.35, scrollTrigger: st })
      gsap.fromTo(lbls,   { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.55, scrollTrigger: st })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div className="rounded-2xl p-6 pb-8" style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>
      <div className="flex items-center justify-between mb-5">
        <p className="label-tag">Design Process Breakdown</p>
        <p className="text-white/20 text-xs">Based on total working hours</p>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${H + 8}`}
        className="w-full"
        style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <defs>
          <linearGradient id="lgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#C0F53D" />
            <stop offset="100%" stopColor="#3d5a0e" />
          </linearGradient>
        </defs>

        {/* Left source block */}
        <rect x={0} y={0} width={LX} height={H} fill="url(#lgGrad)" rx={7} />

        {/* Separators between flows on left block */}
        {computed.slice(0, -1).map(f => (
          <line key={f.label + '-sep'}
            x1={0} y1={f.lY0 + f.lH}
            x2={LX} y2={f.lY0 + f.lH}
            stroke="#080c02" strokeWidth={1.5} opacity={0.5} />
        ))}

        {/* Left block label */}
        <text x={LX / 2} y={H / 2 - 9}  textAnchor="middle" fill="#080c02" fontSize={11} fontWeight={700} letterSpacing="0.08em">DESIGN</text>
        <text x={LX / 2} y={H / 2 + 9}  textAnchor="middle" fill="#080c02" fontSize={11} fontWeight={700} letterSpacing="0.08em">PROCESS</text>

        {/* Flow paths */}
        {computed.map(f => (
          <path key={f.label} className="s-path" d={flowPath(f)} fill={f.color} opacity={0} />
        ))}

        {/* Right blocks + labels */}
        {computed.map(f => {
          const midY = f.rY0 + f.rH / 2
          return (
            <g key={f.label + '-r'}>
              {/* Right block */}
              <rect className="s-block"
                x={RX} y={f.rY0} width={RW} height={f.rH}
                fill={f.color} rx={5} />

              {/* Percentage */}
              <text className="s-lbl"
                x={LBL_X} y={midY - 17}
                fill="#C0F53D" fontSize={18} fontWeight={800}
                dominantBaseline="middle">
                {f.pctLabel}
              </text>

              {/* Category label */}
              <text className="s-lbl"
                x={LBL_X} y={midY + 1}
                fill="white" fontSize={11} fontWeight={700}
                dominantBaseline="middle">
                {f.label}
              </text>

              {/* Sub items */}
              {f.sub.map((s, i) => (
                <text key={s} className="s-lbl"
                  x={LBL_X} y={midY + 16 + i * 13}
                  fill="rgba(255,255,255,0.33)" fontSize={9.5}
                  dominantBaseline="middle">
                  · {s}
                </text>
              ))}
            </g>
          )
        })}

        {/* Bottom caption */}
        <text
          x={SVG_W / 2} y={H + 24}
          textAnchor="middle"
          fill="rgba(255,255,255,0.15)" fontSize={8.5} letterSpacing="0.14em">
          TARIQ ALDINSYAH — DESIGN WORKFLOW
        </text>
      </svg>
    </div>
  )
}
