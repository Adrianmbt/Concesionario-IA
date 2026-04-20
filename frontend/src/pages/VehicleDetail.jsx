import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function VehicleDetail() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)

  useEffect(() => {
    axios.get(`/api/inventory/${id}`).then(r => setVehicle(r.data))
  }, [id])

  if (!vehicle) return <p className="text-center mt-20 text-gray-400">Cargando...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {vehicle.imagen_url && (
        <img src={vehicle.imagen_url} alt={vehicle.modelo} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}
      <h1 className="text-3xl font-bold mb-2">{vehicle.marca} {vehicle.modelo}</h1>
      <p className="text-gray-400 mb-6">{vehicle.ano} · {vehicle.combustible} · {vehicle.transmision}</p>
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-3">
        <p><span className="text-gray-400">Precio:</span> <span className="text-blue-400 font-bold">${vehicle.precio?.toLocaleString()}</span></p>
        <p><span className="text-gray-400">Kilometraje:</span> {vehicle.kilometraje?.toLocaleString()} km</p>
        <p><span className="text-gray-400">Estado:</span> {vehicle.estado}</p>
        <p><span className="text-gray-400">Tipo:</span> {vehicle.tipo_vehiculo}</p>
        {vehicle.descripcion_comercial && (
          <p className="text-gray-300 mt-4">{vehicle.descripcion_comercial}</p>
        )}
      </div>
    </div>
  )
}
