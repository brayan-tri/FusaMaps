import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const mockStats = {
  usuarios: 48, rutas: 4, paraderos: 7,
  alertasActivas: 2, reportesPendientes: 5,
}
const mockChart = [
  {dia:'Lun',logins:12,reportes:2},{dia:'Mar',logins:18,reportes:4},
  {dia:'Mié',logins:15,reportes:1},{dia:'Jue',logins:22,reportes:3},
  {dia:'Vie',logins:30,reportes:6},{dia:'Sáb',logins:14,reportes:2},
  {dia:'Dom',logins:8,reportes:1},
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 14px'}}>
      <div style={{color:'var(--text3)',fontSize:11,marginBottom:4}}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{color:p.color,fontSize:13,fontWeight:600}}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(mockStats)

  const esSuper = user?.rol === 'super_admin'

  const statCards = [
    { icon:'👥', label:'Usuarios registrados', value: stats.usuarios, color:'#16A34A', bg:'#052E16', change:'+3 esta semana' },
    { icon:'🚌', label:'Rutas activas',         value: stats.rutas,    color:'#1D4ED8', bg:'#0F172A', change:'Estables' },
    { icon:'📍', label:'Paraderos activos',     value: stats.paraderos,color:'#EA580C', bg:'#1C0A00', change:'Sin cambios' },
    { icon:'🔔', label:'Alertas activas',       value: stats.alertasActivas, color:'#CA8A04', bg:'#1C1400', change:'2 pendientes' },
    { icon:'📋', label:'Reportes pendientes',   value: stats.reportesPendientes, color:'#DC2626', bg:'#1C0000', change:'Requieren atención' },
  ]

  return (
    <div>
      {/* Bienvenida */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {esSuper ? '👑' : '🏛️'} Bienvenido, {user?.nombre}
          </h1>
          <p className="page-subtitle">
            {esSuper ? 'Super Administrador – Acceso total al sistema' : 'Panel de Administración Municipal – FusaMaps'}
          </p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-secondary">📥 Exportar reporte</button>
          <button className="btn btn-primary">+ Nueva alerta</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{background:s.bg}}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value" style={{color:s.color}}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change up">{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}}>
        {/* Logins por día */}
        <div className="card">
          <div className="flex-between" style={{marginBottom:16}}>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>Actividad de usuarios</div>
              <div style={{fontSize:12,color:'var(--text3)'}}>Logins esta semana</div>
            </div>
            <span className="badge badge-green">Esta semana</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockChart}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="dia" tick={{fill:'var(--text4)',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'var(--text4)',fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="logins" name="Logins" stroke="#16A34A" strokeWidth={2} dot={{fill:'#16A34A',r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reportes */}
        <div className="card">
          <div className="flex-between" style={{marginBottom:16}}>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>Reportes ciudadanos</div>
              <div style={{fontSize:12,color:'var(--text3)'}}>Por día esta semana</div>
            </div>
            <span className="badge badge-red">5 pendientes</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockChart}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="dia" tick={{fill:'var(--text4)',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'var(--text4)',fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="reportes" name="Reportes" fill="#EA580C" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <div className="flex-between" style={{marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14}}>Actividad reciente del sistema</div>
          <button className="btn btn-ghost" style={{fontSize:12}}>Ver todo →</button>
        </div>
        {[
          { icon:'👤', msg:'Nuevo usuario registrado: juan@gmail.com', time:'Hace 5 min',  color:'var(--green)' },
          { icon:'🔔', msg:'Alerta publicada: Desvío Ruta A – Centro',  time:'Hace 18 min', color:'var(--yellow)'},
          { icon:'📋', msg:'Reporte ciudadano recibido: Bus no llegó',  time:'Hace 32 min', color:'var(--orange)'},
          { icon:'🚌', msg:'Ruta B actualizada por admin municipal',    time:'Hace 1h',     color:'var(--blue)'  },
          { icon:'👥', msg:'Rol cambiado: carlos@test.co → conductor',  time:'Hace 2h',     color:'var(--purple)'},
        ].map((a, i) => (
          <div key={i} style={{
            display:'flex',alignItems:'center',gap:12,
            padding:'12px 0',
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
          }}>
            <div style={{
              width:36,height:36,borderRadius:10,
              background:'var(--bg3)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:18,flexShrink:0
            }}>{a.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:'var(--text2)'}}>{a.msg}</div>
            </div>
            <div style={{fontSize:11,color:'var(--text4)',flexShrink:0}}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
