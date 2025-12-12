import { notFound } from 'next/navigation'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

async function getPage(slug: string) {
  try {
    // Try to fetch page from CMS API
    const res = await fetch(`${BACKEND_URL}/public/cms/pages/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.page
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export default async function DynamicPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const page = await getPage(params.slug)
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        {page.content?.sections?.find((s: any) => s.type === 'hero') && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="text-xl text-gray-600">
                {page.meta_description}
              </p>
            )}
          </div>
        )}
        
        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {page.content?.sections?.map((section: any, idx: number) => {
            // Hero section
            if (section.type === 'hero') {
              return null // Already rendered above
            }
            
            // Text section
            if (section.type === 'text') {
              return (
                <div 
                  key={idx} 
                  className="prose max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )
            }
            
            // Stats section
            if (section.type === 'stats') {
              return (
                <div key={idx} className="grid grid-cols-4 gap-6 mb-12">
                  {section.items?.map((stat: any, statIdx: number) => (
                    <div key={statIdx} className="text-center">
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )
            }
            
            // Story section
            if (section.type === 'story') {
              return (
                <div key={idx} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              )
            }
            
            // Contact info section
            if (section.type === 'contact_info') {
              return (
                <div key={idx} className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold mb-2">📍 Adres</h3>
                    <p className="text-gray-700 whitespace-pre-line">{section.address}</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">📞 Telefon</h3>
                    <p className="text-gray-700 whitespace-pre-line">{section.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">✉️ Email</h3>
                    <p className="text-gray-700 whitespace-pre-line">{section.email}</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">🕐 Godziny otwarcia</h3>
                    <p className="text-gray-700 whitespace-pre-line">{section.hours}</p>
                  </div>
                </div>
              )
            }
            
            // Tracking form section
            if (section.type === 'tracking_form') {
              return (
                <div key={idx} className="mb-8">
                  <p className="text-gray-700 mb-4">{section.description}</p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Numer zamówienia lub przesyłki"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Śledź
                    </button>
                  </div>
                </div>
              )
            }
            
            // FAQ section
            if (section.type === 'faq') {
              return (
                <div key={idx} className="mb-8">
                  {section.categories?.map((category: any, catIdx: number) => (
                    <div key={catIdx} className="mb-6">
                      <h3 className="text-xl font-bold mb-4">{category.label}</h3>
                      {category.questions?.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="mb-4 border-b pb-4">
                          <h4 className="font-semibold mb-2">{q.question}</h4>
                          <p className="text-gray-700">{q.answer}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )
            }
            
            return null
          })}
        </div>
        
        {/* Metadata */}
        {page.updated_at && (
          <div className="text-center mt-8 text-sm text-gray-500">
            Ostatnia aktualizacja: {new Date(page.updated_at).toLocaleDateString('pl-PL')}
          </div>
        )}
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const page = await getPage(params.slug)
  
  if (!page) {
    return {
      title: 'Page Not Found'
    }
  }
  
  return {
    title: page.seo_title || page.title,
    description: page.meta_description,
  }
}
