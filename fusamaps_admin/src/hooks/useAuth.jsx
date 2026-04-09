import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('admin_user')
    const token = localStorage.getItem('admin_token')
    if (saved && token) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { usuario, accessToken } = res.data.data
    // Solo admins pueden entrar al panel
    if (!['admin_municipal', 'super_admin', 'admin_empresa'].includes(usuario.rol)) {
      throw new Error('No tienes permisos para acceder al panel de administración.')
    }
    localStorage.setItem('admin_token', accessToken)
    localStorage.setItem('admin_user', JSON.stringify(usuario))
    setUser(usuario)
    return usuario
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
