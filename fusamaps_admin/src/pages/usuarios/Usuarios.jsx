import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const ROLES = ['ciudadano','conductor','admin_empresa','admin_municipal','super_admin']
const ROL_LABEL = {
  ciudadano:'Ciudadano', conductor:'Conductor',
  admin_empresa:'Admin Empresa', admin_municipal:'Admin Municipal', super_admin:'Super Admin'
}
const ROL_BADGE = {
  ciudadano:'badge-blue', conductor:'badge-orange',
  admin_empresa:'badge-yellow', admin_municipal:'badge-green', super_admin:'badge-green'
}

export default function Usuarios() {
  const { user: me } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [buscar, setBuscar]     = useState('')
  const [modal, setModal]       = useState(null) // {tipo, usuario}
  const [nuevoRol, setNuevoRol] = useState('')
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')

  const esSuperAdmin = me?.rol === 'super_admin'

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await api.get('/usuarios')
      setUsuarios(res.data.data)
    } catch {
      // mock data para desarrollo
      setUsuarios([
        {id:'1',nombre:'Admin FusaMaps',email:'admin@fusamaps.co',rol:'super_admin',activo:true,creado_en:'2026-01-01'},
        {id:'2',nombre:'Juan Perez',email:'juan@gmail.com',rol:'ciudadano',activo:true,creado_en:'2026-03-15'},
        {id:'3',nombre:'Carlos Conductor',email:'carlos@fusa.co',rol:'conductor',activo:true,creado_en:'2026-02-20'},
        {id:'4',nombre:'Admin Municipal',email:'admin@fusagasuga.gov.co',rol:'admin_municipal',activo:true,creado_en:'2026-01-10'},
      ])
    } finally { setLoading(false) }
  }

  const cambiarRol = async () => {
    setSaving(true)
    try {
      await api.put(`/usuarios/${modal.usuario.id}/rol`, { rol: nuevoRol })
      setMsg('✅ Rol actualizado correctamente')
      cargar(); setModal(null)
    } catch { setMsg('❌ Error al cambiar el rol') }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000) }
  }

  const cambiarEstado = async (u) => {
    try {
      await api.put(`/usuarios/${u.id}/estado`, { activo: !u.activo })
      cargar()
    } catch {}
  }

  const filtrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
    u.email?.toLowerCase().includes(buscar.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Gestión de Usuarios</h1>
          <p className="page-subtitle">{usuarios.length} usuarios registrados en el sistema</p>
        </div>
      </div>

      {msg && <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 16px',marginBottom:16,fontSize:13}}>{msg}</div>}

      {/* Filtros */}
      <div className="flex-between" style={{marginBottom:16,gap:12,flexWrap:'wrap'}}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Buscar por nombre o correo..." value={buscar} onChange={e=>setBuscar(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:8}}>
          {['Todos','Ciudadano','Conductor','Admin'].map(f=>(
            <button key={f} className="btn btn-secondary" style={{fontSize:12,padding:'6px 14px'}}>{f}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="table-wrap">
        {loading ? (
          <div className="loading"><div className="spinner"/><span>Cargando usuarios...</span></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{
                        width:34,height:34,borderRadius:10,
                        background:'linear-gradient(135deg,var(--green),#22C55E)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:13,fontWeight:700,color:'white',flexShrink:0
                      }}>{u.nombre?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{u.nombre}</div>
                        {u.id === me?.id && <span style={{fontSize:10,color:'var(--green)'}}>• Tú</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{color:'var(--text3)',fontFamily:'monospace',fontSize:12}}>{u.email}</td>
                  <td><span className={`badge ${ROL_BADGE[u.rol]}`}>{ROL_LABEL[u.rol]}</span></td>
                  <td>
                    <span className={`badge ${u.activo ? 'badge-green' : 'badge-red'}`}>
                      {u.activo ? '✓ Activo' : '✕ Inactivo'}
                    </span>
                  </td>
                  <td style={{color:'var(--text3)',fontSize:12}}>
                    {new Date(u.creado_en).toLocaleDateString('es-CO')}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      {esSuperAdmin && u.id !== me?.id && (
                        <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}
                          onClick={() => { setModal({tipo:'rol',usuario:u}); setNuevoRol(u.rol) }}>
                          🔄 Rol
                        </button>
                      )}
                      {u.id !== me?.id && (
                        <button
                          className={`btn ${u.activo ? 'btn-danger' : 'btn-secondary'}`}
                          style={{fontSize:11,padding:'5px 10px'}}
                          onClick={() => cambiarEstado(u)}>
                          {u.activo ? '🚫 Desactivar' : '✓ Activar'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal cambiar rol */}
      {modal?.tipo === 'rol' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{marginBottom:4}}>🔄 Cambiar rol de usuario</h3>
            <p style={{fontSize:13,color:'var(--text3)',marginBottom:20}}>
              Usuario: <strong>{modal.usuario.nombre}</strong>
            </p>
            <div className="form-group" style={{marginBottom:20}}>
              <label className="form-label">Nuevo rol</label>
              <select value={nuevoRol} onChange={e=>setNuevoRol(e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={cambiarRol} disabled={saving}>
                {saving ? 'Guardando...' : '✓ Guardar cambio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
