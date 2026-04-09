import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Usuarios from './pages/usuarios/Usuarios'
import Rutas from './pages/rutas/Rutas'
import Paraderos from './pages/paraderos/Paraderos'
import Alertas from './pages/alertas/Alertas'
import Conductores from './pages/conductores/Conductores'
import Reportes from './pages/reportes/Reportes'
import Configuracion from './pages/configuracion/Configuracion'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner"/></div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios"     element={<Usuarios />} />
        <Route path="rutas"        element={<Rutas />} />
        <Route path="paraderos"    element={<Paraderos />} />
        <Route path="alertas"      element={<Alertas />} />
        <Route path="conductores"  element={<Conductores />} />
        <Route path="reportes"     element={<Reportes />} />
        <Route path="configuracion"element={<Configuracion />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
