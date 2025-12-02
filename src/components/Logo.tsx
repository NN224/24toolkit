interface LogoProps {
  className?: string
  width?: number
  height?: number
  compact?: boolean
}

export default function Logo({ className = '', width = 200, height = 60, compact = false }: LogoProps) {
  if (compact) {
    return (
      <img 
        src="/logo.png" 
        alt="24Toolkit" 
        width={40}
        height={40}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    )
  }
  
  return (
    <img 
      src="/logo.png" 
      alt="24Toolkit Logo" 
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
