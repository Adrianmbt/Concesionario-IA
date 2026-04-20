import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import axios from 'axios'

const BRANDS = [
  'Toyota','Honda','Ford','Chevrolet','BMW','Mercedes-Benz',
  'Audi','Volkswagen','Hyundai','Kia','Nissan','Mazda',
  'Yamaha','Suzuki','Kawasaki','Ducati'
]

const CATEGORIES = [
  { key: 'auto', label: '🚗 Autos' },
  { key: 'moto', label: '🏍️ Motos' },
  { key: 'accesorio', label: '🔧 Accesorios' },
]

const WHY = [
  { icon: '🛡️', title: 'Calidad garantizada', desc: 'Inspección mecánica de 150 puntos y garantía de hasta 24 meses en cada vehículo.' },
  { icon: '💳', title: 'Financiamiento flexible', desc: 'Aprobación en 24 horas, cuotas a tu medida y planes sin entrada para clientes calificados.' },
  { icon: '🎧', title: 'Atención dedicada', desc: 'Asesores especializados que te acompañan antes, durante y después de tu compra.' },
  { icon: '🔧', title: 'Servicio técnico', desc: 'Taller propio con técnicos certificados para mantenimiento y reparaciones.' },
  { icon: '📋', title: 'Trámites incluidos', desc: 'Nos encargamos de toda la documentación, traspaso y registro por ti.' },
  { icon: '🚗', title: 'Test drive gratis', desc: 'Prueba el vehículo que te interesa sin compromiso, a tu ritmo.' },
]

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

function Section({ children, className = '' }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [vehicles, setVehicles] = useState([])
  const [tab, setTab] = useState('auto')
  const inventoryRef = useRef()

  useEffect(() => {
    axios.get('/api/inventory/').then(r => setVehicles(r.data)).catch(() => {})
  }, [])

  const filtered = vehicles.filter(v => v.tipo_vehiculo === tab)

  return (
    <div className="bg-gray-950 text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80&auto=format&fit=crop"
            alt="hero"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/70 to-gray-950" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Inventario actualizado
          </motion.span>

          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
            Conduce el vehículo<br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              que mereces
            </span>
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Autos, motos y accesorios premium. Financiamiento ágil, garantía mecánica y atención personalizada en cada paso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => inventoryRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              Ver vehículos <span>↓</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector('[aria-label="Abrir chat"]')?.click()}
              className="border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
            >
              Hablar con asesor
            </motion.button>
          </div>

          <div className="flex gap-10 justify-center">
            {[['150+', 'Vehículos'], ['12', 'Años de experiencia'], ['500+', 'Clientes satisfechos']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-black text-blue-400">{n}</p>
                <p className="text-gray-500 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-blue-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* MARCAS */}
      <section className="py-10 border-y border-gray-800/60 bg-gray-900/30 overflow-hidden">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-6">Marcas disponibles</p>
        <div className="relative">
          <div className="flex gap-12 items-center" style={{ animation: 'marquee 25s linear infinite', width: 'max-content' }}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="text-gray-400 font-semibold text-sm hover:text-white transition-colors whitespace-nowrap px-2">{b}</span>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </section>

      {/* INVENTARIO */}
      <section ref={inventoryRef} className="max-w-7xl mx-auto px-4 py-24">
        <Section>
          <motion.p variants={fadeUp} className="text-blue-500 text-xs uppercase tracking-widest mb-2">Inventario destacado</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black mb-3">Disponible ahora</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-10 max-w-xl">Cada unidad pasa por una inspección de 150 puntos antes de llegar a nuestro showroom.</motion.p>

          <motion.div variants={fadeUp} className="flex gap-2 mb-10">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setTab(c.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === c.key ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'}`}>
                {c.label}
              </button>
            ))}
          </motion.div>
        </Section>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <p className="text-6xl mb-4">{tab === 'auto' ? '🚗' : tab === 'moto' ? '🏍️' : '🔧'}</p>
            <p className="text-lg">Próximamente nuevas unidades disponibles</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => (
              <motion.div key={v.id} variants={fadeUp}>
                <Link to={`/autos/${v.id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/60 transition-all hover:shadow-xl hover:shadow-blue-600/10 group">
                  <div className="h-52 bg-gray-800 overflow-hidden relative">
                    {v.imagen_url
                      ? <img src={v.imagen_url} alt={v.modelo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl text-gray-700">
                          {tab === 'moto' ? '🏍️' : tab === 'accesorio' ? '🔧' : '🚗'}
                        </div>
                    }
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium">{v.ano}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{v.marca}</p>
                    <h3 className="font-bold text-lg mb-3">{v.modelo}</h3>
                    <div className="flex flex-wrap gap-2 text-gray-500 text-xs mb-4">
                      {v.kilometraje > 0 && <span className="bg-gray-800 px-2 py-1 rounded-lg">🔄 {v.kilometraje?.toLocaleString()} km</span>}
                      {v.combustible && <span className="bg-gray-800 px-2 py-1 rounded-lg">⛽ {v.combustible}</span>}
                      {v.transmision && <span className="bg-gray-800 px-2 py-1 rounded-lg">⚙️ {v.transmision}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-400 font-black text-xl">${Number(v.precio).toLocaleString()}</p>
                      <span className="text-blue-400 text-sm group-hover:translate-x-1 transition-transform">Ver detalles →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=60&auto=format&fit=crop"
            alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/90 to-gray-950" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <Section>
            <motion.p variants={fadeUp} className="text-blue-500 text-xs uppercase tracking-widest text-center mb-2">Por qué elegirnos</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-center mb-4">Una experiencia sin compromisos</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-center mb-14 max-w-xl mx-auto">Más de 12 años entregando vehículos de calidad con el respaldo que mereces.</motion.p>
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY.map(w => (
                <motion.div key={w.title} variants={fadeUp}
                  className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-gray-900 transition-all group">
                  <span className="text-3xl mb-4 block">{w.icon}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{w.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <Section>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black mb-4">¿Listo para encontrar<br />tu vehículo?</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-8 text-lg">Habla con uno de nuestros asesores ahora mismo. Sin compromiso.</motion.p>
          <motion.button variants={fadeUp}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('[aria-label="Abrir chat"]')?.click()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-blue-600/30">
            Iniciar conversación
          </motion.button>
        </Section>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <p className="font-black text-2xl mb-3">AUTO<span className="text-blue-500">PRIME</span></p>
            <p className="text-gray-400 text-sm leading-relaxed">Tu concesionario de confianza. Autos, motos y accesorios con la mejor calidad y servicio desde 2012.</p>
          </div>
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Contacto</p>
            <div className="space-y-2.5 text-gray-400 text-sm">
              <p>📍 Av. Principal #123, Ciudad</p>
              <p>📞 +1 (555) 000-0000</p>
              <p>✉️ info@autoprime.com</p>
              <p>🕐 Lun–Sáb: 8am – 6pm</p>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Categorías</p>
            <div className="space-y-2.5 text-gray-400 text-sm">
              {['Automóviles', 'Motocicletas', 'Accesorios', 'Financiamiento', 'Servicio técnico'].map(c => (
                <p key={c} className="hover:text-white cursor-pointer transition-colors">{c}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Síguenos</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Facebook', '📘'], ['Instagram', '📸'], ['WhatsApp', '💬'], ['TikTok', '🎵']].map(([name, icon]) => (
                <button key={name}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-all">
                  <span>{icon}</span> {name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-600 text-sm">
          © 2026 AutoPrime · Concesionario de vehículos premium · Todos los derechos reservados
        </div>
      </footer>

    </div>
  )
}
