import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Gavel, DollarSign, Activity, Plus, Eye, Clock, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import CountdownTimer from '../../components/CountdownTimer'
import { SkeletonMetric } from '../../components/Skeleton'
import { formatCurrency } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const FADE_UP = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const STAGGER = { show: { transition: { staggerChildren: 0.07 } } }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-card-hover px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-emerald-600">{payload[0].value} lances</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate    = useNavigate()
  const { company } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [active, setActive]   = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!company) return
    async function load() {
      const [{ data: auctions }, { data: bids }] = await Promise.all([
        supabase.from('auctions').select('id, title, status, min_price, ends_at').eq('seller_id', company.id),
        supabase.from('bids').select('auction_id, amount, created_at').in(
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

      // Gráfico — últimos 7 dias
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i)
        d.setHours(0, 0, 0, 0)
        const next = new Date(d); next.setDate(next.getDate() + 1)
        return {
          day: format(d, 'EEE', { locale: ptBR }),
          lances: bids?.filter(b => {
            const t = new Date(b.created_at)
            return t >= d && t < next
          }).length ?? 0,
        }
      })

      setMetrics({
        activeCount:  activeAuctions.length,
        endingToday:  activeAuctions.filter(a => {
          const d = new Date(a.ends_at); d.setHours(0,0,0,0)
          return d.getTime() === today.getTime()
        }).length,
        bidsToday:    bidsTodayCount,
        maxBid:       maxBid || null,
        maxBidTitle:  maxBidAuction?.title ?? null,
      })
      setChartData(last7)
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
    {
      label: 'Leilões ativos',
      value: String(metrics.activeCount),
      sub: `${metrics.endingToday} encerram hoje`,
      icon: Gavel,
      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
      valueCls: 'text-gray-900',
      trend: null,
    },
    {
      label: 'Lances hoje',
      value: String(metrics.bidsToday),
      sub: 'recebidos nas últimas 24h',
      icon: Activity,
      iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      valueCls: 'text-gray-900',
      trend: metrics.bidsToday > 0 ? '+' + metrics.bidsToday : null,
    },
    {
      label: 'Maior lance',
      value: metrics.maxBid ? formatCurrency(metrics.maxBid) : '—',
      sub: metrics.maxBidTitle ? metrics.maxBidTitle.slice(0, 28) + '…' : 'Nenhum lance ainda',
      icon: TrendingUp,
      iconBg: 'bg-violet-50', iconColor: 'text-violet-600',
      valueCls: 'text-emerald-600',
      trend: null,
    },
    {
      label: 'Arrecadado (mês)',
      value: 'R$ 0',
      sub: 'transações concluídas',
      icon: DollarSign,
      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
      valueCls: 'text-emerald-600',
      trend: null,
    },
  ] : []

  return (
    <div className="page-container py-6 md:py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Visão geral</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {company?.razao_social} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button onClick={() => navigate('/painel/novo')} className="btn-primary">
          <Plus size={15} />
          <span className="hidden sm:inline">Novo leilão</span>
        </button>
      </div>

      {/* Métricas */}
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonMetric key={i} />)
          : METRICS.map(({ label, value, sub, icon: Icon, iconBg, iconColor, valueCls, trend }) => (
              <motion.div key={label} variants={FADE_UP} className="metric-card">
                <div className="flex items-start justify-between">
                  <div className={`metric-icon ${iconBg}`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  {trend && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <ArrowUpRight size={10} />{trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="metric-label mb-1">{label}</p>
                  <p className={`metric-value ${valueCls}`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>
                </div>
              </motion.div>
            ))
        }
      </motion.div>

      {/* Gráfico + Leilões ativos */}
      <div className="grid lg:grid-cols-5 gap-4 mb-6">

        {/* Gráfico de lances */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Lances recebidos</p>
              <p className="text-xs text-gray-400">Últimos 7 dias</p>
            </div>
            <span className="badge-gray">{chartData.reduce((s, d) => s + d.lances, 0)} total</span>
          </div>
          {loading ? (
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={96}>
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="lances" stroke="#1D9E75" strokeWidth={2} fill="url(#bidGrad)" dot={false} activeDot={{ r: 4, fill: '#1D9E75' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Leilões ativos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-3 card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-900">Leilões ativos</p>
            <button onClick={() => navigate('/painel/leiloes')} className="text-xs text-emerald-600 font-semibold hover:text-emerald-800 flex items-center gap-1">
              Ver todos <ArrowUpRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Gavel size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 mb-3">Nenhum leilão ativo</p>
              <button onClick={() => navigate('/painel/novo')} className="btn-primary text-xs px-3 py-1.5">
                Criar primeiro leilão
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {active.map(a => {
                const pct = a.currentBid ? Math.min(100, ((a.currentBid - a.min_price) / a.min_price) * 100 + 15) : 0
                return (
                  <div key={a.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/leilao/${a.id}`)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 shrink-0">
                          {a.currentBid ? formatCurrency(a.currentBid) : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {a.ends_at && <CountdownTimer endsAt={a.ends_at} />}
                      <p className="text-[10px] text-gray-400 mt-1">{a.totalBids} lances</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Ações rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="card p-5"
      >
        <p className="text-sm font-bold text-gray-900 mb-4">Ações rápidas</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Novo leilão',     icon: Plus,        path: '/painel/novo',       bg: 'bg-emerald-50 hover:bg-emerald-100', color: 'text-emerald-700' },
            { label: 'Meus leilões',    icon: Gavel,       path: '/painel/leiloes',    bg: 'bg-blue-50 hover:bg-blue-100',       color: 'text-blue-700' },
            { label: 'Financeiro',      icon: DollarSign,  path: '/painel/financeiro', bg: 'bg-violet-50 hover:bg-violet-100',   color: 'text-violet-700' },
            { label: 'Ver marketplace', icon: Eye,         path: '/equipamentos',      bg: 'bg-gray-100 hover:bg-gray-200',      color: 'text-gray-700' },
          ].map(({ label, icon: Icon, path, bg, color }) => (
            <button key={label} onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${bg} transition-colors group`}
            >
              <Icon size={20} className={color} />
              <span className={`text-xs font-semibold ${color}`}>{label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
