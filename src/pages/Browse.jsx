import { useState } from 'react'
import { addDays } from 'date-fns'
import AuctionCard from '../components/AuctionCard'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Todos', 'TI & Informática', 'Escritório', 'Industrial', 'AV & Telecom', 'Saúde']

const MOCK_AUCTIONS = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8 un.', category: 'TI & Informática', images: [], minPrice: 8000, currentBid: 9800, totalBids: 6, endsAt: addDays(new Date(), 0.09).toISOString(), seller: { name: 'Fintech Radius' } },
  { id: '2', title: 'Monitor Dell 27" 4K — 4 un.', category: 'TI & Informática', images: [], minPrice: 1500, currentBid: 1750, totalBids: 3, endsAt: addDays(new Date(), 0.03).toISOString(), seller: { name: 'Construtora Beta' } },
  { id: '3', title: 'Nobreak APC 1500VA — 3 un.', category: 'TI & Informática', images: [], minPrice: 450, currentBid: 450, totalBids: 1, endsAt: addDays(new Date(), 5).toISOString(), seller: { name: 'Clínica Norte' } },
  { id: '4', title: 'Switch Cisco Catalyst 48 portas', category: 'TI & Informática', images: [], minPrice: 2000, currentBid: null, totalBids: 0, endsAt: addDays(new Date(), 7).toISOString(), seller: { name: 'Grupo Alfa' } },
  { id: '5', title: 'Câmeras IP Intelbras — lote 20', category: 'AV & Telecom', images: [], minPrice: 2800, currentBid: 3200, totalBids: 4, endsAt: addDays(new Date(), 3).toISOString(), seller: { name: 'Shopping Nortão' } },
  { id: '6', title: 'Torno mecânico Romi GL240', category: 'Industrial', images: [], minPrice: 15000, currentBid: 18000, totalBids: 2, endsAt: addDays(new Date(), 10).toISOString(), seller: { name: 'Metal Sul Ind.' } },
  { id: '7', title: 'Cadeiras Herman Miller — lote 12', category: 'Escritório', images: [], minPrice: 5000, currentBid: 6200, totalBids: 5, endsAt: addDays(new Date(), 2).toISOString(), seller: { name: 'Construtora Beta' } },
  { id: '8', title: 'Rack servidor 42U', category: 'TI & Informática', images: [], minPrice: 1800, currentBid: null, totalBids: 0, endsAt: addDays(new Date(), 14).toISOString(), seller: { name: 'Fintech Radius' } },
]

export default function Browse() {
  const [cat, setCat] = useState('Todos')
  const navigate = useNavigate()

  const filtered = cat === 'Todos' ? MOCK_AUCTIONS : MOCK_AUCTIONS.filter(a => a.category === cat)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Leilões ativos</h1>
        <button onClick={() => navigate('/painel/novo')} className="btn-primary text-sm">
          + Cadastrar equipamento
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              cat === c
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map(a => <AuctionCard key={a.id} auction={a} />)}
      </div>
    </div>
  )
}
