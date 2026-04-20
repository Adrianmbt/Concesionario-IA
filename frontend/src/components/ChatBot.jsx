import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const SESSION_ID = crypto.randomUUID()

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy tu asistente. ¿En qué auto estás interesado?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const { data } = await axios.post('/api/chat/', {
        session_id: SESSION_ID,
        message: userMsg
      })
      setMessages(prev => [...prev, { role: 'bot', text: data.response }])
      if (data.hot_lead) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: '¿Te gustaría que un asesor te contacte para más información?'
        }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error al conectar. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Asistente AutoPrime</span>
            <button onClick={() => setOpen(false)} className="text-white text-lg leading-none">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-xl max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-blue-600 ml-auto text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="text-gray-500 text-xs">Escribiendo...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        aria-label="Abrir chat"
      >
        💬
      </button>
    </div>
  )
}
