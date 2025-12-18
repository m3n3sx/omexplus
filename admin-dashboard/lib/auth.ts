import api from "./api-client"
import { Role, ROLE_LABELS } from "./roles"

export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: Role
  avatar?: string
  created_at?: string
}

// Mapowanie użytkowników do ról (w produkcji byłoby w bazie danych)
const USER_ROLES: Record<string, Role> = {
  'admin@medusa-test.com': 'super_admin',
  'manager@omex.pl': 'manager',
  'sprzedaz@omex.pl': 'sales',
  'magazyn@omex.pl': 'warehouse',
  'content@omex.pl': 'content',
  'support@omex.pl': 'support',
}

export async function login(email: string, password: string): Promise<AuthUser> {
  try {
    const data = await api.login(email, password)
    
    console.log("Login response:", data)
    
    // Store token
    if (data.token) {
      localStorage.setItem("medusa_admin_token", data.token)
      console.log("Token stored successfully")
    } else {
      throw new Error("No token received from server")
    }
    
    // Determine role based on email (in production, this would come from DB)
    // Domyślnie super_admin dla nieznanych użytkowników (w produkcji zmienić na bardziej restrykcyjne)
    const role: Role = USER_ROLES[email.toLowerCase()] || 'super_admin'
    
    const user: AuthUser = {
      id: data.user?.id || "admin",
      email: email,
      first_name: data.user?.first_name || email.split('@')[0],
      last_name: data.user?.last_name || "",
      role: role,
      created_at: new Date().toISOString(),
    }
    
    // Store user data with role
    localStorage.setItem("admin_user", JSON.stringify(user))
    
    return user
  } catch (error: any) {
    console.error("Login error:", error)
    throw new Error(error.message || "Invalid email or password")
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem("medusa_admin_token")
  localStorage.removeItem("admin_user")
  window.location.href = "/login"
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("medusa_admin_token")
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  
  const stored = localStorage.getItem("admin_user")
  if (!stored) return null
  
  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    return null
  }
}

export function getUserRole(): Role | null {
  const user = getCurrentUser()
  return user?.role || null
}

export function getRoleLabel(role: Role): string {
  return ROLE_LABELS[role] || role
}

// Funkcja do aktualizacji roli użytkownika (tylko dla super_admin)
export async function updateUserRole(userId: string, newRole: Role): Promise<boolean> {
  const currentUser = getCurrentUser()
  if (currentUser?.role !== 'super_admin') {
    throw new Error('Brak uprawnień do zmiany ról')
  }
  
  // W produkcji: wywołanie API do aktualizacji roli w bazie
  console.log(`Updating user ${userId} to role ${newRole}`)
  return true
}
