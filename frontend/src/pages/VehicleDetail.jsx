import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { usePageView } from '../hooks/usePageView'
import RatingWidget from '../components/RatingWidget'

export default function VehicleDetail() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  usePageView('vehicle_detail', id)

  useEffect(() => {
    axios.get(`/api/inventory/${id}`).then(r => setVehicle(r.data))
  }, [id])

  if (!vehicle) return <p className="text-center mt-20 text-gray-400">Cargando...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {vehicle.imagen_url && (
        <img src={vehicle.imagen_url} alt={vehicle.modelo} className="w-full h-72 object-cover rounded-2xl" />
      )}
      <div>
        <h1 className="text-3xl font-bold mb-1">{vehicle.marca} {vehicle.modelo}</h1>
        <p className="text-gray-400">{vehicle.ano} · {vehicle.combustible} · {vehicle.transmision}</p>
      </div>
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-3">
        <p><span className="text-gray-400">Precio:</span> <span className="text-blue-400 font-black text-xl">${Number(vehicle.precio).toLocaleString()}</span></p>
        <p><span className="text-gray-400">Kilometraje:</span> {vehicle.kilometraje?.toLocaleString()} km</p>
        <p><span className="text-gray-400">Estado:</span> {vehicle.estado}</p>
        <p><span className="text-gray-400">Tipo:</span> {vehicle.tipo_vehiculo}</p>
        {vehicle.descripcion_comercial && <p className="text-gray-300 mt-2">{vehicle.descripcion_comercial}</p>}
      </div>
      <RatingWidget vehicleId={id} />
    </div>
  )
}
