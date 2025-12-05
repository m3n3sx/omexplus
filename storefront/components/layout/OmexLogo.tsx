'use client'

/**
 * OMEX Logo Component
 * Professional logo for heavy machinery parts e-commerce
 */

interface OmexLogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function OmexLogo({ variant = 'full', size = 'md', className = '' }: OmexLogoProps) {
  const sizes = {
    sm: { height: 32, fontSize: '1.25rem' },
    md: { height: 40, fontSize: '1.5rem' },
    lg: { height: 48, fontSize: '1.875rem' },
    xl: { height: 64, fontSize: '2.5rem' },
  }

  const currentSize = sizes[size]

  // Icon only - gear with hexagon
  if (variant === 'icon') {
    return (
      <svg
        width={currentSize.height}
        height={currentSize.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Hexagon background */}
        <path
          d="M50 5L86.6025 27.5V72.5L50 95L13.3975 72.5V27.5L50 5Z"
          fill="url(#gradient1)"
          stroke="#0554F2"
          strokeWidth="3"
        />
        
        {/* Gear teeth */}
        <g transform="translate(50, 50)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x1 = Math.cos(rad) * 20
            const y1 = Math.sin(rad) * 20
            const x2 = Math.cos(rad) * 28
            const y2 = Math.sin(rad) * 28
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#0554F2"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )
          })}
        </g>
        
        {/* Center circle */}
        <circle cx="50" cy="50" r="15" fill="white" stroke="#1675F2" strokeWidth="3" />
        
        {/* Inner detail */}
        <circle cx="50" cy="50" r="8" fill="#1675F2" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8F4FE" />
            <stop offset="100%" stopColor="#D4EBFC" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // Text only
  if (variant === 'text') {
    return (
      <div className={`font-extrabold ${className}`} style={{ fontSize: currentSize.fontSize }}>
        <span className="bg-gradient-to-r from-[#0554F2] to-[#1675F2] bg-clip-text text-transparent">
          OMEX
        </span>
      </div>
    )
  }

  // Full logo - icon + text
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <svg
        width={currentSize.height}
        height={currentSize.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon background */}
        <path
          d="M50 5L86.6025 27.5V72.5L50 95L13.3975 72.5V27.5L50 5Z"
          fill="url(#gradient1)"
          stroke="#0554F2"
          strokeWidth="3"
        />
        
        {/* Gear teeth */}
        <g transform="translate(50, 50)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x1 = Math.cos(rad) * 20
            const y1 = Math.sin(rad) * 20
            const x2 = Math.cos(rad) * 28
            const y2 = Math.sin(rad) * 28
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#0554F2"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )
          })}
        </g>
        
        {/* Center circle */}
        <circle cx="50" cy="50" r="15" fill="white" stroke="#1675F2" strokeWidth="3" />
        
        {/* Inner detail */}
        <circle cx="50" cy="50" r="8" fill="#1675F2" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8F4FE" />
            <stop offset="100%" stopColor="#D4EBFC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span 
          className="font-extrabold bg-gradient-to-r from-[#0554F2] to-[#1675F2] bg-clip-text text-transparent"
          style={{ fontSize: currentSize.fontSize }}
        >
          OMEX
        </span>
        <span 
          className="text-[#6b7280] font-semibold tracking-wider"
          style={{ fontSize: `calc(${currentSize.fontSize} * 0.35)` }}
        >
          PARTS & MACHINERY
        </span>
      </div>
    </div>
  )
}
