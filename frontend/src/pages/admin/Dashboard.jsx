import { useEffect, useState } from 'react'
import axios from 'axios'

const StatCard = ({ label, value, sub, color = 'text-blue-400', icon }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <p className="text-gray-400 text-sm">{label}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className={`text-4xl font-black ${color}`}>{value ?? '—'}</p>
    {sub && <p className="text-gray-500 text-xs">{sub}</p>}
  </div>
)

const RatingBar = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-gray-400 text-sm w-36 shrink-0">{label}</span>
    <div className="flex-1 bg-gray-800 rounded-full h-2">
      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(value / 5) * 100}%` }} />
    </div>
    <span className="text-white font-bold text-sm w-8 text-right">{value > 0 ? `${value}★` : '—'}</span>
  </div>
)

const StarRating = ({ value }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={s <= value ? 'text-yellow-400' : 'text-gray-700'}>★</span>
    ))}
  </div>
)

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [topProductos, setTopProductos] = useState([])
  const [valoraciones, setValoraciones] = useState(null)
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/analytics/summary').catch(() => ({ data: null })),
      axios.get('/api/analytics/top-productos').catch(() => ({ data: [] })),
      axios.get('/api/analytics/valoraciones').catch(() => ({ data: null })),
      axios.get('/api/analytics/ventas-recientes').catch(() => ({ data: [] })),
    ]).then(([s, t, v, vt]) => {
      setSummary(s.data)
      setTopProductos(t.data || [])
      setValoraciones(v.data)
      setVentas(vt.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Cargando dashboard...
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen del negocio en tiempo real</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🚗" label="Vehículos activos" value={summary?.vehiculos_activos} color="text-blue-400" />
        <StatCard icon="🔥" label="Leads hoy" value={summary?.leads_hoy} sub={`${summary?.leads_semana ?? 0} esta semana`} color="text-orange-400" />
        <StatCard icon="👁️" label="Visitas semana" value={summary?.visitas_semana} color="text-purple-400" />
        <StatCard icon="💰" label="Ingresos del mes" value={summary?.ingreso_mes ? `$${Number(summary.ingreso_mes).toLocaleString()}` : '$0'} sub={`${summary?.ventas_mes ?? 0} ventas cerradas`} color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top productos */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-1">🏆 Productos estrella</h2>
          <p className="text-gray-500 text-xs mb-5">Top 5 por valoración y ventas</p>
          {topProductos.length === 0 ? (
            <p className="text-gray-600 text-sm py-8 text-center">Sin datos aún — agrega vehículos y valoraciones</p>
          ) : (
            <div className="space-y-3">
              {topProductos.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-xl">
                  <span className="text-2xl font-black text-gray-600 w-6">#{i + 1}</span>
                  {p.imagen_url
                    ? <img src={p.imagen_url} className="w-12 h-12 rounded-lg object-cover" />
                    : <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-xl">🚗</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{p.marca} {p.modelo}</p>
                    <p className="text-gray-500 text-xs">{p.ano} · {p.total_ventas} ventas</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-yellow-400 font-bold text-sm">{p.rating_promedio > 0 ? `${p.rating_promedio}★` : '—'}</p>
                    <p className="text-gray-500 text-xs">{p.total_valoraciones} reseñas</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Valoraciones */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-1">⭐ Satisfacción general</h2>
          <p className="text-gray-500 text-xs mb-6">Promedio de valoraciones por categoría</p>
          <div className="space-y-4 mb-6">
            <RatingBar label="Productos / Vehículos" value={valoraciones?.promedio_producto ?? 0} />
            <RatingBar label="Asistente IA" value={valoraciones?.promedio_ia ?? 0} />
            <RatingBar label="Atención vendedores" value={valoraciones?.promedio_vendedor ?? 0} />
          </div>
          <h3 className="font-semibold text-sm text-gray-300 mb-3">Últimas reseñas</h3>
          {!valoraciones?.recientes?.length ? (
            <p className="text-gray-600 text-sm text-center py-4">Sin reseñas aún</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {valoraciones.recientes.map(v => (
                <div key={v.id} className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <StarRating value={v.rating} />
                    <span className="text-gray-500 text-xs capitalize">{v.tipo?.replace('_', ' ')}</span>
                  </div>
                  {v.comentario && <p className="text-gray-400 text-xs">{v.comentario}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ventas recientes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-bold text-lg mb-1">💼 Ventas recientes</h2>
          <p className="text-gray-500 text-xs mb-5">Últimas transacciones cerradas</p>
          {ventas.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">Sin ventas registradas aún</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                    <th className="text-left pb-3">Vehículo</th>
                    <th className="text-left pb-3">Cliente</th>
                    <th className="text-left pb-3">Vendedor</th>
                    <th className="text-left pb-3">Origen</th>
                    <th className="text-right pb-3">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {ventas.map(v => (
                    <tr key={v.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 font-medium">{v.vehiculos ? `${v.vehiculos.marca} ${v.vehiculos.modelo}` : '—'}</td>
                      <td className="py-3 text-gray-400">{v.cliente_nombre || '—'}</td>
                      <td className="py-3 text-gray-400">{v.perfiles?.nombre_completo || '—'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${v.origen === 'chatbot' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                          {v.origen}
                        </span>
                      </td>
                      <td className="py-3 text-right text-green-400 font-bold">${Number(v.precio_final).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
