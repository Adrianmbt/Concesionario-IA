import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import VehicleDetail from './pages/VehicleDetail'
import ChatBot from './components/ChatBot'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminInventory from './pages/admin/AdminInventory'
import Sellers from './pages/admin/Sellers'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<AdminInventory />} />
          <Route path="vendedores" element={<Sellers />} />
        </Route>
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/autos/:id" element={<VehicleDetail />} />
            </Routes>
            <ChatBot />
          </>
        } />
      </Routes>
    </div>
  )
}
