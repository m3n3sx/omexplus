'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'

export default function MenusPage() {
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenus()
  }, [])

  const loadMenus = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get('/admin/cms/menus')
      setMenus(data.menus || [])
    } catch (error) {
      console.error('Failed to load menus:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Zarządzanie Menu</h1>
            <p className="text-gray-600 mt-1">Edytuj nawigację i menu</p>
          </div>
          <Link
            href="/cms/menus/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nowe Menu
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Ładowanie...</div>
        ) : (
          <div className="grid gap-6">
            {menus.map((menu) => (
              <div key={menu.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{menu.name}</h3>
                    <p className="text-sm text-gray-600">Key: {menu.key} • Pozycja: {menu.position}</p>
                  </div>
                  <Link
                    href={`/cms/menus/${menu.id}/edit`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edytuj
                  </Link>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Elementy menu ({menu.items?.length || 0}):</p>
                  {menu.items && menu.items.length > 0 ? (
                    <ul className="space-y-1">
                      {menu.items.map((item: any) => (
                        <li key={item.id} className="text-sm text-gray-600">
                          • {item.label} → {item.url}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">Brak elementów</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
