import { useState } from 'react'
import axios from 'axios'
import { SESSION_ID } from '../hooks/usePageView'

export default function RatingWidget({ vehicleId, tipo = 'producto', label = '¿Cómo calificarías este vehículo?' }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const submit = async () => {
    if (!rating) return
    setSending(true)
    await axios.post('/api/analytics/valoracion', {
      vehicle_id: vehicleId,
      tipo,
      rating,
      comentario,
      session_id: SESSION_ID,
    }).catch(() => {})
    setSent(true)
    setSending(false)
  }

  if (sent) return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
      <p className="text-2xl mb-2">🙏</p>
      <p className="font-semibold">¡Gracias por tu valoración!</p>
      <p className="text-gray-400 text-sm mt-1">Tu opinión nos ayuda a mejorar.</p>
    </div>
  )

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <p className="font-semibold mb-4">{label}</p>
      <div className="flex gap-2 mb-4">
        {[1,2,3,4,5].map(s => (
          <button key={s}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(s)}
            className={`text-3xl transition-transform hover:scale-110 ${s <= (hover || rating) ? 'text-yellow-400' : 'text-gray-700'}`}>
            ★
          </button>
        ))}
      </div>
      {rating > 0 && (
        <>
          <textarea
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none mb-3"
            rows={2}
            placeholder="Comentario opcional..."
            value={comentario}
            onChange={e => setComentario(e.target.value)}
          />
          <button onClick={submit} disabled={sending}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
            {sending ? 'Enviando...' : 'Enviar valoración'}
          </button>
        </>
      )}
    </div>
  )
}
