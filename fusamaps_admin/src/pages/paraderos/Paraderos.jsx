// Paraderos.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Paraderos() {
  const [paraderos, setParaderos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nombre:'', codigo:'', direccion:'', lat:'4.3361', lng:'-74.3647' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await api.get('/paraderos')
      setParaderos(res.data.data)
    } catch {
      setParaderos([
        {id:'1',nombre:'Parque Principal',codigo:'PDR-001',direccion:'Cra. 6 con Cl. 7',activo:true},
        {id:'2',nombre:'Terminal de Transportes',codigo:'PDR-002',direccion:'Av. Colón',activo:true},
        {id:'3',nombre:'Hospital San Rafael',codigo:'PDR-003',direccion:'Cra. 5 con Cl. 14',activo:true},
        {id:'4',nombre:'Plaza de Mercado',codigo:'PDR-004',direccion:'Cl. 10 con Cra. 8',activo:true},
      ])
    } finally { setLoading(false) }
  }

  const crear = async () => {
    setSaving(true)
    try { await api.post('/paraderos', form); cargar(); setModal(false) }
    catch { alert('Error al crear paradero') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📍 Gestión de Paraderos</h1>
          <p className="page-subtitle">{paraderos.length} paraderos registrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo paradero</button>
      </div>

      <div className="table-wrap">
        {loading ? <div className="loading"><div className="spinner"/></div> : (
          <table>
            <thead>
              <tr><th>Código</th><th>Nombre</th><th>Dirección</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {paraderos.map(p => (
                <tr key={p.id}>
                  <td><span className="mono badge badge-blue">{p.codigo}</span></td>
                  <td style={{fontWeight:600}}>{p.nombre}</td>
                  <td style={{color:'var(--text3)',fontSize:12}}>{p.direccion}</td>
                  <td><span className={`badge ${p.activo?'badge-green':'badge-red'}`}>{p.activo?'Activo':'Inactivo'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}>✏️ Editar</button>
                      <button className="btn btn-danger" style={{fontSize:11,padding:'5px 10px'}}>Desactivar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:16}}>📍 Nuevo paradero</h3>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input placeholder="Parque Principal" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Código *</label>
                  <input placeholder="PDR-005" value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input placeholder="Cra. 6 con Cl. 7" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Latitud GPS</label>
                  <input placeholder="4.3361" value={form.lat} onChange={e=>setForm({...form,lat:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitud GPS</label>
                  <input placeholder="-74.3647" value={form.lng} onChange={e=>setForm({...form,lng:e.target.value})} />
                </div>
              </div>
              <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:10,fontSize:12,color:'var(--text3)'}}>
                💡 Las coordenadas GPS se pueden obtener haciendo clic derecho en Google Maps → "¿Qué hay aquí?"
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={crear} disabled={saving||!form.nombre||!form.codigo}>
                {saving?'Guardando...':'✓ Crear paradero'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
