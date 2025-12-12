export default function KarieraPage() {
  const jobs = [
    {
      title: 'Specjalista ds. Sprzedaży B2B',
      location: 'Katowice',
      type: 'Pełny etat',
      description: 'Poszukujemy doświadczonego specjalisty ds. sprzedaży części do maszyn budowlanych.'
    },
    {
      title: 'Magazynier',
      location: 'Katowice',
      type: 'Pełny etat',
      description: 'Osoba odpowiedzialna za przyjmowanie, kompletowanie i wydawanie towarów.'
    },
    {
      title: 'Specjalista ds. Obsługi Klienta',
      location: 'Katowice / Zdalnie',
      type: 'Pełny etat',
      description: 'Obsługa klientów B2B, doradztwo techniczne, wsparcie sprzedaży.'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Kariera w OMEX</h1>
        <p className="text-xl text-neutral-600 mb-12">
          Dołącz do naszego zespołu i rozwijaj się razem z nami!
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Dlaczego warto pracować w OMEX?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Atrakcyjne wynagrodzenie</h3>
              <p className="text-neutral-600">Konkurencyjne stawki plus system premiowy</p>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold mb-2">Rozwój zawodowy</h3>
              <p className="text-neutral-600">Szkolenia, kursy i możliwość awansu</p>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="font-semibold mb-2">Pakiet medyczny</h3>
              <p className="text-neutral-600">Prywatna opieka zdrowotna dla pracowników</p>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Stabilność</h3>
              <p className="text-neutral-600">Praca w dynamicznie rozwijającej się firmie</p>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="font-semibold mb-2">Przyjazna atmosfera</h3>
              <p className="text-neutral-600">Świetny zespół i kultura organizacyjna</p>
            </div>

            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-semibold mb-2">Dodatkowe benefity</h3>
              <p className="text-neutral-600">Karta sportowa, dofinansowanie do urlopu</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Aktualne oferty pracy</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-500 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold mb-2 md:mb-0">{job.title}</h3>
                  <div className="flex gap-3">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {job.location}
                    </span>
                    <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-semibold">
                      {job.type}
                    </span>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4">{job.description}</p>
                <a
                  href={`mailto:kariera@omex.pl?subject=Aplikacja: ${job.title}`}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Aplikuj teraz
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Aplikacja spontaniczna</h2>
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">Nie znalazłeś odpowiedniej oferty?</h3>
            <p className="mb-6">
              Wyślij nam swoją aplikację spontaniczną. Zawsze poszukujemy utalentowanych osób do naszego zespołu!
            </p>
            <a
              href="mailto:kariera@omex.pl"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
            >
              Wyślij CV
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
