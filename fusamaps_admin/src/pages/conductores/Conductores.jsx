import { useState } from 'react'

export default function Conductores() {
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState({ nombre:'', email:'', placa:'', empresa:'', licencia:'' })

  const conductores = [
    {id:'1',nombre:'Carlos Rodríguez',email:'carlos@fusa.co',placa:'ABC-123',empresa:'Cootransfusa',licencia:'C1-456789',activo:true,ruta:'Ruta A'},
    {id:'2',nombre:'Luis Martínez',email:'luis@fusa.co',placa:'XYZ-789',empresa:'TransFusa',licencia:'C1-123456',activo:true,ruta:'Ruta B'},
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🚗 Gestión de Conductores</h1>
          <p className="page-subtitle">{conductores.length} conductores registrados</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Registrar conductor</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Conductor</th><th>Placa</th><th>Empresa</th><th>Licencia</th><th>Ruta asignada</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {conductores.map(c=>(
              <tr key={c.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,var(--orange),#F97316)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'white'}}>
                      {c.nombre[0]}
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13}}>{c.nombre}</div>
                      <div style={{fontSize:11,color:'var(--text3)'}}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono badge badge-blue">{c.placa}</span></td>
                <td style={{fontSize:13,color:'var(--text2)'}}>{c.empresa}</td>
                <td><span className="mono" style={{fontSize:12,color:'var(--text3)'}}>{c.licencia}</span></td>
                <td><span className="badge badge-green">{c.ruta}</span></td>
                <td><span className={`badge ${c.activo?'badge-green':'badge-red'}`}>{c.activo?'Activo':'Inactivo'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:16}}>🚗 Registrar conductor</h3>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre completo</label>
                  <input placeholder="Carlos Rodríguez" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" placeholder="conductor@fusa.co" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Placa del vehículo</label>
                  <input placeholder="ABC-123" value={form.placa} onChange={e=>setForm({...form,placa:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa transportadora</label>
                  <input placeholder="Cootransfusa" value={form.empresa} onChange={e=>setForm({...form,empresa:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">No. Licencia de conducción</label>
                  <input placeholder="C1-456789" value={form.licencia} onChange={e=>setForm({...form,licencia:e.target.value})} />
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn btn-primary">✓ Registrar conductor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
