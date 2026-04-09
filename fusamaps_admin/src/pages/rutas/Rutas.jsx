import { useState, useEffect } from 'react'
import api from '../../services/api'

const ESTADO_BADGE = {activa:'badge-green',inactiva:'badge-red',desvio:'badge-orange',suspendida:'badge-red'}

export default function Rutas() {
  const [rutas, setRutas]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm]     = useState({ nombre:'', descripcion:'', color_hex:'#16A34A', zona:'centro', horario_inicio:'05:30', horario_fin:'21:30', frecuencia_min:15, tarifa:2800 })

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const res = await api.get('/rutas')
      setRutas(res.data.data)
    } catch {
      setRutas([
        {id:'1',nombre:'Ruta A – Centro',descripcion:'Terminal ↔ Parque Principal',color_hex:'#16A34A',zona:'centro',estado:'activa',horario_inicio:'05:30',horario_fin:'21:30',frecuencia_min:15,tarifa:2800},
        {id:'2',nombre:'Ruta B – Sur',descripcion:'Centro ↔ Balmoral',color_hex:'#EA580C',zona:'sur',estado:'activa',horario_inicio:'06:00',horario_fin:'21:00',frecuencia_min:20,tarifa:2800},
        {id:'3',nombre:'Ruta C – Norte',descripcion:'Parque ↔ Los Cerezos',color_hex:'#1D4ED8',zona:'norte',estado:'activa',horario_inicio:'05:30',horario_fin:'21:30',frecuencia_min:20,tarifa:2800},
      ])
    } finally { setLoading(false) }
  }

  const crear = async () => {
    setSaving(true)
    try { await api.post('/rutas', form); cargar(); setModal(false) }
    catch { alert('Error al crear la ruta') }
    finally { setSaving(false) }
  }

  const desactivar = async (id) => {
    try { await api.delete(`/rutas/${id}`); cargar() } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🚌 Gestión de Rutas</h1>
          <p className="page-subtitle">{rutas.length} rutas registradas en el sistema</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nueva ruta</button>
      </div>

      <div className="table-wrap">
        {loading ? <div className="loading"><div className="spinner"/></div> : (
          <table>
            <thead>
              <tr><th>Ruta</th><th>Zona</th><th>Horario</th><th>Frecuencia</th><th>Tarifa</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {rutas.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:14,height:14,borderRadius:4,background:r.color_hex,flexShrink:0}} />
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{r.nombre}</div>
                        <div style={{fontSize:11,color:'var(--text3)'}}>{r.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue" style={{textTransform:'capitalize'}}>{r.zona}</span></td>
                  <td style={{fontSize:12,color:'var(--text3)',fontFamily:'monospace'}}>{r.horario_inicio} – {r.horario_fin}</td>
                  <td style={{fontSize:12,color:'var(--text3)'}}>c/ {r.frecuencia_min} min</td>
                  <td style={{fontSize:12,color:'var(--green)',fontWeight:600}}>${r.tarifa?.toLocaleString()}</td>
                  <td><span className={`badge ${ESTADO_BADGE[r.estado]}`} style={{textTransform:'capitalize'}}>{r.estado}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}>✏️ Editar</button>
                      {r.estado === 'activa' && (
                        <button className="btn btn-danger" style={{fontSize:11,padding:'5px 10px'}} onClick={()=>desactivar(r.id)}>Desactivar</button>
                      )}
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
          <div className="modal" style={{maxWidth:580}} onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:16}}>🚌 Nueva ruta de transporte</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input placeholder="Ruta A – Centro" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Zona</label>
                <select value={form.zona} onChange={e=>setForm({...form,zona:e.target.value})}>
                  {['centro','norte','sur','oriente','occidente','vereda'].map(z=><option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Horario inicio</label>
                <input type="time" value={form.horario_inicio} onChange={e=>setForm({...form,horario_inicio:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Horario fin</label>
                <input type="time" value={form.horario_fin} onChange={e=>setForm({...form,horario_fin:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Frecuencia (min)</label>
                <input type="number" value={form.frecuencia_min} onChange={e=>setForm({...form,frecuencia_min:+e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Tarifa (COP)</label>
                <input type="number" value={form.tarifa} onChange={e=>setForm({...form,tarifa:+e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Color en el mapa</label>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input type="color" value={form.color_hex} onChange={e=>setForm({...form,color_hex:e.target.value})} style={{width:48,height:38,padding:2,cursor:'pointer'}} />
                  <input value={form.color_hex} onChange={e=>setForm({...form,color_hex:e.target.value})} style={{flex:1}} />
                </div>
              </div>
            </div>
            <div className="form-group" style={{marginTop:12}}>
              <label className="form-label">Descripción</label>
              <input placeholder="Ej: Terminal ↔ Parque Principal" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={crear} disabled={saving||!form.nombre}>
                {saving?'Guardando...':'✓ Crear ruta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
