import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    const mouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        setCursorVariant('hover')
      }
    }

    const mouseLeave = () => {
      setCursorVariant('default')
    }

    window.addEventListener('mousemove', mouseMove)
    
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', mouseEnter)
      el.addEventListener('mouseleave', mouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', mouseEnter)
        el.removeEventListener('mouseleave', mouseLeave)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      width: 20,
      height: 20,
    },
    hover: {
      x: mousePosition.x - 15,
      y: mousePosition.y - 15,
      width: 30,
      height: 30,
    }
  }

  const dotVariants = {
    default: {
      x: mousePosition.x - 3,
      y: mousePosition.y - 3,
    }
  }

  return (
    <>
      <motion.div
        className="custom-cursor hidden lg:block"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28
        }}
      />
      <motion.div
        className="custom-cursor-dot hidden lg:block"
        variants={dotVariants}
        animate="default"
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 35
        }}
      />
    </>
  )
}
