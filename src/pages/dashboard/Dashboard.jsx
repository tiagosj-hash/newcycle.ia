import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Gavel, DollarSign, Activity, Plus, Eye, Clock } from 'lucide-react'
import CountdownTimer from '../../components/CountdownTimer'
import { SkeletonMetric } from '../../components/Skeleton'
import { formatCurrency } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function Dashboard() {
  const navigate   = useNavigate()
  const { company } = useAuth()
  const [metrics, setMetrics]   = useState(null)
  const [active, setActive]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!company) return
    async function load() {
      const [{ data: auctions }, { data: bids }] = await Promise.all([
        supabase.from('auctions').select('id, title, status, min_price, ends_at').eq('seller_id', company.id),
        supabase.from('bids').select('auction_id, amount').in(
          'auction_id',
          (await supabase.from('auctions').select('id').eq('seller_id', company.id)).data?.map(a => a.id) ?? []
        ),
      ])

      const byAuction = {}
      bids?.forEach(b => {
        if (!byAuction[b.auction_id] || b.amount > byAuction[b.auction_id]) byAuction[b.auction_id] = b.amount
      })

      const activeAuctions = (auctions ?? []).filter(a => a.status === 'active')
      const today = new Date(); today.setHours(0,0,0,0)
      const bidsTodayCount = bids?.filter(b => new Date(b.created_at) >= today).length ?? 0
      const maxBid = Math.max(0, ...Object.values(byAuction))
      const maxBidAuction = auctions?.find(a => byAuction[a.id] === maxBid)

      setMetrics({
        activeCount:    activeAuctions.length,
        endingToday:    activeAuctions.filter(a => {
          const d = new Date(a.ends_at); d.setHours(0,0,0,0)
          return d.getTime() === today.getTime()
        }).length,
        bidsToday:      bidsTodayCount,
        maxBid:         maxBid || null,
        maxBidTitle:    maxBidAuction?.title ?? null,
      })

      setActive(activeAuctions.slice(0, 3).map(a => ({
        ...a,
        currentBid: byAuction[a.id] ?? null,
        totalBids: bids?.filter(b => b.auction_id === a.id).length ?? 0,
      })))
      setLoading(false)
    }
    load()
  }, [company])

  const METRICS = metrics ? [
    { label: 'Leilões ativos',    value: String(metrics.activeCount), sub: `${metrics.endingToday} encerram hoje`, icon: Gavel,      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valueCls: 'text-gray-900' },
    { label: 'Lances hoje',       value: String(metrics.bidsToday),   sub: 'recebidos hoje',                         icon: Activity,   iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    valueCls: 'text-gray-900' },
    { label: 'Maior lance ativo', value: metrics.maxBid ? formatCurrency(metrics.maxBid) : '—', sub: metrics.maxBidTitle?.split('—')[0] ?? 'Nenhum lance', icon: TrendingUp, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', valueCls: 'text-emerald-600' },
    { label: 'Arrecadado (mês)',  value: 'R$ 0',                      sub: 'transações concluídas',                  icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valueCls: 'text-emerald-600' },
  ] : []

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Visão geral</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {company?.razao_social} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button onClick={() => navigate('/painel/novo')} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={15} /> <span className="hidden sm:inline">Novo leilão</span>
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonMetric key={i} />)
          : METRICS.map(({ label, value, sub, icon: Icon, iconBg, iconColor, valueCls }) => (
              <div key={label} className="card p-4">
                <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <p className="text-xs text-gray-500 mb-1 truncate">{label}</p>
                <p className={`text-lg md:text-xl font-bold ${valueCls} truncate`}>{value}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>
              </div>
            ))
        }
      </div>

      {/* Leilões ativos */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">Leilões ativos</h2>
        <button onClick={() => navigate('/painel/leiloes')} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
          Ver todos →
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="card p-4 h-28 animate-pulse bg-gray-50" />)}
        </div>
      ) : active.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-400 text-sm mb-3">Nenhum leilão ativo no momento.</p>
          <button onClick={() => navigate('/painel/novo')} className="btn-primary text-sm">
            Criar primeiro leilão
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map(a => {
            const progressPct = a.currentBid
              ? Math.min(100, ((a.currentBid - a.min_price) / a.min_price) * 100 + 15)
              : 0
            return (
              <div key={a.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.totalBids} lances</p>
                  </div>
                  {a.ends_at && <CountdownTimer endsAt={a.ends_at} />}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-gray-400 shrink-0">{formatCurrency(a.min_price)}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-emerald-600 shrink-0">
                    {a.currentBid ? formatCurrency(a.currentBid) : '—'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => navigate('/painel/lances')} className="btn-sm flex items-center gap-1">
                    <Eye size={11} /> Lances
                  </button>
                  <button className="btn-sm flex items-center gap-1">
                    <Clock size={11} /> Prorrogar
                  </button>
                  <button className="btn-sm text-red-500 border-red-200 hover:bg-red-50">Encerrar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
