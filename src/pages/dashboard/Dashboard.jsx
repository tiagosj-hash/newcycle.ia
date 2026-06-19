import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Gavel, DollarSign, Activity, Plus, Eye,
  ArrowUpRight, Clock, Zap, ChevronRight, AlertTriangle,
  Flame, BarChart2,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import CountdownTimer from '../../components/CountdownTimer'
import { SkeletonMetric } from '../../components/Skeleton'
import { formatCurrency } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const FADE_UP = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
const STAGGER = { show: { transition: { staggerChildren: 0.08 } } }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white rounded-xl px-3 py-2 text-xs shadow-float">
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-bold text-brand-400">{payload[0].value} lances</p>
    </div>
  )
}

const METRIC_CONFIG = [
  {
    key: 'active',
    label: 'Leilões ativos',
    icon: Gavel,
    gradient: 'linear-gradient(135deg, #edfaf4 0%, #d3f4e5 100%)',
    iconBg: 'linear-gradient(135deg, #22c58a, #16a36d)',
    valueColor: '#0e7a52',
    border: '#a9e8cc',
  },
  {
    key: 'bidsToday',
    label: 'Lances hoje',
    icon: Activity,
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    iconBg: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    valueColor: '#1d4ed8',
    border: '#bfdbfe',
  },
  {
    key: 'maxBid',
    label: 'Maior lance',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
    iconBg: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    valueColor: '#6d28d9',
    border: '#ddd6fe',
  },
  {
    key: 'revenue',
    label: 'Arrecadado (mês)',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    iconBg: 'linear-gradient(135deg, #fbbf24, #d97706)',
    valueColor: '#b45309',
    border: '#fde68a',
  },
]

export default function Dashboard() {
  const navigate    = useNavigate()
  const { company } = useAuth()
  const [metrics, setMetrics]     = useState(null)
  const [active, setActive]       = useState([])
  const [chartData, setChartData] = useState([])
  const [alerts, setAlerts]       = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!company) return
    async function load() {
      const [{ data: auctions }, { data: bids }] = await Promise.all([
        supabase.from('auctions').select('id, title, status, min_price, ends_at, duration_days').eq('seller_id', company.id),
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
      const draftAuctions  = (auctions ?? []).filter(a => a.status === 'draft')
      const today          = new Date(); today.setHours(0, 0, 0, 0)
      const bidsTodayCount = bids?.filter(b => new Date(b.created_at) >= today).length ?? 0
      const maxBid         = Math.max(0, ...Object.values(byAuction))
      const maxBidAuction  = auctions?.find(a => byAuction[a.id] === maxBid)
      const endingSoon     = activeAuctions.filter(a => {
        const s = (new Date(a.ends_at) - new Date()) / 1000
        return s > 0 && s < 86400
      })

      // Gráfico — últimos 7 dias
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i)
        d.setHours(0, 0, 0, 0)
        const next = new Date(d); next.setDate(next.getDate() + 1)
        return {
          day: format(d, 'EEE', { locale: ptBR }),
          lances: bids?.filter(b => { const t = new Date(b.created_at); return t >= d && t < next }).length ?? 0,
        }
      })

      // Alertas
      const alertList = []
      if (draftAuctions.length > 0) {
        alertList.push({
          id: 'drafts', type: 'warning', icon: Zap,
          title: `${draftAuctions.length} rascunho${draftAuctions.length > 1 ? 's' : ''} aguardando publicação`,
          desc: 'Publique para começar a receber lances.',
          action: 'Publicar agora', path: '/painel/leiloes',
        })
      }
      if (endingSoon.length > 0) {
        alertList.push({
          id: 'ending', type: 'urgent', icon: Clock,
          title: `${endingSoon.length} leilão${endingSoon.length > 1 ? 'ões' : ''} encerrando hoje`,
          desc: endingSoon.map(a => a.title).slice(0, 2).join(', '),
          action: 'Ver', path: '/painel/leiloes',
        })
      }

      setMetrics({
        active: activeAuctions.length,
        draftCount: draftAuctions.length,
        bidsToday: bidsTodayCount,
        maxBid: maxBid || null,
        maxBidTitle: maxBidAuction?.title ?? null,
        revenue: 0,
      })
      setChartData(last7)
      setAlerts(alertList)
      setActive(activeAuctions.slice(0, 4).map(a => ({
        ...a,
        currentBid: byAuction[a.id] ?? null,
        totalBids: bids?.filter(b => b.auction_id === a.id).length ?? 0,
      })))
      setLoading(false)
    }
    load()
  }, [company])

  const metricValues = metrics ? {
    active:    { value: String(metrics.active), sub: metrics.draftCount > 0 ? `+ ${metrics.draftCount} rascunho` : 'sem rascunhos', trend: null },
    bidsToday: { value: String(metrics.bidsToday), sub: 'últimas 24h', trend: metrics.bidsToday > 0 ? `+${metrics.bidsToday}` : null },
    maxBid:    { value: metrics.maxBid ? formatCurrency(metrics.maxBid) : '—', sub: metrics.maxBidTitle?.slice(0, 24) ?? 'Nenhum lance', trend: null },
    revenue:   { value: 'R$ 0', sub: 'este mês', trend: null },
  } : {}

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Visão geral</h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">
            {company?.razao_social} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/painel/novo')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
          style={{
            background: 'linear-gradient(180deg, #22c58a 0%, #16a36d 100%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 2px 12px rgba(22,163,109,0.30)',
          }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Novo leilão</span>
        </button>
      </div>

      {/* ── Alertas ──────────────────────────────────────── */}
      {!loading && alerts.length > 0 && (
        <div className="space-y-2 mb-6">
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
                alert.type === 'urgent'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <alert.icon size={15} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold">{alert.title}</span>
                {alert.desc && <span className="text-xs opacity-70 block truncate">{alert.desc}</span>}
              </div>
              <button
                onClick={() => navigate(alert.path)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  alert.type === 'urgent' ? 'bg-red-100 hover:bg-red-200 text-red-800' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                }`}
              >
                {alert.action} <ChevronRight size={11} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Metric cards ─────────────────────────────────── */}
      <motion.div
        variants={STAGGER} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonMetric key={i} />)
          : METRIC_CONFIG.map(cfg => {
              const mv = metricValues[cfg.key]
              return (
                <motion.div
                  key={cfg.key}
                  variants={FADE_UP}
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{ background: cfg.gradient, border: `1px solid ${cfg.border}` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ background: cfg.iconBg }}>
                      <cfg.icon size={18} className="text-white" />
                    </div>
                    {mv?.trend && (
                      <span className="flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(22,163,109,0.12)', color: '#0e7a52' }}>
                        <ArrowUpRight size={10} />{mv.trend}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">{cfg.label}</p>
                    <p className="text-2xl font-black leading-none tabular-nums" style={{ color: cfg.valueColor }}>
                      {mv?.value ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium truncate">{mv?.sub}</p>
                  </div>
                </motion.div>
              )
            })
        }
      </motion.div>

      {/* ── Gráfico + Leilões ativos ─────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-4 mb-4">

        {/* Gráfico */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <BarChart2 size={14} className="text-gray-400" />
                <p className="text-sm font-bold text-gray-900">Lances recebidos</p>
              </div>
              <p className="text-xs text-gray-400">Últimos 7 dias</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-gray-900 leading-none">
                {chartData.reduce((s, d) => s + d.lances, 0)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">total</p>
            </div>
          </div>
          {loading ? (
            <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={112}>
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c58a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c58a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22c58a', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone" dataKey="lances"
                  stroke="#16a36d" strokeWidth={2.5}
                  fill="url(#bidGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#16a36d', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Leilões ativos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="lg:col-span-3 bg-white rounded-2xl p-5 border border-gray-200"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Gavel size={14} className="text-gray-400" />
              <p className="text-sm font-bold text-gray-900">Leilões ativos</p>
            </div>
            <button
              onClick={() => navigate('/painel/leiloes')}
              className="text-xs text-brand-600 font-semibold hover:text-brand-800 flex items-center gap-1 transition-colors"
            >
              Ver todos <ChevronRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg, #edfaf4, #d3f4e5)' }}>
                <Gavel size={22} className="text-brand-500" />
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Nenhum leilão ativo</p>
              <p className="text-xs text-gray-400 mb-4">Crie seu primeiro leilão em minutos com ajuda da IA</p>
              <button
                onClick={() => navigate('/painel/novo')}
                className="text-xs font-bold text-white px-4 py-2 rounded-xl transition-all"
                style={{ background: 'linear-gradient(180deg, #22c58a, #16a36d)' }}
              >
                <Plus size={12} className="inline mr-1" />Criar leilão
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {active.map(a => {
                const pct    = a.currentBid ? Math.min(100, ((a.currentBid - a.min_price) / a.min_price) * 100 + 15) : 0
                const secs   = (new Date(a.ends_at) - new Date()) / 1000
                const urgent = secs > 0 && secs < 3600
                const hot    = a.totalBids >= 4

                return (
                  <button
                    key={a.id}
                    onClick={() => navigate(`/leilao/${a.id}`)}
                    className="group w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all hover:border-brand-200 hover:bg-brand-50/40"
                    style={{ borderColor: urgent ? '#fecaca' : '#f3f4f6', background: urgent ? '#fff5f5' : '#fafafa' }}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${hot ? 'bg-red-100' : 'bg-brand-50'}`}>
                      {hot ? <Flame size={15} className="text-red-500" /> : <Gavel size={15} className="text-brand-600" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {urgent && <AlertTriangle size={11} className="text-red-400 shrink-0" />}
                        <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #22c58a, #16a36d)' }}
                          />
                        </div>
                        <span className="text-xs font-black tabular-nums shrink-0"
                          style={{ color: a.currentBid ? '#0e7a52' : '#9ca3af' }}>
                          {a.currentBid ? formatCurrency(a.currentBid) : 'Sem lances'}
                        </span>
                      </div>
                    </div>

                    {/* Timer + lances */}
                    <div className="text-right shrink-0">
                      {a.ends_at && <CountdownTimer endsAt={a.ends_at} />}
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">{a.totalBids} lance{a.totalBids !== 1 ? 's' : ''}</p>
                    </div>

                    <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-500 transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Ações rápidas ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-5 border border-gray-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <p className="text-sm font-bold text-gray-900 mb-4">Ações rápidas</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Novo leilão', icon: Plus, path: '/painel/novo',
              bg: 'linear-gradient(135deg, #edfaf4, #d3f4e5)', border: '#a9e8cc', color: '#0e7a52',
            },
            {
              label: 'Meus leilões', icon: Gavel, path: '/painel/leiloes',
              bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '#bfdbfe', color: '#1d4ed8',
            },
            {
              label: 'Financeiro', icon: DollarSign, path: '/painel/financeiro',
              bg: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '#ddd6fe', color: '#6d28d9',
            },
            {
              label: 'Marketplace', icon: Eye, path: '/equipamentos',
              bg: 'linear-gradient(135deg, #f9fafb, #f3f4f6)', border: '#e5e7eb', color: '#374151',
            },
          ].map(({ label, icon: Icon, path, bg, border, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <Icon size={20} style={{ color }} />
              <span className="text-xs font-bold" style={{ color }}>{label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
