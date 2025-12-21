import ContactForm from "@/components/chat/ContactForm"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Skontaktuj się z nami</h1>
          <p className="text-gray-600 text-lg">
            Masz pytania? Chętnie pomożemy! Wypełnij formularz lub skorzystaj z czatu na żywo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">📧 Email</h3>
            <p className="text-gray-600">omexplus@gmail.com</p>
            <p className="text-sm text-gray-500 mt-2">Odpowiadamy w ciągu 24h</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">📞 Telefon</h3>
            <p className="text-gray-600">+48 500 169 060</p>
            <p className="text-sm text-gray-500 mt-2">Pon-Pt: 8:00-16:00</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">💬 Live Chat</h3>
            <p className="text-gray-600">Kliknij ikonę czatu w prawym dolnym rogu</p>
            <p className="text-sm text-gray-500 mt-2">Dostępny 24/7 (bot AI + konsultanci)</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">🏢 Adres</h3>
            <p className="text-gray-600">
              ul. Przykładowa 123<br />
              62-300 Września<br />
              Polska
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
