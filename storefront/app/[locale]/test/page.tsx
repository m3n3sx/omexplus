export default function TestPage() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '3rem', color: '#0ea5e9', marginBottom: '1rem' }}>
        ✅ Next.js działa!
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '2rem' }}>
        Routing i komponenty są poprawnie skonfigurowane
      </p>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Dostępne strony:</h2>
        <ul style={{ textAlign: 'left', lineHeight: '2' }}>
          <li><a href="/pl" style={{ color: '#0ea5e9' }}>Home Page</a></li>
          <li><a href="/pl/search" style={{ color: '#0ea5e9' }}>Search Page</a></li>
          <li><a href="/pl/categories" style={{ color: '#0ea5e9' }}>Categories Page</a></li>
          <li><a href="/pl/kontakt" style={{ color: '#0ea5e9' }}>Contact Page</a></li>
          <li><a href="/pl/o-nas" style={{ color: '#0ea5e9' }}>About Page</a></li>
          <li><a href="/pl/faq" style={{ color: '#0ea5e9' }}>FAQ Page</a></li>
        </ul>
      </div>
    </div>
  )
}
