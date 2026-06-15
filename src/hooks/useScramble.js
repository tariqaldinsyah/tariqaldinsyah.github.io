import { useCallback, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export function useScramble(text) {
  const elRef    = useRef(null)
  const timerRef = useRef(null)

  const scramble = useCallback(() => {
    let iteration = 0
    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      if (!elRef.current) return
      elRef.current.textContent = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < iteration)  return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      if (iteration >= text.length) clearInterval(timerRef.current)
      iteration += 0.5
    }, 35)
  }, [text])

  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    if (elRef.current) elRef.current.textContent = text
  }, [text])

  return { ref: elRef, scramble, reset }
}
