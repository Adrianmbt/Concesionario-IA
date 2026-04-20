import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const EMPTY = {
  tipo_vehiculo: 'auto', marca: '', modelo: '', ano: new Date().getFullYear(),
  precio: '', kilometraje: 0, combustible: 'gasolina', transmision: 'automatica',
  estado: 'nuevo', descripcion_comercial: '', imagen_url: '', disponible: true
}

export default function AdminInventory() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const fileRef = useRef()

  const load = () => axios.get('/api/inventory/').then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await axios.post('/api/images/upload', fd)
    setForm(f => ({ ...f, imagen_url: data.url }))
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await axios.post('/api/inventory/', { ...form, ano: +form.ano, precio: +form.precio })
    setSaving(false)
    setForm(EMPTY)
    setShowForm(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <button
          onClick={() => setShowForm(s => !s)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex gap-4 items-center">
            <select value={form.tipo_vehiculo} onChange={e => setForm(f => ({ ...f, tipo_vehiculo: e.target.value }))}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm">
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
              <option value="accesorio">Accesorio / Producto</option>
            </select>
          </div>
          {[
            ['marca', 'Marca'], ['modelo', 'Modelo'], ['ano', 'Año'], ['precio', 'Precio'],
            ['kilometraje', 'Kilometraje'], ['combustible', 'Combustible'], ['transmision', 'Transmisión'], ['estado', 'Estado']
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-gray-400 mb-1 block">{label}</label>
              <input
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none"
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                required={['marca', 'modelo', 'ano', 'precio'].includes(key)}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
            <textarea
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none"
              rows={3}
              value={form.descripcion_comercial}
              onChange={e => setForm(f => ({ ...f, descripcion_comercial: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Imagen</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <button type="button" onClick={() => fileRef.current.click()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              {uploading ? 'Subiendo...' : form.imagen_url ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {form.imagen_url && <img src={form.imagen_url} className="mt-2 h-24 rounded-lg object-cover" />}
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(v => (
          <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-36 bg-gray-800 flex items-center justify-center text-gray-600">
              {v.imagen_url
                ? <img src={v.imagen_url} className="w-full h-full object-cover" />
                : <span className="text-sm">Sin imagen</span>}
            </div>
            <div className="p-4">
              <p className="font-semibold">{v.marca} {v.modelo}</p>
              <p className="text-gray-400 text-sm">{v.ano} · {v.tipo_vehiculo}</p>
              <p className="text-blue-400 font-bold mt-1">${Number(v.precio).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
