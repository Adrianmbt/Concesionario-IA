import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, leads: 0, sellers: 0 })

  useEffect(() => {
    Promise.all([
      axios.get('/api/inventory/').catch(() => ({ data: [] })),
      axios.get('/api/leads/').catch(() => ({ data: [] })),
      axios.get('/api/sellers/').catch(() => ({ data: [] })),
    ]).then(([v, l, s]) => {
      setStats({ vehicles: v.data.length, leads: l.data.length, sellers: s.data.length })
    })
  }, [])

  const cards = [
    { label: 'Vehículos activos', value: stats.vehicles, color: 'text-blue-400' },
    { label: 'Leads generados', value: stats.leads, color: 'text-green-400' },
    { label: 'Vendedores', value: stats.sellers, color: 'text-purple-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map(c => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{c.label}</p>
            <p className={`text-4xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
