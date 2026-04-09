import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import './Layout.css'

const NAV = [
  { to: '/',             icon: '📊', label: 'Dashboard',   exact: true },
  { to: '/usuarios',     icon: '👥', label: 'Usuarios' },
  { to: '/rutas',        icon: '🚌', label: 'Rutas' },
  { to: '/paraderos',    icon: '📍', label: 'Paraderos' },
  { to: '/alertas',      icon: '🔔', label: 'Alertas' },
  { to: '/conductores',  icon: '🚗', label: 'Conductores' },
  { to: '/reportes',     icon: '📋', label: 'Reportes' },
  { to: '/configuracion',icon: '⚙️', label: 'Configuración' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const rolLabel = {
    super_admin:    '👑 Super Admin',
    admin_municipal:'🏛️ Admin Municipal',
    admin_empresa:  '🏢 Admin Empresa',
  }[user?.rol] || user?.rol

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <span>🗺️</span>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-fusa">Fusa</span>
              <span className="logo-maps">Maps</span>
              <span className="logo-admin">Admin</span>
            </div>
          )}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? label : ''}
            >
              <span className="nav-icon">{icon}</span>
              {!collapsed && <span className="nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.nombre?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="user-details">
                <div className="user-name">{user?.nombre}</div>
                <div className="user-role">{rolLabel}</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
            🚪
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="header-dot" />
            <span className="header-status">Sistema activo</span>
          </div>
          <div className="header-right">
            <div className="header-badge">
              <span>🕐</span>
              <span>{new Date().toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long' })}</span>
            </div>
            <div className="header-user">
              <div className="header-avatar">{user?.nombre?.[0]?.toUpperCase()}</div>
              <span>{user?.nombre}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
