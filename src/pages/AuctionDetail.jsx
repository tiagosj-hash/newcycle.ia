import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Gavel, Shield, TrendingUp } from 'lucide-react'
import { addDays } from 'date-fns'
import CountdownTimer from '../components/CountdownTimer'
import BidList from '../components/BidList'
import { validateBid, nextMinBid, formatCurrency } from '../services/auctionService'

const MOCK = {
  id: '1',
  title: 'Lenovo ThinkPad E14 — lote 8 unidades',
  description: 'Lote com 8 notebooks Lenovo ThinkPad E14, Intel Core i5 11ª geração, 8GB RAM, SSD 256GB. Equipamentos em bom estado, utilizados em ambiente corporativo por 2 anos. Acompanham carregadores originais.',
  category: 'TI & Informática',
  condition: 'Bom',
  tags: ['Lenovo', 'ThinkPad E14', 'Intel i5', '8GB RAM', 'SSD 256GB'],
  images: [],
  minPrice: 8000,
  minIncrement: 200,
  currentBid: 9800,
  totalBids: 6,
  endsAt: addDays(new Date(), 0.09).toISOString(),
  seller: { name: 'Fintech Radius LTDA', cnpj: '12.345.678/0001-90', verified: true, totalSales: 12 },
  bids: [
    { id: '1', company: 'TechNova Soluções LTDA', cnpj: true, amount: 9800, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '2', company: 'DataHub Corp', cnpj: true, amount: 9200, createdAt: new Date(Date.now() - 10800000).toISOString() },
    { id: '3', company: 'TechNova Soluções LTDA', cnpj: true, amount: 8800, createdAt: new Date(Date.now() - 14400000).toISOString() },
    { id: '4', company: 'DataHub Corp', cnpj: true, amount: 8400, createdAt: new Date(Date.now() - 18000000).toISOString() },
    { id: '5', company: 'Soluções Omega ME', cnpj: true, amount: 8200, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '6', company: 'TechNova Soluções LTDA', cnpj: true, amount: 8000, createdAt: new Date(Date.now() - 90000000).toISOString() },
  ],
}

export default function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const auction = MOCK // substituir por fetch real

  const [bidAmount, setBidAmount] = useState('')
  const [bids, setBids] = useState(auction.bids)
  const [currentBid, setCurrentBid] = useState(auction.currentBid)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const minNext = nextMinBid({ currentBid, minPrice: auction.minPrice, minIncrement: auction.minIncrement })

  const handleBid = () => {
    const amount = parseFloat(bidAmount.replace(/\D/g, ''))
    const validation = validateBid({ newBid: amount, currentBid, minPrice: auction.minPrice, minIncrement: auction.minIncrement })
    if (!validation.valid) { setError(validation.message); return }

    const newBid = { id: Date.now().toString(), company: 'Minha Empresa LTDA', cnpj: true, amount, createdAt: new Date().toISOString() }
    setBids(prev => [newBid, ...prev])
    setCurrentBid(amount)
    setBidAmount('')
    setError('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700 mb-4">← Voltar</button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="md:col-span-2 space-y-4">
          {/* Imagem */}
          <div className="card overflow-hidden">
            <div className="h-56 bg-gray-100 flex items-center justify-center">
              <Gavel size={48} className="text-gray-200" />
            </div>
          </div>

          {/* Infos */}
          <div className="card p-5">
            <div className="text-xs text-gray-400 mb-1">{auction.category} · {auction.condition}</div>
            <h1 className="text-lg font-semibold text-gray-900 mb-3">{auction.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{auction.description}</p>
            <div className="flex flex-wrap gap-2">
              {auction.tags.map(t => (
                <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          {/* Lances */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-emerald-600" />
              Histórico de lances ({bids.length})
            </h2>
            <BidList bids={bids} />
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Painel do leilão */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Encerra em</span>
              <CountdownTimer endsAt={auction.endsAt} />
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-100">
              <div>
                <div className="text-xs text-gray-400">Preço mínimo</div>
                <div className="text-sm font-medium text-gray-600">{formatCurrency(auction.minPrice)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Lance atual</div>
                <div className="text-lg font-semibold text-emerald-600">{formatCurrency(currentBid)}</div>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Próximo lance mínimo: <span className="font-medium text-gray-700">{formatCurrency(minNext)}</span>
            </div>

            {/* Input de lance */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">Seu lance (R$)</label>
              <input
                type="number"
                className="form-input mb-2"
                placeholder={minNext.toString()}
                value={bidAmount}
                onChange={e => { setBidAmount(e.target.value); setError('') }}
              />
              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
              {success && <p className="text-xs text-emerald-600 mb-2">Lance registrado com sucesso!</p>}
              <button onClick={handleBid} className="btn-primary w-full">
                Dar lance
              </button>
            </div>
          </div>

          {/* Vendedor */}
          <div className="card p-4">
            <h3 className="text-xs font-medium text-gray-500 mb-3">Vendedor</h3>
            <div className="text-sm font-medium text-gray-900 mb-1">{auction.seller.name}</div>
            {auction.seller.verified && (
              <div className="flex items-center gap-1 text-xs text-emerald-700 mb-1">
                <Shield size={12} /> CNPJ verificado
              </div>
            )}
            <div className="text-xs text-gray-400">{auction.seller.totalSales} vendas realizadas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
