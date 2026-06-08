import { useNavigate } from 'react-router-dom'
import { addDays } from 'date-fns'
import CountdownTimer from '../../components/CountdownTimer'
import { formatCurrency } from '../../services/auctionService'

const METRICS = [
  { label: 'Leilões ativos', value: '5', delta: '2 encerram hoje', color: '' },
  { label: 'Lances hoje', value: '12', delta: 'em 3 leilões', color: 'text-red-500' },
  { label: 'Maior lance', value: 'R$ 9.800', delta: 'ThinkPad lote 8', color: 'text-emerald-600' },
  { label: 'Arrecadado (mês)', value: 'R$ 24.600', delta: '+18% vs mês ant.', color: 'text-emerald-600' },
]

const ACTIVE = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8', minPrice: 8000, currentBid: 9800, totalBids: 6, endsAt: addDays(new Date(), 0.09).toISOString(), leader: 'TechNova Soluções' },
  { id: '2', title: 'Monitor Dell 27" — 4 un.', minPrice: 1500, currentBid: 1750, totalBids: 3, endsAt: addDays(new Date(), 0.03).toISOString(), leader: 'Contábil Souza ME' },
  { id: '3', title: 'Nobreak APC 1500VA — 3 un.', minPrice: 450, currentBid: 450, totalBids: 1, endsAt: addDays(new Date(), 5).toISOString(), leader: 'Escritório SS' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">Fintech Radius LTDA — visão geral dos seus leilões</p>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {METRICS.map(({ label, value, delta, color }) => (
          <div key={label} className="card p-4">
            <div className="text-xs text-gray-400 mb-2">{label}</div>
            <div className={`text-2xl font-semibold ${color}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-1">{delta}</div>
          </div>
        ))}
      </div>

      {/* Leilões ativos */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Leilões ativos</h2>
        <button onClick={() => navigate('/painel/leiloes')} className="text-xs text-emerald-600 hover:underline">Ver todos</button>
      </div>

      <div className="space-y-3">
        {ACTIVE.map(a => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{a.totalBids} lances</div>
              </div>
              <CountdownTimer endsAt={a.endsAt} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><div className="text-xs text-gray-400">Mínimo</div><div className="text-sm text-gray-600 font-medium">{formatCurrency(a.minPrice)}</div></div>
              <div><div className="text-xs text-gray-400">Lance atual</div><div className="text-sm text-emerald-600 font-semibold">{formatCurrency(a.currentBid)}</div></div>
              <div><div className="text-xs text-gray-400">Líder</div><div className="text-xs font-medium text-gray-700 mt-0.5">{a.leader}</div></div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => navigate('/painel/lances')} className="btn-sm">Ver lances</button>
              <button className="btn-sm">Prorrogar</button>
              <button className="btn-sm text-red-500 border-red-200 hover:bg-red-50">Encerrar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={() => navigate('/painel/novo')} className="btn-primary w-full">
          + Criar novo leilão
        </button>
      </div>
    </div>
  )
}
