import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CursorImagePreview() {
  const wrapRef = useRef(null)
  const imgRef  = useRef(null)

  useEffect(() => {
    gsap.set(wrapRef.current, { x: -999, y: -999, scale: 0.88, opacity: 0 })

    const onMove = (e) => {
      gsap.to(wrapRef.current, {
        x: e.clientX + 24,
        y: e.clientY - 90,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', onMove)

    window.__previewShow = (src) => {
      if (!window.matchMedia('(hover: hover)').matches) return
      if (imgRef.current) imgRef.current.src = src
      gsap.to(wrapRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
    }

    window.__previewHide = () => {
      gsap.to(wrapRef.current, { opacity: 0, scale: 0.88, duration: 0.25, ease: 'power2.in', overwrite: 'auto' })
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      delete window.__previewShow
      delete window.__previewHide
    }
  }, [])

  return (
    <div ref={wrapRef}
      className="fixed top-0 left-0 z-[998] pointer-events-none rounded-xl overflow-hidden"
      style={{ width: 280, height: 176, willChange: 'transform, opacity' }}>
      <img ref={imgRef} alt="" className="w-full h-full object-cover" />
    </div>
  )
}
