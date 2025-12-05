import api from "./api-client"

export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role?: string
}

export async function login(email: string, password: string): Promise<AuthUser> {
  try {
    const data = await api.login(email, password)
    
    console.log("Login response:", data)
    
    // Store token - Medusa v2 returns just {token: "..."}
    if (data.token) {
      localStorage.setItem("medusa_admin_token", data.token)
      console.log("Token stored successfully")
    } else {
      throw new Error("No token received from server")
    }
    
    // Return user data - we'll get it from the token or use defaults
    return {
      id: data.user?.id || "admin",
      email: email,
      first_name: data.user?.first_name || "Admin",
      last_name: data.user?.last_name || "User",
      role: "admin",
    }
  } catch (error: any) {
    console.error("Login error:", error)
    throw new Error(error.message || "Invalid email or password")
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem("medusa_admin_token")
  window.location.href = "/login"
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("medusa_admin_token")
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getToken()
  if (!token) return null
  
  try {
    const response = await medusaClient.admin.users.list()
    return response.users[0] as AuthUser
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
