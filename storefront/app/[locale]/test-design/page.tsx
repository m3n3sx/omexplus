export default function TestDesignPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">OMEX Design Test</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Test Systemu Designu
          </h2>
          <p className="text-gray-700 mb-4">
            Jeśli widzisz ten tekst ze stylami, Tailwind działa poprawnie!
          </p>
          
          <div className="flex gap-4 mb-6">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary text-white rounded-lg">
              <h3 className="font-bold mb-2">Primary Color</h3>
              <p className="text-sm">#1a3a52</p>
            </div>
            <div className="p-4 bg-secondary text-white rounded-lg">
              <h3 className="font-bold mb-2">Secondary Color</h3>
              <p className="text-sm">#f47c20</p>
            </div>
            <div className="p-4 bg-success text-white rounded-lg">
              <h3 className="font-bold mb-2">Success Color</h3>
              <p className="text-sm">#27ae60</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Product Card Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Image {i}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Product {i}</h4>
                  <p className="text-sm text-gray-600 mb-2">SKU: PROD-00{i}</p>
                  <p className="text-2xl font-bold text-primary mb-2">€99.99</p>
                  <p className="text-success text-sm mb-3">✓ W magazynie</p>
                  <button className="w-full btn-primary text-sm py-2">
                    Dodaj do koszyka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
