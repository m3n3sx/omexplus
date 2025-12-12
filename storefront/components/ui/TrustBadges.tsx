interface Badge {
  icon: string
  title: string
  description: string
}

const badges: Badge[] = [
  {
    icon: '🚚',
    title: 'Szybka wysyłka',
    description: 'InPost, DPD, DHL'
  },
  {
    icon: '✓',
    title: 'Gwarancja',
    description: '24 miesiące'
  },
  {
    icon: '📞',
    title: '24/7 Support',
    description: 'Wsparcie techniczne'
  },
  {
    icon: '🔒',
    title: 'Bezpieczne płatności',
    description: 'SSL, PCI DSS'
  }
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="group relative flex items-center gap-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-secondary-500 hover:shadow-lg hover:shadow-secondary-500/10 transition-all"
        >
          {/* Gold accent on hover */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-lg"></div>
          
          <span className="text-4xl flex-shrink-0" aria-hidden="true">
            {badge.icon}
          </span>
          <div>
            <h3 className="font-bold text-neutral-100 mb-1 uppercase tracking-wide text-sm group-hover:text-secondary-500 transition-colors">
              {badge.title}
            </h3>
            <p className="text-xs text-neutral-400">
              {badge.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
