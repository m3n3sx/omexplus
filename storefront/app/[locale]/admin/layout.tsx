import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations('admin')

  // TODO: Add authentication check
  // const session = await getServerSession()
  // if (!session || session.user.role !== 'admin') {
  //   redirect(`/${locale}/login`)
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
