import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
}

interface ConfettiProps {
  trigger: boolean
  duration?: number
  pieceCount?: number
}

const colors = [
  '#9333ea', // purple-600
  '#ec4899', // pink-500
  '#0ea5e9', // sky-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
]

export default function Confetti({ 
  trigger, 
  duration = 3000, 
  pieceCount = 50 
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random horizontal position (%)
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5, // Random delay 0-0.5s
        duration: 2 + Math.random() * 2, // Random duration 2-4s
        rotation: Math.random() * 360,
      }))
      
      setPieces(newPieces)

      // Clean up after animation
      const timer = setTimeout(() => {
        setIsActive(false)
        setPieces([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [trigger, duration, pieceCount, isActive])

  if (!isActive || pieces.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
      
      {/* Star shapes */}
      {pieces.slice(0, 10).map((piece) => (
        <div
          key={`star-${piece.id}`}
          className="absolute text-2xl"
          style={{
            left: `${piece.x}%`,
            top: '-30px',
            animation: `confetti-fall ${piece.duration * 1.2}s ease-out ${piece.delay}s forwards`,
          }}
        >
          ✨
        </div>
      ))}
    </div>,
    document.body
  )
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [trigger, setTrigger] = useState(false)

  const celebrate = () => {
    setTrigger(false)
    // Small delay to reset trigger
    setTimeout(() => setTrigger(true), 10)
  }

  return { trigger, celebrate, Confetti: () => <Confetti trigger={trigger} /> }
}
