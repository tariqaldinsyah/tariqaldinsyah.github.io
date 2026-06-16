function calcH(index, total, minPct, maxPct) {
  const center = (total - 1) / 2
  const dist = Math.abs(index - center)
  const maxDist = center || 1
  // V shape: tallest at edges, shortest at center.
  // FLIP: change to (1 - dist / maxDist) for mountain/peak-at-center.
  const pct = dist / maxDist
  return `${Math.round(minPct + pct * (maxPct - minPct))}%`
}

export default function GradientBars({
  numBars = 13,
  minPct = 3,
  maxPct = 92,
  duration = 8,
}) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const center = Math.floor(numBars / 2)

  return (
    <>
      <style>{`
        @keyframes gbPulse {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(0.35); }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '4px',
          padding: '0 4px',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: numBars }, (_, i) => {
          const h = calcH(i, numBars, minPct, maxPct)
          const delay = Math.abs(i - center) * (duration / numBars)
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                background: 'var(--lime-text)',
                // Lime vivid at floor, fades to transparent going up.
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                transformOrigin: 'bottom center',
                willChange: reduced ? 'auto' : 'transform',
                animation: reduced
                  ? 'none'
                  : `gbPulse ${duration}s ease-in-out ${delay}s infinite`,
              }}
            />
          )
        })}
      </div>
    </>
  )
}
