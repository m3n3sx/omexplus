'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function BlogPage() {
  const locale = useLocale()
  const [email, setEmail] = useState('')

  const postIcons = {
    wrench: <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    gear: <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L6.75 2.906m9.944 18.08l-1.15-.964M5.255 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514" /></svg>,
    scale: <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    calculator: <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    tools: <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
    snowflake: <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3" /></svg>
  }

  const posts = [
    {
      title: 'Kiedy wymienić filtry w koparce CAT 320? Kompletny poradnik',
      excerpt: 'Regularna wymiana filtrów to klucz do długiej żywotności maszyny. Dowiedz się, kiedy i jak wymieniać filtry w koparce CAT 320.',
      date: '2024-12-15',
      category: 'Poradniki',
      icon: 'wrench',
      readTime: '8 min'
    },
    {
      title: 'Wałki obrotu - najczęstsze usterki i jak ich unikać',
      excerpt: 'Wałki obrotu to kluczowy element maszyn budowlanych. Poznaj najczęstsze problemy i sposoby ich zapobiegania.',
      date: '2024-12-10',
      category: 'Konserwacja',
      icon: 'gear',
      readTime: '6 min'
    },
    {
      title: 'Oryginalne czy zamienne części? Jak wybrać?',
      excerpt: 'Porównanie zalet i wad części oryginalnych oraz zamienników. Kiedy warto zainwestować w oryginał, a kiedy zamiennik wystarczy?',
      date: '2024-12-05',
      category: 'Porównania',
      icon: 'scale',
      readTime: '10 min'
    },
    {
      title: 'Ile kosztuje utrzymanie koparki rocznie? Kalkulator',
      excerpt: 'Szczegółowa analiza kosztów eksploatacji koparki. Filtry, oleje, części zamienne - wszystko co musisz wiedzieć.',
      date: '2024-11-28',
      category: 'Poradniki',
      icon: 'calculator',
      readTime: '12 min'
    },
    {
      title: 'Gąsienice do koparek - jak je konserwować?',
      excerpt: 'Praktyczne wskazówki dotyczące konserwacji gąsienic. Przedłuż żywotność podwozia swojej maszyny.',
      date: '2024-11-20',
      category: 'Konserwacja',
      icon: 'tools',
      readTime: '7 min'
    },
    {
      title: 'Jak przygotować maszynę do zimy?',
      excerpt: 'Zima to trudny czas dla maszyn budowlanych. Poznaj nasze wskazówki dotyczące przygotowania sprzętu do pracy w niskich temperaturach.',
      date: '2024-11-15',
      category: 'Poradniki',
      icon: 'snowflake',
      readTime: '9 min'
    }
  ]

  const categories = ['Wszystkie', 'Poradniki', 'Konserwacja', 'Porównania', 'Nowości']
  const [activeCategory, setActiveCategory] = useState('Wszystkie')

  const filteredPosts = activeCategory === 'Wszystkie' 
    ? posts 
    : posts.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Blog</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Wiedza</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-700 mt-4 mb-4 font-heading">
            Poradnik <span className="text-primary-500">Części</span>
          </h1>
          <p className="text-secondary-500 text-lg max-w-2xl mx-auto">
            Wszystko co musisz wiedzieć o częściach do maszyn budowlanych. Porady ekspertów, poradniki konserwacji i nowości branżowe.
          </p>
          <div className="flex justify-center gap-1 mt-4">
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-5 h-1 bg-primary-500 rounded-sm"></span>
            <span className="w-10 h-1 bg-primary-500 rounded-sm"></span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 border border-neutral-200 hover:border-primary-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post, index) => (
            <article key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="aspect-video bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                <div className="group-hover:scale-110 transition-transform">{postIcons[post.icon as keyof typeof postIcons]}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-sm text-secondary-400">
                    {new Date(post.date).toLocaleDateString('pl-PL')}
                  </span>
                  <span className="text-sm text-secondary-400">• {post.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-secondary-700 mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-secondary-500 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm flex items-center gap-2 group/btn">
                  Czytaj więcej
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Newsletter</span>
            <h2 className="text-2xl lg:text-3xl font-bold mt-4 mb-4 font-heading">
              Bądź na bieżąco
            </h2>
            <p className="text-neutral-300 mb-8">
              Zapisz się do newslettera i otrzymuj najnowsze artykuły, porady oraz ekskluzywne oferty prosto na swoją skrzynkę!
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres e-mail"
                className="flex-1 px-4 py-3 rounded-full text-secondary-700 focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-8 py-3 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">
                Zapisz się
              </button>
            </div>
            <p className="text-neutral-400 text-xs mt-4">
              Możesz zrezygnować w każdej chwili. Szanujemy Twoją prywatność.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
