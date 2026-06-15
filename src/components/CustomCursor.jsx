import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef   = useRef(null)
  const wrapRef  = useRef(null)
  const ringRef  = useRef(null)
  const labelRef = useRef(null)
  const stateRef = useRef('idle')

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor')

    // Off-screen initially so no top-left flash
    gsap.set([dotRef.current, wrapRef.current], { x: -300, y: -300 })
    gsap.set(ringRef.current, { scale: 0.46, backgroundColor: 'rgba(192,245,61,0)' })
    gsap.set(labelRef.current, { opacity: 0 })

    const applyState = (state) => {
      if (stateRef.current === state) return
      stateRef.current = state

      if (state === 'idle') {
        gsap.to(dotRef.current,   { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(ringRef.current,  { scale: 0.46, backgroundColor: 'rgba(192,245,61,0)', duration: 0.4, ease: 'power3.out' })
        gsap.to(labelRef.current, { opacity: 0, duration: 0.12 })
        return
      }

      if (state === 'link') {
        gsap.to(dotRef.current,   { scale: 0, opacity: 0, duration: 0.18 })
        gsap.to(ringRef.current,  { scale: 0.75, backgroundColor: 'rgba(192,245,61,0)', duration: 0.4, ease: 'power3.out' })
        gsap.to(labelRef.current, { opacity: 0, duration: 0.12 })
        return
      }

      if (state === 'view') {
        gsap.to(dotRef.current,   { scale: 0, opacity: 0, duration: 0.18 })
        gsap.to(ringRef.current,  { scale: 1, backgroundColor: 'rgba(192,245,61,1)', duration: 0.45, ease: 'power3.out' })
        gsap.to(labelRef.current, { opacity: 1, duration: 0.25, delay: 0.18, ease: 'power2.out' })
        return
      }
    }

    // Track all state changes via mouseover — fired on every element entered
    const onOver = (e) => {
      if (e.target.closest('[data-cursor="view"]')) {
        applyState('view')
      } else if (e.target.closest('a, button, [role="button"], input, textarea, select, [data-interactive]')) {
        applyState('link')
      } else {
        applyState('idle')
      }
    }

    const move = (e) => {
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      gsap.to(wrapRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.42,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const SCALE_BY_STATE = { idle: 0.46, link: 0.75, view: 1 }

    const onDown = () => {
      gsap.to(ringRef.current, { scale: SCALE_BY_STATE[stateRef.current] * 0.78, duration: 0.1 })
      if (stateRef.current === 'idle')
        gsap.to(dotRef.current, { scale: 2.5, duration: 0.1 })
    }

    const onUp = () => {
      gsap.to(ringRef.current, { scale: SCALE_BY_STATE[stateRef.current] ?? 0.46, duration: 0.45, ease: 'back.out(2)' })
      if (stateRef.current === 'idle')
        gsap.to(dotRef.current, { scale: 1, duration: 0.35, ease: 'back.out(2)' })
    }

    const onLeave = () => applyState('idle')

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to exact cursor position */}
      <div ref={dotRef}
        className="fixed top-0 left-0 z-[1001] pointer-events-none rounded-full"
        style={{ width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, background: '#C0F53D', willChange: 'transform' }}
      />

      {/* Ring wrapper — follows with lag at ring center */}
      <div ref={wrapRef}
        className="fixed top-0 left-0 z-[1000] pointer-events-none"
        style={{ marginLeft: -44, marginTop: -44, willChange: 'transform' }}>

        {/* Ring — scales between states */}
        <div ref={ringRef}
          className="w-[88px] h-[88px] rounded-full"
          style={{ border: '1.5px solid #C0F53D', transformOrigin: 'center' }}
        />

        {/* Label — centered inside ring, visible only on view state */}
        <div ref={labelRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-[2px]"
          style={{ opacity: 0 }}>
          <span className="font-black uppercase tracking-widest leading-none"
            style={{ fontSize: 9, color: '#070707', letterSpacing: '0.18em' }}>
            VIEW
          </span>
          <span style={{ fontSize: 11, color: '#070707', lineHeight: 1 }}>→</span>
        </div>
      </div>
    </>
  )
}
