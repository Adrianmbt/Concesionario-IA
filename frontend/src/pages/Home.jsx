import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import axios from 'axios'

const BRANDS = [
  { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Toyota_logo_%282020%29.svg' },
  { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg' },
  { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
  { name: 'Chevrolet', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Chevrolet-logo.png' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
  { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo_2010.svg' },
  { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
  { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
  { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
  { name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/KIA_logo_2021.svg' },
  { name: 'Nissan', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Nissan_2020_logo.svg' },
  { name: 'Mazda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mazda_logo_2015_to_2018.svg' },
  { name: 'Yamaha', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Yamaha_Motor_Logo.svg' },
  { name: 'Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg' },
  { name: 'Kawasaki', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Kawasaki-logo.svg' },
  { name: 'Ducati', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Ducati_red_logo.svg' }
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

function Counter({ end, duration = 2, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView && end > 0) {
      let start = 0
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.ceil(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [inView, end, duration])

  return <span ref={ref}>{prefix}{end > 0 ? count : end}{suffix}</span>
}

const CATEGORY_CARDS = [
  {
    key: 'auto',
    title: 'Autos de Élite',
    phrase: 'Colección Exclusiva',
    description: 'Siente el poder de la ingeniería alemana y el diseño vanguardista en cada curva. Desde sedanes de lujo hasta deportivos de alto rendimiento.',
    img1: '/CardImg/carro1.png',
    img2: '/CardImg/carro2.png',
    link: '/inventario?tipo=auto'
  },
  {
    key: 'moto',
    title: 'Espíritu de Libertad',
    phrase: 'Adrenalina en Dos Ruedas',
    description: 'Domina el asfalto con la agilidad y potencia de nuestras máquinas. Modelos exclusivos de alto cilindraje y diseño ergonómico.',
    img1: '/CardImg/moto1.png',
    img2: '/CardImg/moto2.png',
    link: '/inventario?tipo=moto'
  },
  {
    key: 'accesorio',
    title: 'Toque de Distinción',
    phrase: 'Personalización Premium',
    description: 'Equipa tu pasión con tecnología de punta. Detalles exclusivos para potenciar el rendimiento y la estética original de tu vehículo.',
    img1: '/CardImg/accse1.png',
    img2: '/CardImg/accse2.png',
    link: '/inventario?tipo=accesorio'
  }
]

function CategoryCard({ item }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <motion.div variants={fadeUp}>
      <Link 
        to={item.link}
        className="group relative h-[550px] rounded-3xl overflow-hidden border border-white/10 bg-[#050505] flex flex-col transition-all duration-500 hover:border-blue-500/50 block shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Images with Cross-fade */}
        <div className="absolute inset-0">
          <img 
            src={item.img1} 
            alt={item.title} 
            className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-50'}`}
          />
          <img 
            src={item.img2} 
            alt={`${item.title} detalle`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isHovered ? 'opacity-60' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Content Layer */}
        <div className="relative h-full p-8 md:p-10 flex flex-col justify-end z-10">
          <motion.p 
            animate={{ y: isHovered ? -5 : 0 }}
            className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-3 transition-colors group-hover:text-blue-400"
          >
            {item.phrase}
          </motion.p>
          <motion.h3 
            animate={{ y: isHovered ? -5 : 0 }}
            className="text-3xl md:text-4xl font-heading font-black text-white mb-5 tracking-tight"
          >
            {item.title}
          </motion.h3>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-white font-bold text-sm group-hover:gap-5 transition-all duration-300">
             EXPLORAR STOCK <span className="text-2xl text-blue-500">→</span>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
      </Link>
    </motion.div>
  )
}

export default function Home() {
  const [vehicles, setVehicles] = useState([])
  const [tab, setTab] = useState('auto')
  const inventoryRef = useRef()

  // SEO Optimization & Meta Tags
  useEffect(() => {
    document.title = "AutoPrime | Excelencia automotriz a tu alcance"
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = "description"
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = "Vehículos premium seleccionados. Encuentra tu próximo destino sobre ruedas con AutoPrime. Financiamiento flexible, garantía asegurada y la mejor asesoría."
  }, [])

  useEffect(() => {
    axios.get('/api/inventory/').then(r => setVehicles(r.data)).catch(() => {})
  }, [])

  const filtered = vehicles.filter(v => v.tipo_vehiculo === tab)

  return (
    <div className="bg-[#000000] text-gray-200 overflow-x-hidden font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&family=Outfit:wght@300;400;500;700&display=swap');
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      {/* HERO */}
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
        {/* Background image & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80&auto=format&fit=crop"
            alt="Fondo de concesionario con un Chevrolet Camaro"
            className="w-full h-full object-cover opacity-30"
          />
          {/* Radial Gradient for focus effect, fading out the edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_80%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        <motion.div
          className="relative z-10 max-w-5xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-xs px-5 py-2 rounded-full mb-8 uppercase tracking-widest backdrop-blur-md font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
            Inventario premium actualizado
          </motion.span>

          {/* Heading - H1 for SEO */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight font-heading text-white">
            Excelencia automotriz <br />
            <span className="bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-transparent">
              a tu alcance
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Tu próximo destino comienza al volante. Colección curada de autos y motos con los más altos estándares de calidad, diseño y financiamiento a tu medida.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
            {/* CTA Principal con resplandor */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => inventoryRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2 border border-blue-500/30"
            >
              Ver vehículos <span>↓</span>
            </motion.button>
            {/* Glassmorphism en botón secundario */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector('[aria-label="Abrir chat"]')?.click()}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all backdrop-blur-[10px]"
            >
              <span className="text-xl">💬</span> Hablar con asesor
            </motion.button>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-col sm:flex-row gap-10 justify-center items-center border-t border-white/10 pt-10">
            <div className="text-center px-4 w-40">
              <span className="text-2xl mb-2 block text-gray-400">🚘</span>
              <p className="text-3xl font-heading font-black text-white">
                <Counter end={150} suffix="+" />
              </p>
              <p className="text-gray-400 text-[11px] mt-1.5 uppercase tracking-wider font-semibold">Vehículos</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/10"></div>
            <div className="text-center px-4 w-40">
              <span className="text-2xl mb-2 block text-gray-400">🏆</span>
              <p className="text-3xl font-heading font-black text-white">
                <Counter end={2014} />
              </p>
              <p className="text-gray-400 text-[11px] mt-1.5 uppercase tracking-wider font-semibold">Líderes desde</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/10"></div>
            <div className="text-center px-4 w-40">
              <span className="text-2xl mb-2 block text-gray-400">⭐</span>
              <p className="text-3xl font-heading font-black text-white">
               <Counter end={500} suffix="+" />
              </p>
              <p className="text-gray-400 text-[11px] mt-1.5 uppercase tracking-wider font-semibold">Clientes Felices</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* MARCAS - Seamless Scroll with Logos */}
      <section className="py-8 bg-black border-y border-white/5 overflow-hidden">
        <h2 className="sr-only">Marcas Aliadas</h2>
        <p className="text-center text-gray-500 text-[9px] uppercase tracking-[0.4em] mb-8 font-bold opacity-80">Nuestras Marcas Distinguidas</p>
        <div className="relative flex overflow-x-hidden group">
          {/* First set of logos */}
          <div className="py-2 animate-marquee whitespace-nowrap flex items-center gap-12 shrink-0">
            {BRANDS.map((b, i) => (
              <img 
                key={`set1-${i}`} 
                src={b.logo} 
                alt={b.name} 
                className="h-6 md:h-7 lg:h-8 w-auto object-contain opacity-30 hover:opacity-100 transition-all duration-500 filter grayscale brightness-200 invert hover:scale-110"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))}
          </div>
          {/* Duplicated set for seamless loop */}
          <div className="py-2 animate-marquee whitespace-nowrap flex items-center gap-12 shrink-0 ml-12">
            {BRANDS.map((b, i) => (
              <img 
                key={`set2-${i}`} 
                src={b.logo} 
                alt={b.name} 
                className="h-6 md:h-7 lg:h-8 w-auto object-contain opacity-30 hover:opacity-100 transition-all duration-500 filter grayscale brightness-200 invert hover:scale-110"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))}
          </div>
        </div>
        <style>{`
          .animate-marquee { animation: marquee 30s linear infinite; }
          .group:hover .animate-marquee { animation-play-state: paused; }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        `}</style>
      </section>

      {/* INVENTARIO CATEGORIES DINÁMICO */}
      <section ref={inventoryRef} className="max-w-7xl mx-auto px-4 py-32">
        <header className="mb-20 text-center">
          <Section>
            <motion.p variants={fadeUp} className="text-blue-500 font-medium text-xs uppercase tracking-widest mb-3">Navega por Categoría</motion.p>
            <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl font-black mb-6 font-heading text-white tracking-tight">Catálogo Premium</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Descubre nuestra selección curada de vehículos y accesorios. Cada categoría ha sido diseñada para ofrecerte lo mejor en rendimiento, seguridad y estilo.
            </motion.p>
          </Section>
        </header>

        <Section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORY_CARDS.map(item => (
            <CategoryCard key={item.key} item={item} />
          ))}
        </Section>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="relative py-32 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <Section>
            <motion.p variants={fadeUp} className="text-blue-500 font-medium text-xs uppercase tracking-widest text-center mb-3">Ventaja Competitiva</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black font-heading text-center mb-5 text-white">Una experiencia sin compromisos</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-center mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
              Sabemos lo importante que es esta decisión. Te ofrecemos herramientas, garantías y el respaldo necesario para que compres de manera inteligente.
            </motion.p>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY.map((w) => (
                <motion.div key={w.title} variants={fadeUp}
                  className="bg-[#050505] border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300"></div>
                  <span className="text-4xl mb-6 block drop-shadow-md">{w.icon}</span>
                  <h3 className="font-heading font-bold text-xl mb-3 text-gray-100">{w.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-32 px-4 text-center relative border-t border-white/10 bg-[#020202]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
        <Section className="relative z-10">
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-6xl font-black mb-6 font-heading text-white">
            ¿Listo para dar <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">el siguiente paso?</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
            Nuestros expertos automotrices están disponibles para guiarte en todo momento, sin compromisos. 
          </motion.p>
          <motion.button variants={fadeUp}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('[aria-label="Abrir chat"]')?.click()}
            className="bg-white text-black px-12 py-5 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
            Contactar Asesor Ahora
          </motion.button>
        </Section>
      </section>

      {/* FOOTER - Lujoso y minimalista */}
      <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:pr-8">
            <p className="font-black text-3xl font-heading tracking-tight mb-4 text-white">AUTO<span className="text-blue-500">PRIME</span></p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Redefiniendo la forma de adquirir vehículos premium. Selección estricta, servicio excepcional y financiamiento a tu medida.</p>
          </div>
          
          <div>
            <p className="font-heading font-bold mb-6 text-sm uppercase tracking-widest text-gray-200">Encuéntranos</p>
            <address className="not-italic space-y-4 text-gray-400 text-sm">
              <p className="flex items-start gap-3"><span className="text-lg">📍</span> <span>Av. Principal #123,<br/>Distrito Premium, Ciudad</span></p>
              <p className="flex items-center gap-3"><span className="text-lg">📞</span> +1 (555) 000-0000</p>
              <p className="flex items-center gap-3"><span className="text-lg">✉️</span> contacto@autoprime.com</p>
            </address>
          </div>
          
          <div>
            <p className="font-heading font-bold mb-6 text-sm uppercase tracking-widest text-gray-200">Servicios</p>
            <div className="space-y-3 text-gray-400 text-sm">
              {['Catálogo de Autos', 'Motos Exclusivas', 'Financiamiento Especial', 'Garantía Extendida', 'Vende tu vehículo'].map(c => (
                <p key={c} className="hover:text-blue-400 cursor-pointer transition-colors w-max">{c}</p>
              ))}
            </div>
          </div>
          
          <div>
            <p className="font-heading font-bold mb-6 text-sm uppercase tracking-widest text-gray-200">Redes</p>
            <div className="flex flex-wrap gap-3">
              {[['Facebook', 'FB'], ['Instagram', 'IG'], ['LinkedIn', 'IN'], ['YouTube', 'YT']].map(([name, icon]) => (
                <button key={name} title={`Visitar ${name}`}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:border-blue-500 hover:text-blue-400 rounded-full text-sm text-gray-300 transition-all">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs font-medium">
          <p>© {new Date().getFullYear()} AutoPrime Motors. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Términos de servicio</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Políticas de privacidad</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
