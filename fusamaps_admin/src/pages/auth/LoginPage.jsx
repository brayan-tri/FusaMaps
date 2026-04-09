import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Fondo decorativo */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🗺️</div>
          <div>
            <div className="login-logo-text">
              <span>Fusa</span><span style={{color:'var(--green)'}}>Maps</span>
            </div>
            <div className="login-logo-sub">Panel de Administración</div>
          </div>
        </div>

        <div className="login-divider" />

        <h1 className="login-title">Acceso administrativo</h1>
        <p className="login-subtitle">Solo para administradores del sistema</p>

        {error && (
          <div className="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@fusamaps.co"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <><div className="spinner" style={{width:16,height:16}}/> Verificando...</> : '🔐 Ingresar al panel'}
          </button>
        </form>

        <div className="login-footer">
          <span>🔒 Acceso restringido</span>
          <span>FusaMaps v1.0.0</span>
        </div>
      </div>
    </div>
  )
}
