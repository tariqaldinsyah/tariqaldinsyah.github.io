function calcH(index, total, min, max) {
  const center = (total - 1) / 2
  const dist = Math.abs(index - center)
  const maxDist = center || 1
  // Peak at center, taper to edges.
  // FLIP height shape: change to (dist / maxDist) for tall-at-edges instead.
  const pct = 1 - dist / maxDist
  return min + pct * (max - min)
}

export default function GradientBars({
  numBars = 13,
  minH = 60,
  maxH = 400,
  duration = 3,
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
          // Explicit bottom-anchored container — only as tall as the tallest bar.
          // This guarantees bars grow from the floor of Hero upward, no ambiguity.
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: maxH,
          display: 'flex',
          // FLIP bar anchor: change 'flex-end' → 'flex-start' to anchor at TOP instead.
          alignItems: 'flex-end',
          gap: '4px',
          padding: '0 4px',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: numBars }, (_, i) => {
          const h = calcH(i, numBars, minH, maxH)
          const delay = Math.abs(i - center) * (duration / numBars)
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                // LIME at peak (top of bar), fades to var(--bg) at base (Hero floor).
                // FLIP gradient direction: change 'to bottom' → 'to top' for lime-at-base.
                background: 'linear-gradient(to bottom, var(--lime-text) 0%, var(--bg) 100%)',
                // scaleY animation squishes from the bottom (floor stays fixed).
                // FLIP animation origin: change 'bottom center' → 'top center'.
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
