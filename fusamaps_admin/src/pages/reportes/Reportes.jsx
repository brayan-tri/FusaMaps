export default function Reportes() {
  const reportes = [
    {id:'1',tipo:'bus_no_llego',descripcion:'El bus de la ruta A no llegó al paradero PDR-001',estado:'pendiente',created_at:'2026-03-20'},
    {id:'2',tipo:'bus_retrasado',descripcion:'Ruta B con 30 min de retraso en hora pico',estado:'en_revision',created_at:'2026-03-19'},
    {id:'3',tipo:'paradero_danado',descripcion:'Techo del paradero PDR-003 está dañado',estado:'resuelto',created_at:'2026-03-18'},
  ]
  const BADGE = {pendiente:'badge-red',en_revision:'badge-yellow',resuelto:'badge-green'}
  const LABEL = {pendiente:'Pendiente',en_revision:'En revisión',resuelto:'Resuelto'}
  const TIPO  = {bus_no_llego:'Bus no llegó',bus_retrasado:'Bus retrasado',paradero_danado:'Paradero dañado',conductor_mala_conducta:'Mala conducta',otro:'Otro'}

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Reportes Ciudadanos</h1>
          <p className="page-subtitle">{reportes.filter(r=>r.estado==='pendiente').length} reportes pendientes de revisión</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tipo</th><th>Descripción</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
          <tbody>
            {reportes.map(r=>(
              <tr key={r.id}>
                <td><span className="badge badge-orange">{TIPO[r.tipo]}</span></td>
                <td style={{fontSize:13,color:'var(--text2)',maxWidth:300}}>{r.descripcion}</td>
                <td><span className={`badge ${BADGE[r.estado]}`}>{LABEL[r.estado]}</span></td>
                <td style={{fontSize:12,color:'var(--text3)'}}>{r.created_at}</td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}>✓ Resolver</button>
                    <button className="btn btn-primary" style={{fontSize:11,padding:'5px 10px'}}>🔔 Crear alerta</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
