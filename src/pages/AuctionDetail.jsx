import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Gavel, Shield, TrendingUp, Clock, CheckCircle, ChevronLeft, Zap, Building2, Package } from 'lucide-react'
import CountdownTimer from '../components/CountdownTimer'
import BidList from '../components/BidList'
import { validateBid, nextMinBid, formatCurrency, COMMISSION_RATE } from '../services/auctionService'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

const CATEGORY_EMOJI = {
  'TI & Informática': '💻', 'Escritório': '🗂️',
  'Industrial': '⚙️', 'AV & Telecom': '📡', 'Saúde': '🏥',
}

const CATEGORY_GRADIENT = {
  'TI & Informática': 'from-blue-50 via-slate-100 to-blue-50',
  'Escritório':       'from-amber-50 via-orange-50 to-amber-50',
  'Industrial':       'from-gray-100 via-slate-100 to-gray-100',
  'AV & Telecom':     'from-violet-50 via-blue-50 to-violet-50',
  'Saúde':            'from-emerald-50 via-teal-50 to-emerald-50',
}

const CONDITION_COLOR = {
  'Excelente':               'badge-green',
  'Bom':                     'badge-blue',
  'Regular':                 'badge-amber',
  'Para retirada de peças':  'badge-red',
}

export default function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { company } = useAuth()

  const [auction, setAuction]       = useState(null)
  const [bids, setBids]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [bidAmount, setBidAmount]   = useState('')
  const [lastBidAt, setLastBidAt]   = useState(null)
  const [sniped, setSniped]         = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: auc }, { data: bidData }] = await Promise.all([
        supabase
          .from('auctions')
          .select('*, companies!seller_id ( razao_social, cnpj, cnpj_verified )')
          .eq('id', id)
          .single(),
        supabase
          .from('bids')
          .select('*, companies!bidder_id ( razao_social, cnpj_verified )')
          .eq('auction_id', id)
          .order('amount', { ascending: false }),
      ])
      if (auc) setAuction(auc)
      if (bidData) {
        setBids(bidData)
        setLastBidAt(bidData[0]?.created_at ?? null)
      }
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel(`bids:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${id}` },
        async (payload) => {
          const { data: comp } = await supabase
            .from('companies').select('razao_social, cnpj_verified').eq('id', payload.new.bidder_id).single()
          const newBid = { ...payload.new, companies: comp }
          setBids(prev => [newBid, ...prev].sort((a, b) => b.amount - a.amount))
          setLastBidAt(payload.new.created_at)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [id])

  const currentBid  = bids[0]?.amount ?? null
  const minNext     = auction ? nextMinBid({ currentBid, minPrice: auction.min_price, minIncrement: auction.bid_increment }) : 0
  const progressPct = auction && currentBid
    ? Math.min(100, ((currentBid - auction.min_price) / auction.min_price) * 100 + 10)
    : 0

  const handleBid = async () => {
    if (!company) { setError('Faça login para dar um lance.'); return }
    const amount = parseFloat(bidAmount)
    const validation = validateBid({ newBid: amount, currentBid, minPrice: auction.min_price, minIncrement: auction.bid_increment })
    if (!validation.valid) { setError(validation.message); return }
    setSubmitting(true)
    const { error: err } = await supabase.from('bids').insert({ auction_id: id, bidder_id: company.id, amount })
    setSubmitting(false)
    if (err) { setError(err.message); return }
    setBidAmount('')
    setError('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-400">
      <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      <span className="text-sm">Carregando leilão...</span>
    </div>
  )
  if (!auction) return (
    <div className="text-center py-24 text-gray-400 text-sm">Leilão não encontrado.</div>
  )

  const seller      = auction.companies
  const imgSrc      = auction.image_url || auction.images?.[0] || null
  const bg          = CATEGORY_GRADIENT[auction.category] ?? 'from-gray-100 to-gray-200'
  const sellerInit  = seller?.razao_social?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() ?? '??'
  const condBadge   = CONDITION_COLOR[auction.condition] ?? 'badge-gray'

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={15} /> Voltar
          </button>
          <span className="text-gray-300">/</span>
          <button onClick={() => navigate('/equipamentos')} className="text-gray-400 hover:text-gray-700 transition-colors">
            Equipamentos
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{auction.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-5 gap-6">

          {/* ── Coluna principal (3/5) ── */}
          <div className="md:col-span-3 space-y-4">

            {/* Imagem */}
            <div className="card overflow-hidden">
              {imgSrc ? (
                <img src={imgSrc} alt={auction.title} className="w-full h-64 object-cover" />
              ) : (
                <div className={`h-64 bg-gradient-to-br ${bg} flex flex-col items-center justify-center gap-3`}>
                  <span className="text-7xl">{CATEGORY_EMOJI[auction.category] ?? '📦'}</span>
                  <span className="text-xs text-gray-500 font-medium bg-white/60 px-3 py-1 rounded-full">
                    {auction.category}
                  </span>
                </div>
              )}
            </div>

            {/* Info do lote */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="badge-gray">{auction.category}</span>
                {auction.condition && (
                  <span className={condBadge}>{auction.condition}</span>
                )}
                {auction.status === 'active' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ao vivo
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight leading-snug">
                {auction.title}
              </h1>
              {auction.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{auction.description}</p>
              )}
            </div>

            {/* Histórico de lances */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold flex items-center gap-2 text-gray-900">
                  <TrendingUp size={15} className="text-emerald-600" />
                  Histórico de lances
                </h2>
                <span className="badge-gray">{bids.length} lances</span>
              </div>
              {bids.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Gavel size={18} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Nenhum lance ainda. Seja o primeiro!</p>
                </div>
              ) : (
                <BidList bids={bids.map(b => ({
                  id: b.id,
                  company: b.companies?.razao_social ?? 'Empresa',
                  cnpj: b.companies?.cnpj_verified ?? false,
                  amount: b.amount,
                  createdAt: b.created_at,
                }))} />
              )}
            </div>
          </div>

          {/* ── Coluna lateral (2/5) ── */}
          <div className="md:col-span-2 space-y-4">

            {/* Card de bid */}
            <div className="card p-5">
              {/* Timer */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Clock size={13} /> Encerra em
                </div>
                {auction.ends_at && (
                  <CountdownTimer
                    endsAt={auction.ends_at}
                    lastBidAt={lastBidAt}
                    onExtended={() => setSniped(true)}
                  />
                )}
              </div>

              {sniped && (
                <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <Zap size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium">
                    Lance nos últimos 30s — contador reiniciado (anti-sniping)!
                  </p>
                </div>
              )}

              {/* Preços */}
              <div className="mb-4">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Preço mínimo</p>
                    <p className="text-sm text-gray-700 font-bold">{formatCurrency(auction.min_price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Lance atual</p>
                    {currentBid
                      ? <p className="text-2xl font-extrabold text-emerald-600 leading-none">{formatCurrency(currentBid)}</p>
                      : <p className="text-sm text-gray-300 font-medium">Sem lances</p>
                    }
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {currentBid && currentBid > auction.min_price && (
                  <p className="text-[10px] text-emerald-600 font-medium mt-1.5">
                    +{((currentBid / auction.min_price - 1) * 100).toFixed(0)}% acima do mínimo
                  </p>
                )}
              </div>

              {/* Formulário de lance */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">
                    Próximo lance mínimo:
                  </p>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(minNext)}</span>
                </div>

                <input
                  type="number"
                  className="form-input mb-2 text-center font-bold text-base"
                  placeholder={String(minNext)}
                  value={bidAmount}
                  onChange={e => { setBidAmount(e.target.value); setError('') }}
                  disabled={!company || submitting}
                />

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">{error}</p>
                )}
                {success && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-2">
                    <CheckCircle size={13} /> Lance registrado com sucesso!
                  </div>
                )}

                {company ? (
                  <button
                    onClick={handleBid}
                    disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 font-bold disabled:opacity-60"
                  >
                    <Gavel size={15} />
                    {submitting ? 'Enviando...' : 'Dar lance'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-primary w-full font-bold"
                    >
                      Entrar para dar lance
                    </button>
                    <button
                      onClick={() => navigate('/cadastro')}
                      className="btn-outline w-full"
                    >
                      Criar conta gratuita
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vendedor */}
            <div className="card p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Vendedor</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {sellerInit}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{seller?.razao_social ?? '—'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{seller?.cnpj ?? ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                {seller?.cnpj_verified ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                    <Shield size={12} className="text-emerald-600" /> CNPJ verificado
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600">
                    <Building2 size={12} /> Verificação pendente
                  </div>
                )}
              </div>
            </div>

            {/* Info plataforma */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2.5">
              {[
                { icon: Package,      text: `Entrega negociada entre comprador e vendedor` },
                { icon: Shield,       text: `Comissão de ${(COMMISSION_RATE * 100).toFixed(0)}% sobre o valor final, descontada do vendedor` },
                { icon: CheckCircle,  text: 'Todos os participantes têm CNPJ verificado' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
