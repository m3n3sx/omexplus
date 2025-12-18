"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { canAccessPage, Permission, hasPermission, Role } from "@/lib/roles"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
}

export default function ProtectedRoute({ 
  children, 
  permission,
  permissions,
  requireAll = false,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = () => {
    // Sprawdź czy zalogowany
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Sprawdź uprawnienia do strony
    if (!canAccessPage(user.role, pathname)) {
      router.push("/")
      return
    }

    // Sprawdź dodatkowe uprawnienia jeśli podane
    if (permission && !hasPermission(user.role, permission)) {
      router.push("/")
      return
    }

    if (permissions && permissions.length > 0) {
      if (requireAll) {
        const hasAll = permissions.every(p => hasPermission(user.role, p))
        if (!hasAll) {
          router.push("/")
          return
        }
      } else {
        const hasAny = permissions.some(p => hasPermission(user.role, p))
        if (!hasAny) {
          router.push("/")
          return
        }
      }
    }

    setAuthorized(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Sprawdzanie uprawnień...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Brak dostępu</h1>
          <p className="text-gray-600">Nie masz uprawnień do tej strony.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook do sprawdzania uprawnień w komponentach
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const can = (permission: Permission): boolean => {
    if (!user) return false
    return hasPermission(user.role as Role, permission)
  }

  const canAny = (permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.some(p => hasPermission(user.role as Role, p))
  }

  return {
    user,
    loading,
    role: user?.role as Role | undefined,
    can,
    canAny,
    isSuperAdmin: user?.role === 'super_admin',
    isManager: user?.role === 'manager' || user?.role === 'super_admin',
  }
}
