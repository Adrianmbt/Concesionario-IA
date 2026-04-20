import { useEffect, useState } from 'react'
import axios from 'axios'

const EMPTY = { nombre_completo: '', rol: 'vendedor', telefono: '' }

export default function Sellers() {
  const [sellers, setSellers] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = () => axios.get('/api/sellers/').then(r => setSellers(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await axios.post('/api/sellers/', form)
    setSaving(false)
    setForm(EMPTY)
    setShowForm(false)
    load()
  }

  const handleDelete = async (id) => {
    await axios.delete(`/api/sellers/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vendedores</h1>
        <button onClick={() => setShowForm(s => !s)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          {showForm ? 'Cancelar' : '+ Agregar vendedor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[['nombre_completo', 'Nombre completo'], ['telefono', 'Teléfono']].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-gray-400 mb-1 block">{label}</label>
              <input className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none"
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                required={key === 'nombre_completo'} />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Rol</label>
            <select className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
              value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sellers.map(s => (
          <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-start">
            <div>
              <p className="font-semibold">{s.nombre_completo}</p>
              <p className="text-gray-400 text-sm capitalize">{s.rol}</p>
              {s.telefono && <p className="text-gray-500 text-sm mt-1">{s.telefono}</p>}
            </div>
            <button onClick={() => handleDelete(s.id)}
              className="text-red-500 hover:text-red-400 text-sm transition-colors">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
