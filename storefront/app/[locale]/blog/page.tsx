'use client'

export default function BlogPage() {
  const posts = [
    {
      title: 'Jak wybrać odpowiednie części do koparki?',
      excerpt: 'Poradnik dla właścicieli maszyn budowlanych - na co zwrócić uwagę przy wyborze części zamiennych.',
      date: '2024-12-01',
      category: 'Poradniki',
      image: '📚'
    },
    {
      title: 'Konserwacja układu hydraulicznego',
      excerpt: 'Regularna konserwacja układu hydraulicznego to klucz do długiej żywotności maszyny.',
      date: '2024-11-28',
      category: 'Konserwacja',
      image: '🔧'
    },
    {
      title: 'Nowości w ofercie - Zima 2024',
      excerpt: 'Poznaj najnowsze produkty w naszej ofercie. Części do maszyn budowlanych najwyższej jakości.',
      date: '2024-11-25',
      category: 'Nowości',
      image: '🆕'
    },
    {
      title: 'Jak przygotować maszynę do zimy?',
      excerpt: 'Praktyczne wskazówki dotyczące przygotowania sprzętu budowlanego do pracy w trudnych warunkach zimowych.',
      date: '2024-11-20',
      category: 'Poradniki',
      image: '❄️'
    },
    {
      title: 'Filtry oleju - kiedy wymieniać?',
      excerpt: 'Wszystko co musisz wiedzieć o wymianie filtrów oleju w maszynach budowlanych.',
      date: '2024-11-15',
      category: 'Konserwacja',
      image: '🛢️'
    },
    {
      title: 'Gąsienice gumowe vs stalowe',
      excerpt: 'Porównanie zalet i wad gąsienic gumowych i stalowych. Który typ wybrać dla swojej maszyny?',
      date: '2024-11-10',
      category: 'Porównania',
      image: '⚖️'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Blog OMEX</h1>
        <p className="text-xl text-neutral-600 mb-12">
          Porady, nowości i ciekawostki ze świata maszyn budowlanych
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-lg transition-all group">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-6xl">{post.image}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {new Date(post.date).toLocaleDateString('pl-PL')}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2">
                  Czytaj więcej
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Załaduj więcej artykułów
          </button>
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Newsletter</h2>
          <p className="mb-6">
            Zapisz się do newslettera i otrzymuj najnowsze artykuły oraz porady prosto na swoją skrzynkę!
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój adres e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-neutral-900"
            />
            <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors">
              Zapisz się
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
