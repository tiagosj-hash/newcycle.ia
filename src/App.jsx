import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  )
}

function PrivateRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Carregando...</span>
      </div>
    </div>
  )
  return session ? children : <Navigate to="/login" replace />
}

function PrivateAdminRoute({ children }) {
  const { session, company, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!session) return <Navigate to="/login" replace />
  if (company && company.role !== 'admin') return <Navigate to="/painel" replace />
  return children
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Rotas de auth — sem Navbar */}
          <Route path="/login"    element={<PageTransition><Login /></PageTransition>} />
          <Route path="/cadastro" element={<PageTransition><Register /></PageTransition>} />

          {/* Rotas públicas com Navbar */}
          <Route path="/" element={<><Navbar /><PageTransition><Home /></PageTransition></>} />
          <Route path="/equipamentos" element={<><Navbar /><PageTransition><Browse /></PageTransition></>} />
          <Route path="/leilao/:id"   element={<><Navbar /><PageTransition><AuctionDetail /></PageTransition></>} />

          {/* Painel do vendedor */}
          <Route path="/painel" element={
            <PrivateRoute>
              <Navbar />
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index           element={<Dashboard />} />
            <Route path="leiloes"  element={<MyAuctions />} />
            <Route path="lances"   element={<Bids />} />
            <Route path="novo"     element={<NewAuction />} />
            <Route path="perfil"   element={<Profile />} />
            <Route path="financeiro" element={<Financial />} />
          </Route>

          {/* Painel admin */}
          <Route path="/admin" element={
            <PrivateAdminRoute>
              <Navbar />
              <AdminLayout />
            </PrivateAdminRoute>
          }>
            <Route index           element={<AdminDashboard />} />
            <Route path="moderacao" element={<AuctionModeration />} />
            <Route path="empresas"  element={<Companies />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  )
}
