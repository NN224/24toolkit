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
        src="/android-chrome-192x192.png" 
        alt="24Toolkit" 
        width={width}
        height={height}
        className={`${className} brightness-110 contrast-110`}
        style={{ objectFit: 'contain' }}
      />
    )
  }
  
  return (
    <img 
      src="/android-chrome-512x512.png" 
      alt="24Toolkit Logo" 
      width={width}
      height={height}
      className={`${className} brightness-110 contrast-110`}
      style={{ objectFit: 'contain' }}
    />
  )
}
