import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

const W = 600, H = 340
const HUB_R  = 28
const NODE_R = 20
const RING_R = 110
const LABEL_R = RING_R + NODE_R + 16

// Per-theme, per-category color objects (matching AboutSankey pattern)
const PALETTE = {
  dark: {
    hub:      { fill: 'rgba(192,245,61,0.10)', stroke: 'rgba(192,245,61,0.52)', text: '#C0F53D', line: 'rgba(192,245,61,0.22)' },
    platform: { fill: 'rgba(192,245,61,0.08)', stroke: 'rgba(192,245,61,0.38)', text: '#C0F53D', line: 'rgba(192,245,61,0.18)' },
    product:  { fill: 'rgba(78,205,196,0.08)', stroke: 'rgba(78,205,196,0.42)', text: '#4ECDC4', line: 'rgba(78,205,196,0.18)' },
    commerce: { fill: 'rgba(78,205,196,0.08)', stroke: 'rgba(78,205,196,0.42)', text: '#4ECDC4', line: 'rgba(78,205,196,0.18)' },
    payment:  { fill: 'rgba(149,165,184,0.08)', stroke: 'rgba(149,165,184,0.42)', text: '#95A5B8', line: 'rgba(149,165,184,0.18)' },
  },
  light: {
    hub:      { fill: 'rgba(92,138,0,0.10)',   stroke: 'rgba(92,138,0,0.55)',   text: '#5C8A00', line: 'rgba(92,138,0,0.22)' },
    platform: { fill: 'rgba(92,138,0,0.07)',   stroke: 'rgba(92,138,0,0.40)',   text: '#5C8A00', line: 'rgba(92,138,0,0.18)' },
    product:  { fill: 'rgba(14,116,144,0.07)',  stroke: 'rgba(14,116,144,0.44)', text: '#0E7490', line: 'rgba(14,116,144,0.18)' },
    commerce: { fill: 'rgba(14,116,144,0.07)',  stroke: 'rgba(14,116,144,0.44)', text: '#0E7490', line: 'rgba(14,116,144,0.18)' },
    payment:  { fill: 'rgba(71,85,105,0.07)',   stroke: 'rgba(71,85,105,0.44)',  text: '#475569', line: 'rgba(71,85,105,0.18)' },
  },
}

const CAT_LABELS = {
  platform: 'Core Platforms',
  product:  'Products Built',
  commerce: 'Commerce Suite',
  payment:  'Payment Layer',
}

function radialPos(i, n, r, cx = W / 2, cy = H / 2) {
  const angle = (2 * Math.PI * i / n) - Math.PI / 2
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle }
}

export default function EcosystemGraph({ data }) {
  const svgRef   = useRef(null)
  const { theme } = useTheme()
  const isLight  = theme === 'light'
  const P        = isLight ? PALETTE.light : PALETTE.dark

  const cx = W / 2, cy = H / 2
  const N  = data.nodes.length

  const positions = useMemo(
    () => data.nodes.map((_, i) => radialPos(i, N, RING_R, cx, cy)),
    [N, cx, cy],
  )

  const labelPositions = useMemo(
    () => data.nodes.map((_, i) => radialPos(i, N, LABEL_R, cx, cy)),
    [N, cx, cy],
  )

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const st = { trigger: el, start: 'top 84%', once: true }

      // Hub fades first
      gsap.fromTo(el.querySelectorAll('.eg-hub'),
        { opacity: 0 },
        { opacity: 1, duration: 0.55, ease: 'power2.out', scrollTrigger: st })

      // Lines stagger (matching sk-lk pattern)
      gsap.fromTo(el.querySelectorAll('.eg-lk'),
        { opacity: 0 },
        { opacity: 1, duration: 0.65, stagger: 0.07, ease: 'power2.out', delay: 0.18, scrollTrigger: st })

      // Node circles (matching sk-nd stagger)
      gsap.fromTo(el.querySelectorAll('.eg-nd'),
        { opacity: 0 },
        { opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', delay: 0.32, scrollTrigger: st })

      // Labels (matching sk-lb x-slide)
      gsap.fromTo(el.querySelectorAll('.eg-lb'),
        { opacity: 0, x: 4 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.5, scrollTrigger: st })
    }, el)
    return () => ctx.revert()
  }, [])

  // Unique categories for legend
  const catKeys = [...new Set(data.nodes.map(n => n.cat))]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <p className="label-tag">Ecosystem Map</p>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-20)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          hub · node diagram
        </p>
      </div>

      {/* Desktop: SVG radial graph */}
      <div className="hidden sm:block px-4 pb-5">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
          aria-label={`${data.hub.name} ecosystem diagram`}
        >
          {/* Connector lines — animated first */}
          {data.nodes.map((node, i) => {
            const pos = positions[i]
            const C   = P[node.cat]
            return (
              <line
                key={`line-${node.id}`}
                className="eg-lk"
                x1={cx} y1={cy}
                x2={pos.x} y2={pos.y}
                stroke={C.line}
                strokeWidth={1.2}
              />
            )
          })}

          {/* Hub */}
          <g className="eg-hub">
            <circle
              cx={cx} cy={cy} r={HUB_R}
              fill={P.hub.fill}
              stroke={P.hub.stroke}
              strokeWidth={1.5}
            />
            {data.hub.name.split('\n').map((line, li, arr) => (
              <text
                key={li}
                x={cx}
                y={cy + (li - (arr.length - 1) / 2) * 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fontWeight={700}
                letterSpacing="0.03em"
                fill={P.hub.text}
              >
                {line}
              </text>
            ))}
          </g>

          {/* Peripheral nodes */}
          {data.nodes.map((node, i) => {
            const pos = positions[i]
            const lp  = labelPositions[i]
            const C   = P[node.cat]
            const anchor = Math.abs(lp.x - cx) < 12 ? 'middle' : lp.x > cx ? 'start' : 'end'
            const nameLines = node.name.split('\n')

            return (
              <g key={node.id}>
                {/* Node circle */}
                <circle
                  className="eg-nd"
                  cx={pos.x} cy={pos.y}
                  r={NODE_R}
                  fill={C.fill}
                  stroke={C.stroke}
                  strokeWidth={1}
                />

                {/* Label group */}
                <g className="eg-lb">
                  {nameLines.map((line, li) => (
                    <text
                      key={li}
                      x={lp.x}
                      y={lp.y + (li - (nameLines.length - 1) / 2) * 10 - 4}
                      textAnchor={anchor}
                      dominantBaseline="middle"
                      fontSize={8}
                      fontWeight={700}
                      fill={C.text}
                    >
                      {line}
                    </text>
                  ))}
                  <text
                    x={lp.x}
                    y={lp.y + (nameLines.length - 1) * 5 + 7}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontSize={7.5}
                    style={{ fill: 'var(--text-30)' }}
                  >
                    {node.desc}
                  </text>
                </g>
              </g>
            )
          })}

          {/* Footer sub-label */}
          <text
            x={W / 2}
            y={H - 4}
            textAnchor="middle"
            fontSize={7}
            letterSpacing="0.12em"
            style={{ fill: 'var(--text-15, var(--text-20))' }}
          >
            {data.hub.sub}
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 px-2 pb-1">
          {catKeys.map(cat => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: P[cat].text, opacity: 0.8 }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-30)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {CAT_LABELS[cat] ?? cat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: list fallback */}
      <div className="sm:hidden px-5 pb-6">
        <p className="font-bold text-sm mb-4" style={{ color: 'var(--text-60)' }}>
          {data.hub.name}
          <span className="font-normal ml-2" style={{ color: 'var(--text-30)', fontSize: '0.75rem' }}>
            {data.hub.sub}
          </span>
        </p>
        <div className="space-y-2">
          {catKeys.map(cat => (
            <div key={cat}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: P[cat].text, marginBottom: '0.4rem' }}>
                {CAT_LABELS[cat] ?? cat}
              </p>
              <div className="flex flex-wrap gap-2 pl-2">
                {data.nodes.filter(n => n.cat === cat).map(node => (
                  <div
                    key={node.id}
                    className="rounded-lg px-3 py-1.5"
                    style={{ background: P[cat].fill, border: `1px solid ${P[cat].stroke}` }}
                  >
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: P[cat].text, lineHeight: 1.2 }}>
                      {node.name.replace('\n', ' ')}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-30)' }}>{node.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
