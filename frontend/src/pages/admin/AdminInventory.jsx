import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'

const EMPTY = {
  tipo_vehiculo: 'auto', marca: '', modelo: '', ano: new Date().getFullYear(),
  precio: '', kilometraje: 0, combustible: 'gasolina', transmision: 'automatica',
  estado: 'nuevo', descripcion_comercial: '', imagen_url: '', disponible: true
}

// SweetAlert2 Premium Config
const PremiumSwal = Swal.mixin({
  background: '#0c0c0c',
  color: '#fff',
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#ef4444',
  customClass: {
    popup: 'rounded-2xl border border-white/10 shadow-2xl',
    title: 'text-xl font-black font-heading tracking-tight',
    confirmButton: 'px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest',
    cancelButton: 'px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest'
  }
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#0c0c0c',
  color: '#fff'
})

export default function AdminInventory() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todos')
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const fileRef = useRef()

  const load = () => axios.get('/api/inventory/').then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const handleGenerateAI = async () => {
    if (!form.marca || !form.modelo) {
      Toast.fire({ icon: 'warning', title: 'Introduce Marca y Modelo' })
      return
    }
    setGenerating(true)
    try {
      const { data } = await axios.post('/api/inventory/generate-description', form)
      setForm(f => ({ ...f, descripcion_comercial: data.description }))
      Toast.fire({ icon: 'success', title: 'Descripción generada' })
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error con la IA'
      PremiumSwal.fire({ icon: 'error', title: 'Incoherencia', text: msg })
    }
    setGenerating(false)
  }

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await axios.post('/api/images/upload', fd)
      setForm(f => ({ ...f, imagen_url: data.url }))
      Toast.fire({ icon: 'success', title: 'Imagen lista' })
    } catch (err) {
      PremiumSwal.fire({ icon: 'error', title: 'Error', text: 'Error subiendo imagen' })
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, ano: +form.ano, precio: +form.precio, kilometraje: +form.kilometraje }
    try {
      if (editingId) {
        await axios.put(`/api/inventory/${editingId}`, payload)
        Toast.fire({ icon: 'success', title: 'Actualizado' })
      } else {
        await axios.post('/api/inventory/', payload)
        Toast.fire({ icon: 'success', title: 'Registrado' })
      }
      setForm(EMPTY)
      setShowForm(false)
      setEditingId(null)
      load()
    } catch (err) {
      PremiumSwal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar' })
    }
    setSaving(false)
  }

  const handleEdit = (v) => {
    setForm(v)
    setEditingId(v.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    const res = await PremiumSwal.fire({
      title: '¿Confirmar eliminación?',
      text: "Se borrará permanentemente del stock",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    })
    if (res.isConfirmed) {
      await axios.delete(`/api/inventory/${id}`)
      Toast.fire({ icon: 'success', title: 'Eliminado' })
      load()
    }
  }

  // Lógica de Filtrado Combinada
  const filtered = items.filter(v => {
    const matchesSearch = `${v.marca} ${v.modelo}`.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'todos' || v.tipo_vehiculo === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-8">
      {/* Header Premium */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pt-8">
        <div>
          <h1 className="text-3xl font-black text-white font-heading tracking-tight mb-2">Gestión de Inventario</h1>
          <p className="text-gray-400 text-sm font-medium">Control total sobre el stock de vehículos y accesorios.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
            <input 
              placeholder="Buscar por marca o modelo..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-[#121212] border border-white/5 text-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 w-full md:w-80 transition-all shadow-lg"
            />
          </div>

          <button
            onClick={() => { setShowForm(!showForm); if(showForm) {setEditingId(null); setForm(EMPTY);} }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl w-full sm:w-auto ${showForm ? 'bg-white/10 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Registro'}
          </button>
        </div>
      </div>

      {/* Formulario (Mismo diseño premium anterior) */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-12">
             <form onSubmit={handleSubmit} className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-8 shadow-2xl relative">
                <div className="absolute top-6 right-6">
                   <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">
                     {editingId ? 'Editando ID: ' + editingId.slice(0,8) : 'Nuevo Ingreso'}
                   </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {/* Col 1 */}
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Información Base</h3>
                      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                        {['auto', 'moto', 'accesorio'].map(t => (
                          <button 
                            key={t} type="button" onClick={() => setForm({...form, tipo_vehiculo: t})}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${form.tipo_vehiculo === t ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Marca</label>
                        <input className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} required />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Modelo</label>
                        <input className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} required />
                      </div>
                   </div>

                   {/* Col 2 */}
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Especificaciones</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Año</label>
                          <input type="number" className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-sm" value={form.ano} onChange={e => setForm({...form, ano: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Precio ($)</label>
                          <input type="number" className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-sm" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Kilometraje</label>
                          <input type="number" className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-sm" value={form.kilometraje} onChange={e => setForm({...form, kilometraje: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Transmisión</label>
                          <select className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none" value={form.transmision} onChange={e => setForm({...form, transmision: e.target.value})}>
                            <option value="automatica">Automática</option>
                            <option value="manual">Sincrónica</option>
                          </select>
                        </div>
                      </div>
                   </div>

                   {/* Col 3 */}
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Presentación</h3>
                      <div 
                        onClick={() => fileRef.current.click()}
                        className="cursor-pointer aspect-video bg-white/5 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center hover:bg-white/[0.08] transition-all overflow-hidden relative group"
                      >
                        {form.imagen_url ? (
                          <img src={form.imagen_url} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{uploading ? 'Cargando...' : '📷 Subir Foto'}</span>
                        )}
                        <input ref={fileRef} type="file" className="hidden" onChange={handleImage} />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase">Descripción Comercial</label>
                           <button type="button" onClick={handleGenerateAI} disabled={generating} className="text-[10px] font-black text-blue-500 hover:text-blue-400">
                             {generating ? '✨ ESCRIBIENDO...' : '✨ USAR IA'}
                           </button>
                        </div>
                        <textarea className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-xs outline-none h-24 resize-none" value={form.descripcion_comercial} onChange={e => setForm({...form, descripcion_comercial: e.target.value})} />
                      </div>
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div onClick={() => setForm({...form, disponible: !form.disponible})} className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${form.disponible ? 'bg-blue-600' : 'bg-gray-700'}`}>
                         <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.disponible ? 'left-6' : 'left-1'}`} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponible para el público</span>
                   </div>
                   <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all disabled:opacity-50 shadow-2xl">
                     {saving ? 'Guardando...' : editingId ? 'Actualizar Registro' : 'Confirmar Stock'}
                   </button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros de Categoría (Datatable Style) */}
      <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
         {['todos', 'auto', 'moto', 'accesorio'].map(cat => (
           <button 
             key={cat} onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
             className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white bg-white/5'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* DataTable Premium */}
      <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Vehículo</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">Año / Tipo</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest hidden lg:table-cell">Combustible</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Precio</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0">
                        {item.imagen_url ? (
                          <img src={item.imagen_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🚗</div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{item.marca}</p>
                        <p className="text-white font-bold">{item.modelo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-gray-300 text-xs font-bold">{item.ano}</p>
                    <p className="text-gray-600 text-[9px] uppercase font-black">{item.tipo_vehiculo}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black text-gray-400 border border-white/5 uppercase">
                      {item.combustible}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-black text-sm font-heading">${Number(item.precio).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${item.disponible ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                       <span className={`text-[10px] font-black uppercase ${item.disponible ? 'text-gray-400' : 'text-red-500'}`}>
                         {item.disponible ? 'En Stock' : 'Agotado'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <span className="text-4xl mb-4 block">📦</span>
              <h3 className="text-white font-black uppercase text-xs tracking-widest">Sin resultados</h3>
              <p className="text-gray-500 text-[10px] mt-2">Prueba ajustando los filtros o añade un nuevo ítem.</p>
            </div>
          )}
        </div>

        {/* Paginación Premium */}
        {filtered.length > itemsPerPage && (
          <div className="px-6 py-5 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filtered.length)} de {filtered.length} productos
            </p>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-[10px] font-black uppercase hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-[10px] font-black uppercase hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
