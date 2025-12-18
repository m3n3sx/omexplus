"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Button from "@/components/ui/Button"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { 
  Role, 
  ROLE_LABELS, 
  ROLE_DESCRIPTIONS, 
  ROLE_COLORS, 
  ROLE_PERMISSIONS,
  Permission 
} from "@/lib/roles"
import { 
  UserPlus, 
  Shield, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Mail,
  Calendar
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: Role
  is_active: boolean
  created_at: string
  last_login?: string
}

// Mock data - w produkcji z API
const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'admin@medusa-test.com',
    first_name: 'Admin',
    last_name: 'Super',
    role: 'super_admin',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'manager@omex.pl',
    first_name: 'Jan',
    last_name: 'Kowalski',
    role: 'manager',
    is_active: true,
    created_at: '2024-06-01T00:00:00Z',
    last_login: '2024-12-14T15:30:00Z',
  },
  {
    id: '3',
    email: 'sprzedaz@omex.pl',
    first_name: 'Anna',
    last_name: 'Nowak',
    role: 'sales',
    is_active: true,
    created_at: '2024-08-15T00:00:00Z',
    last_login: '2024-12-15T09:00:00Z',
  },
  {
    id: '4',
    email: 'magazyn@omex.pl',
    first_name: 'Piotr',
    last_name: 'Wiśniewski',
    role: 'warehouse',
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    last_login: '2024-12-15T08:00:00Z',
  },
  {
    id: '5',
    email: 'content@omex.pl',
    first_name: 'Maria',
    last_name: 'Zielińska',
    role: 'content',
    is_active: false,
    created_at: '2024-10-01T00:00:00Z',
  },
]

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Tylko super_admin i manager mogą zarządzać użytkownikami
    if (user?.role !== 'super_admin' && user?.role !== 'manager') {
      router.push("/")
    }
  }, [router])

  const canEditUser = (user: AdminUser): boolean => {
    if (!currentUser) return false
    if (currentUser.role === 'super_admin') return true
    if (currentUser.role === 'manager' && user.role !== 'super_admin') return true
    return false
  }

  const handleChangeRole = (user: AdminUser) => {
    setSelectedUser(user)
    setSelectedRole(user.role)
    setShowRoleModal(true)
  }

  const saveRoleChange = () => {
    if (!selectedUser || !selectedRole) return
    
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, role: selectedRole } : u
    ))
    setShowRoleModal(false)
    setSelectedUser(null)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, is_active: !u.is_active } : u
    ))
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Użytkownicy</h1>
            <p className="text-gray-600 mt-1">
              Zarządzaj dostępem do panelu administracyjnego
            </p>
          </div>
          {currentUser?.role === 'super_admin' && (
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Dodaj użytkownika
            </Button>
          )}
        </div>

        {/* Role Legend */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Role i uprawnienia</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.keys(ROLE_LABELS) as Role[]).map(role => (
              <div key={role} className="text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}>
                  {ROLE_LABELS[role]}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {ROLE_PERMISSIONS[role].length} uprawnień
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Użytkownik</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rola</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ostatnie logowanie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Utworzony</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {user.first_name[0]}{user.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? (
                        <><Check className="w-3 h-3 mr-1" /> Aktywny</>
                      ) : (
                        <><X className="w-3 h-3 mr-1" /> Nieaktywny</>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.last_login ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.last_login)}
                      </span>
                    ) : (
                      <span className="text-gray-400">Nigdy</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {canEditUser(user) && user.id !== currentUser?.id && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleChangeRole(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={user.is_active ? "ghost" : "secondary"}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.is_active ? (
                            <X className="w-4 h-4 text-red-600" />
                          ) : (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Change Role Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">
                Zmień rolę: {selectedUser.first_name} {selectedUser.last_name}
              </h2>
              
              <div className="space-y-3 mb-6">
                {(Object.keys(ROLE_LABELS) as Role[]).map(role => {
                  // Manager nie może przypisać roli super_admin
                  if (currentUser?.role === 'manager' && role === 'super_admin') {
                    return null
                  }
                  
                  return (
                    <label
                      key={role}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRole === role 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={() => setSelectedRole(role)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[role]}`}>
                          {ROLE_LABELS[role]}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {ROLE_PERMISSIONS[role].length} uprawnień
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowRoleModal(false)}>
                  Anuluj
                </Button>
                <Button onClick={saveRoleChange}>
                  Zapisz
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
