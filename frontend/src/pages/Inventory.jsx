import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Inventory() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/inventory/')
      .then(r => setVehicles(r.data))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center mt-20 text-gray-400">Cargando...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Inventario</h1>
      {vehicles.length === 0 ? (
        <p className="text-gray-400">No hay vehículos disponibles aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <Link
              key={v.id}
              to={`/autos/${v.id}`}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-colors"
            >
              <div className="h-48 bg-gray-800 flex items-center justify-center text-gray-600">
                {v.imagen_url
                  ? <img src={v.imagen_url} alt={v.modelo} className="w-full h-full object-cover" />
                  : <span>Sin imagen</span>
                }
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg">{v.marca} {v.modelo}</h2>
                <p className="text-gray-400 text-sm">{v.ano} · {v.combustible}</p>
                <p className="text-blue-400 font-bold mt-2">${v.precio?.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
