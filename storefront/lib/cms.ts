// CMS Client dla frontendu
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function getCMSContent(key: string, locale: string = 'pl') {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms?key=${key}&locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.content
  } catch (error) {
    console.error('Failed to fetch CMS content:', error)
    return null
  }
}

export async function getCMSContentsByType(type: string, locale: string = 'pl') {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms?type=${type}&locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.contents || []
  } catch (error) {
    console.error('Failed to fetch CMS contents:', error)
    return []
  }
}

export async function getCMSMenu(key: string, locale: string = 'pl') {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms/menus?key=${key}&locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.menu
  } catch (error) {
    console.error('Failed to fetch CMS menu:', error)
    return null
  }
}

export async function getAllCMSMenus(locale: string = 'pl') {
  try {
    const res = await fetch(`${BACKEND_URL}/store/cms/menus?locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.menus || []
  } catch (error) {
    console.error('Failed to fetch CMS menus:', error)
    return []
  }
}
