import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import AuctionDetail from './pages/AuctionDetail'
import Dashboard from './pages/dashboard/Dashboard'
import MyAuctions from './pages/dashboard/MyAuctions'
import Bids from './pages/dashboard/Bids'
import NewAuction from './pages/dashboard/NewAuction'
import Profile from './pages/dashboard/Profile'
import Financial from './pages/dashboard/Financial'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipamentos" element={<Browse />} />
        <Route path="/leilao/:id" element={<AuctionDetail />} />
        <Route path="/painel" element={<Dashboard />} />
        <Route path="/painel/leiloes" element={<MyAuctions />} />
        <Route path="/painel/lances" element={<Bids />} />
        <Route path="/painel/novo" element={<NewAuction />} />
        <Route path="/painel/perfil" element={<Profile />} />
        <Route path="/painel/financeiro" element={<Financial />} />
      </Routes>
    </div>
  )
}
