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
          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <span className="text-4xl flex-shrink-0" aria-hidden="true">
            {badge.icon}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {badge.title}
            </h3>
            <p className="text-sm text-gray-600">
              {badge.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
