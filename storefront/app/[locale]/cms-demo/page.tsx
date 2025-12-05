import DynamicSection from '@/components/cms/DynamicSection'

export default function CMSDemoPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-50 py-8 px-4 mb-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">🎨 CMS Demo</h1>
          <p className="text-lg text-gray-700">
            Ta strona pokazuje jak używać dynamicznych sekcji z CMS
          </p>
        </div>
      </div>

      {/* Hero Section z CMS */}
      <DynamicSection sectionKey="home-hero" locale="pl" />

      {/* Przykładowa sekcja */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Jak to działa?</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>1. Dodaj element w panelu CMS</strong><br />
              Przejdź do <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3001/cms</code> i dodaj nowy element.
            </p>
            <p>
              <strong>2. Użyj komponentu DynamicSection</strong><br />
              <code className="bg-gray-100 px-2 py-1 rounded">
                {'<DynamicSection sectionKey="twoj-key" locale="pl" />'}
              </code>
            </p>
            <p>
              <strong>3. Gotowe!</strong><br />
              Sekcja automatycznie się pojawi i będzie edytowalna przez panel.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 text-green-800">✅ Zalety</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Edycja bez kodu</li>
              <li>• Wielojęzyczność</li>
              <li>• Wersjonowanie</li>
              <li>• Łatwe zarządzanie</li>
              <li>• Szybkie zmiany</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 text-blue-800">🎯 Możliwości</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Header i Footer</li>
              <li>• Menu nawigacyjne</li>
              <li>• Hero sections</li>
              <li>• Sekcje treści</li>
              <li>• Bannery i widgety</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Przykłady użycia */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Przykłady komponentów</h2>
          
          <div className="space-y-8">
            {/* Przykład 1: Text */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Type: text
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Komponent tekstowy</h3>
              <p className="text-gray-600 mb-4">
                Użyj typu <code className="bg-gray-100 px-2 py-1 rounded">text</code> dla pojedynczych tekstów
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "key": "welcome-text",
  "type": "text",
  "content": {
    "text": "Witaj w naszym sklepie!",
    "style": "heading"
  }
}`}
              </pre>
            </div>

            {/* Przykład 2: Button */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Type: button
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Komponent przycisku</h3>
              <p className="text-gray-600 mb-4">
                Użyj typu <code className="bg-gray-100 px-2 py-1 rounded">button</code> dla przycisków CTA
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "key": "cta-button",
  "type": "button",
  "content": {
    "text": "Zobacz produkty",
    "url": "/products",
    "style": "primary"
  }
}`}
              </pre>
            </div>

            {/* Przykład 3: Section */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Type: section
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Komponent sekcji</h3>
              <p className="text-gray-600 mb-4">
                Użyj typu <code className="bg-gray-100 px-2 py-1 rounded">section</code> dla większych sekcji treści
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "key": "about-section",
  "type": "section",
  "content": {
    "title": "O nas",
    "content": "<p>Jesteśmy firmą...</p>",
    "layout": "centered"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Gotowy do rozpoczęcia?</h2>
          <p className="text-xl mb-8 opacity-90">
            Otwórz panel CMS i zacznij edytować swoją stronę!
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="http://localhost:3001/cms"
              target="_blank"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Otwórz Panel CMS
            </a>
            <a 
              href="/pl"
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              Strona Główna
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
