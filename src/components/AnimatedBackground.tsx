import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'
import { useMoodMode, getMoodGradient } from '@/hooks/use-mood-mode'

export default function AnimatedBackground() {
  const { theme } = useTheme()
  const moodMode = useMoodMode()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      if (Math.random() > 0.95) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY
        }
        setParticles(prev => [...prev.slice(-10), newParticle])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getThemeColors = () => {
    switch (theme) {
      case 'cyber':
        return {
          primary: 'rgba(0, 255, 135, 0.3)',
          secondary: 'rgba(255, 0, 255, 0.3)',
          tertiary: 'rgba(0, 255, 255, 0.2)'
        }
      case 'minimal':
        return {
          primary: 'rgba(100, 100, 100, 0.15)',
          secondary: 'rgba(150, 150, 150, 0.15)',
          tertiary: 'rgba(80, 80, 80, 0.1)'
        }
      default:
        return getMoodColors(moodMode)
    }
  }

  const getMoodColors = (mood: string) => {
    switch (mood) {
      case 'morning':
        return {
          primary: 'rgba(56, 189, 248, 0.3)',
          secondary: 'rgba(125, 211, 252, 0.3)',
          tertiary: 'rgba(186, 230, 253, 0.2)'
        }
      case 'day':
        return {
          primary: 'rgba(251, 113, 133, 0.3)',
          secondary: 'rgba(168, 85, 247, 0.3)',
          tertiary: 'rgba(244, 114, 182, 0.2)'
        }
      case 'evening':
        return {
          primary: 'rgba(251, 146, 60, 0.3)',
          secondary: 'rgba(236, 72, 153, 0.3)',
          tertiary: 'rgba(251, 113, 133, 0.2)'
        }
      default:
        return {
          primary: 'rgba(109, 40, 217, 0.3)',
          secondary: 'rgba(56, 189, 248, 0.3)',
          tertiary: 'rgba(168, 85, 247, 0.2)'
        }
    }
  }

  const colors = getThemeColors()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-1/3 h-1/3 rounded-full opacity-15 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.tertiary} 0%, transparent 70%)`
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute w-3 h-3 rounded-full blur-xl opacity-40"
        style={{
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
        }}
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
        }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            background: colors.primary,
          }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: -20 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => {
            setParticles(prev => prev.filter(p => p.id !== particle.id))
          }}
        />
      ))}

      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </div>
  )
}
