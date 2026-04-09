export default function Configuracion() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Configuración del Sistema</h1>
          <p className="page-subtitle">Parámetros generales de FusaMaps</p>
        </div>
        <button className="btn btn-primary">💾 Guardar cambios</button>
      </div>
      <div style={{display:'grid',gap:20}}>
        <div className="card">
          <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>💰 Tarifas del servicio</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tarifa base (COP)</label>
              <input type="number" defaultValue={2800} />
            </div>
            <div className="form-group">
              <label className="form-label">Tarifa especial festivos (COP)</label>
              <input type="number" defaultValue={3200} />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>🕐 Horarios generales</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Inicio del servicio</label>
              <input type="time" defaultValue="05:00" />
            </div>
            <div className="form-group">
              <label className="form-label">Fin del servicio</label>
              <input type="time" defaultValue="22:00" />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>🗺️ Zonas del municipio</div>
          {['Centro','Norte','Sur','Oriente','Occidente','Veredas'].map(z=>(
            <div key={z} style={{
              display:'flex',alignItems:'center',justifyContent:'space-between',
              padding:'10px 0',borderBottom:'1px solid var(--border)'
            }}>
              <span style={{fontSize:13}}>{z}</span>
              <span className="badge badge-green">Activa</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>ℹ️ Información del sistema</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[
              ['Versión','FusaMaps v1.0.0'],
              ['Entorno','Desarrollo'],
              ['Base de datos','PostgreSQL 15 + PostGIS'],
              ['Backend','Node.js 20 + Express'],
              ['Repositorio','github.com/brayan-tri/FusaMaps'],
              ['Módulo actual','M01 Auth + Panel Admin'],
            ].map(([k,v])=>(
              <div key={k} style={{background:'var(--bg3)',borderRadius:8,padding:'10px 14px'}}>
                <div style={{fontSize:11,color:'var(--text4)',marginBottom:2}}>{k}</div>
                <div style={{fontSize:12,color:'var(--text2)',fontFamily:'monospace'}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
