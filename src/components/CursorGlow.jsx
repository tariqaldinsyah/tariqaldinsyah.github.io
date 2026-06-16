import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTheme } from '../hooks/useTheme'

export default function CursorGlow() {
  const ref    = useRef(null)
  const { theme } = useTheme()
  const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  useEffect(() => {
    if (!isFine) return
    const SIZE = 500
    const onMove = (e) => gsap.to(ref.current, {
      x: e.clientX - SIZE / 2,
      y: e.clientY - SIZE / 2,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isFine])

  if (!isFine) return null

  const glowColor = theme === 'light'
    ? 'rgba(92,138,0,0.05)'
    : 'rgba(192,245,61,0.055)'

  return (
    <div ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[1] rounded-full"
      style={{
        width: 500,
        height: 500,
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
        willChange: 'transform',
      }} />
  )
}
