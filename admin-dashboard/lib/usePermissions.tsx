"use client"

import { useEffect, useState, ReactNode } from 'react'
import { Role, Permission, hasPermission, hasAnyPermission, canAccessPage } from './roles'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: Role
  avatar?: string
  created_at: string
}

// Hook do zarządzania uprawnieniami
export function usePermissions() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem('admin_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const can = (permission: Permission): boolean => {
    if (!user) return false
    return hasPermission(user.role, permission)
  }

  const canAny = (permissions: Permission[]): boolean => {
    if (!user) return false
    return hasAnyPermission(user.role, permissions)
  }

  const canAccess = (path: string): boolean => {
    if (!user) return false
    return canAccessPage(user.role, path)
  }

  const isSuperAdmin = (): boolean => {
    return user?.role === 'super_admin'
  }

  const isManager = (): boolean => {
    return user?.role === 'manager' || user?.role === 'super_admin'
  }

  return {
    user,
    loading,
    role: user?.role,
    can,
    canAny,
    canAccess,
    isSuperAdmin,
    isManager,
    setUser,
    hasPermission: can,
  }
}

// Komponent do warunkowego renderowania na podstawie uprawnień
export function PermissionGate({ 
  children, 
  permission,
  permissions,
  fallback = null,
  requireAll = false,
}: {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  fallback?: ReactNode
  requireAll?: boolean
}) {
  const { can, canAny, loading, user } = usePermissions()

  if (loading) return null
  if (!user) return fallback

  if (permission && !can(permission)) {
    return fallback
  }

  if (permissions) {
    if (requireAll) {
      const hasAll = permissions.every(p => can(p))
      if (!hasAll) return fallback
    } else {
      if (!canAny(permissions)) return fallback
    }
  }

  return <>{children}</>
}

export default usePermissions
