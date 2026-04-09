import { useState, useEffect } from 'react'
import api from '../../services/api'

const TIPOS = ['desvio','cierre','suspension','horario_especial','informacion']
const TIPO_LABEL = {desvio:'Desvío',cierre:'Cierre vial',suspension:'Suspensión',horario_especial:'Horario especial',informacion:'Información'}
const TIPO_BADGE = {desvio:'badge-orange',cierre:'badge-red',suspension:'badge-red',horario_especial:'badge-yellow',informacion:'badge-blue'}

export default function Alertas() {
  const [alertas, setAlertas]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({ titulo:'', descripcion:'', tipo:'desvio', ruta_id:'', vigente_hasta:'' })

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await api.get('/alertas')
      setAlertas(res.data.data)
    } catch {
      setAlertas([
        {id:'1',titulo:'Desvío Ruta A – Calle 7',descripcion:'Por obras en la Cra 6, la ruta A tomará la Cra 8.',tipo:'desvio',activa:true,created_at:'2026-03-20T10:00:00Z'},
        {id:'2',titulo:'Suspensión temporal Ruta C',descripcion:'Suspendida por paro de transportadores.',tipo:'suspension',activa:true,created_at:'2026-03-19T14:00:00Z'},
        {id:'3',titulo:'Horario especial festivo',descripcion:'El 20 de marzo las rutas operarán de 6AM a 8PM.',tipo:'horario_especial',activa:false,created_at:'2026-03-18T08:00:00Z'},
      ])
    } finally { setLoading(false) }
  }

  const crear = async () => {
    setSaving(true)
    try {
      await api.post('/alertas', form)
      cargar(); setModal(false)
      setForm({titulo:'',descripcion:'',tipo:'desvio',ruta_id:'',vigente_hasta:''})
    } catch { alert('Error al crear la alerta') }
    finally { setSaving(false) }
  }

  const desactivar = async (id) => {
    try { await api.delete(`/alertas/${id}`); cargar() } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Alertas de Servicio</h1>
          <p className="page-subtitle">Gestión de alertas para los ciudadanos de Fusagasugá</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nueva alerta</button>
      </div>

      {/* Cards de alertas activas */}
      <div style={{display:'grid',gap:12,marginBottom:24}}>
        {alertas.filter(a=>a.activa).map(a=>(
          <div key={a.id} className="card" style={{borderLeft:`4px solid ${a.tipo==='suspension'?'var(--red)':a.tipo==='desvio'?'var(--orange)':'var(--blue)'}`,padding:'16px 20px'}}>
            <div className="flex-between">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{fontSize:24}}>
                  {a.tipo==='desvio'?'🔀':a.tipo==='cierre'?'🚧':a.tipo==='suspension'?'⛔':a.tipo==='horario_especial'?'🕐':'ℹ️'}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{a.titulo}</div>
                  <div style={{fontSize:12,color:'var(--text3)',marginTop:2}}>{a.descripcion}</div>
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <span className={`badge ${TIPO_BADGE[a.tipo]}`}>{TIPO_LABEL[a.tipo]}</span>
                    <span className="badge badge-green">✓ Activa</span>
                    <span style={{fontSize:11,color:'var(--text4)'}}>{new Date(a.created_at).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-danger" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>desactivar(a.id)}>
                Desactivar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historial */}
      <div className="card">
        <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>📋 Historial de alertas</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Título</th><th>Tipo</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><div className="loading"><div className="spinner"/></div></td></tr>
              ) : alertas.map(a=>(
                <tr key={a.id}>
                  <td style={{fontWeight:500}}>{a.titulo}</td>
                  <td><span className={`badge ${TIPO_BADGE[a.tipo]}`}>{TIPO_LABEL[a.tipo]}</span></td>
                  <td><span className={`badge ${a.activa?'badge-green':'badge-red'}`}>{a.activa?'Activa':'Inactiva'}</span></td>
                  <td style={{fontSize:12,color:'var(--text3)'}}>{new Date(a.created_at).toLocaleDateString('es-CO')}</td>
                  <td>
                    {a.activa && (
                      <button className="btn btn-danger" style={{fontSize:11,padding:'4px 10px'}} onClick={()=>desactivar(a.id)}>Desactivar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:4}}>🔔 Nueva alerta de servicio</h3>
            <p style={{fontSize:12,color:'var(--text3)',marginBottom:20}}>La alerta será visible para todos los ciudadanos en la app.</p>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input placeholder="Ej: Desvío Ruta A – Calle 7" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo *</label>
                <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}>
                  {TIPOS.map(t=><option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción *</label>
                <textarea rows={3} placeholder="Explica el motivo de la alerta..." value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Vigente hasta (opcional)</label>
                <input type="datetime-local" value={form.vigente_hasta} onChange={e=>setForm({...form,vigente_hasta:e.target.value})} />
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={crear} disabled={saving||!form.titulo||!form.descripcion}>
                {saving?'Publicando...':'📢 Publicar alerta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
