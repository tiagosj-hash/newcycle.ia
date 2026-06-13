import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import DashboardLayout from './components/DashboardLayout'
import AdminLayout from './pages/admin/AdminLayout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import AuctionDetail from './pages/AuctionDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import { MyAuctions, Bids, Profile, Financial } from './pages/dashboard'
import NewAuction from './pages/dashboard/NewAuction'
import AdminDashboard from './pages/admin/AdminDashboard'
import AuctionModeration from './pages/admin/AuctionModeration'
import Companies from './pages/admin/Companies'

function PrivateRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Carregando...</div>
  return session ? children : <Navigate to="/login" replace />
}

function PrivateAdminRoute({ children }) {
  const { session, company, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Carregando...</div>
  if (!session) return <Navigate to="/login" replace />
  if (company && company.role !== 'admin') return <Navigate to="/painel" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Rotas públicas sem Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Rotas públicas com Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/equipamentos" element={<><Navbar /><Browse /></>} />
        <Route path="/leilao/:id" element={<><Navbar /><AuctionDetail /></>} />

        {/* Painel do vendedor — exige login */}
        <Route path="/painel" element={
          <PrivateRoute>
            <Navbar />
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="leiloes" element={<MyAuctions />} />
          <Route path="lances" element={<Bids />} />
          <Route path="novo" element={<NewAuction />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="financeiro" element={<Financial />} />
        </Route>

        {/* Painel admin — exige role admin */}
        <Route path="/admin" element={
          <PrivateAdminRoute>
            <Navbar />
            <AdminLayout />
          </PrivateAdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="moderacao" element={<AuctionModeration />} />
          <Route path="empresas" element={<Companies />} />
        </Route>
      </Routes>
    </div>
  )
}
