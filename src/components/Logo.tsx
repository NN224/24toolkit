import logoSvg from '@/assets/logo.svg'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  compact?: boolean
}

export default function Logo({ className = '', width = 200, height = 60, compact = false }: LogoProps) {
  if (compact) {
    return (
      <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6D28D9', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#38BDF8', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle cx="30" cy="30" r="22" stroke="url(#logoGradient)" strokeWidth="3" fill="none" opacity="0.8" filter="url(#glow)"/>
        
        <text x="30" y="40" fontFamily="'Inter', 'Arial', sans-serif" fontSize="28" fontWeight="800" fill="url(#logoGradient)" textAnchor="middle" filter="url(#glow)">24</text>
        
        <circle cx="30" cy="30" r="26" stroke="url(#logoGradient)" strokeWidth="1" fill="none" opacity="0.3"/>
      </svg>
    )
  }
  
  return (
    <img 
      src={logoSvg} 
      alt="24Toolkit Logo" 
      width={width}
      height={height}
      className={className}
    />
  )
}
