import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronUp, TrendingUp, Gavel, Clock, CheckCircle2,
  AlertCircle, Building2, ExternalLink, Zap, Ban, RefreshCw,
  Save, Loader2, ShieldCheck, ShieldOff,
} from 'lucide-react'
import CountdownTimer from '../../components/CountdownTimer'
import { SkeletonRow } from '../../components/Skeleton'
import { formatCurrency, COMMISSION_RATE, calcEndsAt } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// ── STATUS helpers ────────────────────────────────────────
const STATUS_META = {
  active:             { label: 'Ativo',         cls: 'badge-green',  dot: 'bg-brand-500' },
  draft:              { label: 'Rascunho',       cls: 'badge-gray',   dot: 'bg-gray-400' },
  pending_moderation: { label: 'Em análise',     cls: 'badge-amber',  dot: 'bg-amber-400' },
  ended:              { label: 'Encerrado',      cls: 'badge-blue',   dot: 'bg-blue-400' },
  sold:               { label: 'Vendido',        cls: 'badge-green',  dot: 'bg-brand-500' },
  unsold:             { label: 'Sem venda',      cls: 'badge-gray',   dot: 'bg-gray-300' },
  cancelled:          { label: 'Cancelado',      cls: 'badge-red',    dot: 'bg-red-400' },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? { label: status, cls: 'badge-gray', dot: 'bg-gray-300' }
  return (
    <span className={`${m.cls} inline-flex items-center gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

// ── MyAuctions ────────────────────────────────────────────
export function MyAuctions() {
  const navigate = useNavigate()
  const { company } = useAuth()
  const [auctions, setAuctions]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [actionId, setActionId]   = useState(null) // auction being acted upon
  const [toast, setToast]         = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (!company) return
    async function load() {
      const { data } = await supabase
        .from('auctions')
        .select('*, bids(amount)')
        .eq('seller_id', company.id)
        .order('created_at', { ascending: false })
      if (data) {
        setAuctions(data.map(a => ({
          ...a,
          currentBid: a.bids?.length ? Math.max(...a.bids.map(b => b.amount)) : null,
          totalBids: a.bids?.length ?? 0,
        })))
      }
      setLoading(false)
    }
    load()
  }, [company])

  const counts = {
    active: auctions.filter(a => a.status === 'active').length,
    ended:  auctions.filter(a => ['ended', 'sold'].includes(a.status)).length,
    draft:  auctions.filter(a => ['draft', 'pending_moderation'].includes(a.status)).length,
  }

  async function handlePublish(auction) {
    setActionId(auction.id)
    const { error } = await supabase
      .from('auctions')
      .update({
        status: 'pending_moderation',
        ends_at: calcEndsAt(auction.duration_days ?? 7),
      })
      .eq('id', auction.id)
    setActionId(null)
    if (error) { showToast('Erro ao publicar: ' + error.message, 'error'); return }
    setAuctions(prev => prev.map(a =>
      a.id === auction.id ? { ...a, status: 'pending_moderation' } : a
    ))
    showToast('Leilão enviado para moderação!')
  }

  async function handleClose(auction) {
    if (!confirm(`Encerrar "${auction.title}"? O maior lance será considerado vencedor.`)) return
    setActionId(auction.id)
    const { error } = await supabase
      .from('auctions')
      .update({ status: 'ended' })
      .eq('id', auction.id)
    setActionId(null)
    if (error) { showToast('Erro ao encerrar: ' + error.message, 'error'); return }
    setAuctions(prev => prev.map(a =>
      a.id === auction.id ? { ...a, status: 'ended' } : a
    ))
    showToast('Leilão encerrado.')
  }

  async function handleRelist(auction) {
    setActionId(auction.id)
    const { error } = await supabase
      .from('auctions')
      .insert({
        seller_id:     company.id,
        title:         auction.title,
        description:   auction.description,
        category:      auction.category,
        condition:     auction.condition,
        min_price:     auction.min_price,
        bid_increment: auction.bid_increment,
        duration_days: auction.duration_days,
        ends_at:       calcEndsAt(auction.duration_days ?? 7),
        image_url:     auction.image_url,
        status:        'pending_moderation',
      })
    setActionId(null)
    if (error) { showToast('Erro ao relançar: ' + error.message, 'error'); return }
    showToast('Leilão relançado para moderação!')
    navigate('/painel/leiloes')
  }

  const draftCount = auctions.filter(a => a.status === 'draft').length

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-float ${
              toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 text-white'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Meus leilões</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {counts.active} ativo{counts.active !== 1 ? 's' : ''} · {counts.ended} encerrado{counts.ended !== 1 ? 's' : ''} · {counts.draft} rascunho{counts.draft !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button onClick={() => navigate('/painel/novo')} className="btn-primary text-sm">
          + Novo leilão
        </button>
      </div>

      {/* Alerta de rascunhos pendentes */}
      {draftCount > 0 && !loading && (
        <div className="alert-info mb-4 text-sm">
          <Zap size={15} className="shrink-0 mt-0.5" />
          <span>
            Você tem <strong>{draftCount} rascunho{draftCount !== 1 ? 's' : ''}</strong> não publicado{draftCount !== 1 ? 's' : ''}.
            Clique em <strong>Publicar</strong> na linha correspondente para enviá-los à moderação.
          </span>
        </div>
      )}

      {/* Tabela — scrollável no mobile */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Equipamento', 'Preço mín.', 'Lance atual', 'Lances', 'Encerra em', 'Status', 'Ações'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array(4).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={7}><SkeletonRow /></td></tr>
                  ))
                : auctions.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Gavel size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 mb-3">Nenhum leilão ainda.</p>
                        <button onClick={() => navigate('/painel/novo')} className="btn-primary text-xs">
                          Criar o primeiro leilão
                        </button>
                      </td>
                    </tr>
                  )
                  : auctions.map(a => {
                      const isActing = actionId === a.id
                      const faded = ['ended', 'unsold', 'cancelled', 'sold'].includes(a.status)
                      return (
                        <tr
                          key={a.id}
                          className={`transition-colors ${faded ? 'opacity-55' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px]">
                            <span className="truncate block">{a.title}</span>
                            {a.category && (
                              <span className="text-xs text-gray-400 block mt-0.5">{a.category}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {formatCurrency(a.min_price)}
                          </td>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap">
                            {a.currentBid
                              ? <span className="text-brand-600">{formatCurrency(a.currentBid)}</span>
                              : <span className="text-gray-300 font-normal">—</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {a.totalBids > 0
                              ? <span className="font-semibold text-gray-800">{a.totalBids}</span>
                              : <span className="text-gray-300">0</span>}
                          </td>
                          <td className="px-4 py-3">
                            {a.ends_at
                              ? <CountdownTimer endsAt={a.ends_at} />
                              : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={a.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isActing ? (
                                <Loader2 size={15} className="animate-spin text-gray-400" />
                              ) : (
                                <>
                                  {a.status === 'draft' && (
                                    <button
                                      onClick={() => handlePublish(a)}
                                      className="btn-primary btn-sm"
                                    >
                                      Publicar
                                    </button>
                                  )}
                                  {a.status === 'active' && (
                                    <>
                                      <button
                                        onClick={() => navigate(`/leilao/${a.id}`)}
                                        className="btn-outline btn-sm"
                                      >
                                        <ExternalLink size={11} /> Ver
                                      </button>
                                      <button
                                        onClick={() => handleClose(a)}
                                        className="btn-sm text-red-600 border border-red-200 hover:bg-red-50 bg-white rounded-lg px-2 py-1"
                                      >
                                        <Ban size={11} /> Encerrar
                                      </button>
                                    </>
                                  )}
                                  {a.status === 'unsold' && (
                                    <button
                                      onClick={() => handleRelist(a)}
                                      className="btn-outline btn-sm gap-1"
                                    >
                                      <RefreshCw size={11} /> Relançar
                                    </button>
                                  )}
                                  {['ended', 'sold'].includes(a.status) && (
                                    <button
                                      onClick={() => navigate(`/leilao/${a.id}`)}
                                      className="btn-outline btn-sm"
                                    >
                                      <ExternalLink size={11} /> Ver
                                    </button>
                                  )}
                                  {a.status === 'pending_moderation' && (
                                    <span className="text-xs text-amber-600 font-medium">Aguardando revisão</span>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Bids ──────────────────────────────────────────────────
export function Bids() {
  const { company } = useAuth()
  const navigate = useNavigate()
  const [auctions, setAuctions]   = useState([])
  const [bids, setBids]           = useState({}) // { auctionId: bid[] }
  const [expanded, setExpanded]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [newBidId, setNewBidId]   = useState(null)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!company) return

    async function load() {
      const { data: aData } = await supabase
        .from('auctions')
        .select('id, title, status, min_price, ends_at, category, bid_increment')
        .eq('seller_id', company.id)
        .in('status', ['active', 'ended', 'sold', 'pending_moderation'])
        .order('created_at', { ascending: false })

      if (!aData?.length) { setLoading(false); return }
      setAuctions(aData)

      const ids = aData.map(a => a.id)
      const { data: bData } = await supabase
        .from('bids')
        .select('id, auction_id, amount, created_at, companies!bidder_id(razao_social, cnpj_verified)')
        .in('auction_id', ids)
        .order('amount', { ascending: false })

      const grouped = {}
      aData.forEach(a => { grouped[a.id] = [] })
      bData?.forEach(b => { if (grouped[b.auction_id]) grouped[b.auction_id].push(b) })
      setBids(grouped)

      // Abre o primeiro que tem lances, ou o primeiro de qualquer forma
      const firstWithBids = aData.find(a => grouped[a.id]?.length > 0)
      setExpanded((firstWithBids ?? aData[0])?.id ?? null)
      setLoading(false)
    }

    load()

    // Realtime — novos lances chegam aqui
    channelRef.current = supabase
      .channel(`seller-bids-${company.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, async (payload) => {
        const bid = payload.new
        // Busca dados da empresa do licitante
        const { data: cData } = await supabase
          .from('companies')
          .select('razao_social, cnpj_verified')
          .eq('id', bid.bidder_id)
          .single()
        const enriched = { ...bid, companies: cData ?? null }

        setBids(prev => {
          if (!(bid.auction_id in prev)) return prev
          const list = [enriched, ...prev[bid.auction_id]]
          // ordena por valor desc
          list.sort((a, b) => b.amount - a.amount)
          return { ...prev, [bid.auction_id]: list }
        })
        setNewBidId(bid.id)
        setTimeout(() => setNewBidId(null), 3000)
      })
      .subscribe()

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [company])

  const totalBids  = Object.values(bids).reduce((s, arr) => s + arr.length, 0)
  const maxBid     = Math.max(0, ...Object.values(bids).flat().map(b => b.amount))
  const auctionsWithBids = auctions.filter(a => (bids[a.id]?.length ?? 0) > 0)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-4 h-14 animate-pulse bg-gray-100" />
        ))}
      </div>
    )
  }

  if (auctions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp size={28} className="text-gray-300" />
        </div>
        <h2 className="text-base font-bold text-gray-700 mb-1">Nenhum leilão ativo ainda</h2>
        <p className="text-sm text-gray-400 mb-6">
          Publique seu primeiro leilão para começar a receber lances.
        </p>
        <button onClick={() => navigate('/painel/novo')} className="btn-primary">
          Criar leilão
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Lances recebidos</h1>
        <p className="text-sm text-gray-400 mt-0.5">Acompanhe em tempo real quem está disputando seus leilões</p>
      </div>

      {/* Métricas resumo */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total de lances', value: String(totalBids), sub: 'em todos os leilões' },
          { label: 'Com lances ativos', value: String(auctionsWithBids.length), sub: `de ${auctions.length} leilões` },
          { label: 'Maior lance', value: maxBid > 0 ? formatCurrency(maxBid) : '—', sub: 'até agora', green: true },
        ].map(({ label, value, sub, green }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-lg font-bold leading-none ${green ? 'text-brand-600' : 'text-gray-900'}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Indicator realtime */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
        </span>
        <span className="text-xs text-gray-500 font-medium">Atualização em tempo real</span>
      </div>

      {/* Accordion por leilão */}
      <div className="space-y-2">
        {auctions.map(auction => {
          const auctionBids = bids[auction.id] ?? []
          const topBid      = auctionBids[0]
          const isOpen      = expanded === auction.id

          return (
            <div key={auction.id} className="card overflow-hidden">
              {/* Cabeçalho do leilão */}
              <button
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : auction.id)}
              >
                {/* Status dot */}
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  auction.status === 'active' ? 'bg-brand-500' :
                  auction.status === 'ended'  ? 'bg-blue-400'  :
                  auction.status === 'sold'   ? 'bg-brand-500' : 'bg-gray-300'
                }`} />

                {/* Título */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{auction.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400">{auction.category}</span>
                    {auction.status === 'active' && auction.ends_at && (
                      <CountdownTimer endsAt={auction.ends_at} />
                    )}
                  </div>
                </div>

                {/* Resumo de lances */}
                <div className="text-right shrink-0">
                  {auctionBids.length > 0 ? (
                    <>
                      <p className="text-sm font-bold text-brand-600">{formatCurrency(topBid.amount)}</p>
                      <p className="text-xs text-gray-400">{auctionBids.length} lance{auctionBids.length !== 1 ? 's' : ''}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-400">Nenhum lance</p>
                      <p className="text-xs text-gray-300">Mín. {formatCurrency(auction.min_price)}</p>
                    </>
                  )}
                </div>

                {/* Chevron */}
                <span className="text-gray-400 shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {/* Lista de lances */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="border-t border-gray-100">
                      {auctionBids.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Gavel size={24} className="text-gray-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Ainda não há lances neste leilão.</p>
                          <p className="text-xs text-gray-300 mt-0.5">
                            Mínimo: {formatCurrency(auction.min_price)} · Incremento: {formatCurrency(auction.bid_increment ?? 100)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          {/* Cabeçalho da tabela */}
                          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 px-4 py-2 bg-gray-50 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Empresa</span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Lance</span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Quando</span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">CNPJ</span>
                          </div>
                          {auctionBids.map((bid, idx) => (
                            <motion.div
                              key={bid.id}
                              initial={bid.id === newBidId ? { backgroundColor: '#dcfce7' } : {}}
                              animate={{ backgroundColor: '#ffffff' }}
                              transition={{ duration: 2 }}
                              className={`grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-center px-4 py-3 border-b border-gray-50 last:border-0 ${
                                idx === 0 ? 'bg-brand-50/50' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {idx === 0 && (
                                  <span className="text-2xs font-black text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded-full shrink-0">1º</span>
                                )}
                                <span className="text-sm text-gray-800 font-medium truncate">
                                  {bid.companies?.razao_social ?? 'Empresa'}
                                </span>
                              </div>
                              <span className={`text-sm font-bold tabular-nums ${idx === 0 ? 'text-brand-600' : 'text-gray-700'}`}>
                                {formatCurrency(bid.amount)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true, locale: ptBR })}
                              </span>
                              <span>
                                {bid.companies?.cnpj_verified
                                  ? <ShieldCheck size={13} className="text-brand-500" title="CNPJ verificado" />
                                  : <ShieldOff size={13} className="text-gray-300" title="CNPJ não verificado" />}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Profile ───────────────────────────────────────────────
export function Profile() {
  const { company } = useAuth()
  const [form, setForm]     = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const initials = company?.razao_social?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() ?? '??'

  useEffect(() => {
    if (company) setForm({
      razao_social: company.razao_social ?? '',
      email:        company.email ?? '',
      phone:        company.phone ?? '',
      city:         company.city ?? '',
      state:        company.state ?? '',
    })
  }, [company])

  const handleSave = async () => {
    if (!company || !form) return
    setSaving(true)
    const { error } = await supabase
      .from('companies')
      .update({
        phone: form.phone,
        city:  form.city,
        state: form.state,
      })
      .eq('id', company.id)
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
  }

  if (!form) return null

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-lg font-semibold mb-1">Perfil da empresa</h1>
      <p className="text-sm text-gray-400 mb-6">Seus dados na plataforma newcycle.ia</p>

      <div className="card p-6">
        {/* Avatar + status */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-lg font-bold text-brand-700">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{company?.razao_social ?? '—'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{company?.cnpj ?? ''}</p>
            {company?.cnpj_verified
              ? <span className="badge-green text-xs mt-1.5 inline-flex"><ShieldCheck size={10} /> Empresa verificada</span>
              : <span className="badge-amber text-xs mt-1.5 inline-flex"><Clock size={10} /> Aguardando verificação</span>
            }
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Campos somente leitura */}
          {[
            ['Razão social', form.razao_social, true],
            ['CNPJ',          company?.cnpj, true],
            ['E-mail',        form.email, true],
          ].map(([label, value]) => (
            <div key={label}>
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input className="form-input" value={value ?? ''} disabled readOnly />
            </div>
          ))}
          {/* Campos editáveis */}
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-1">Telefone</label>
            <input
              className="form-input"
              value={form.phone ?? ''}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-1">Cidade</label>
            <input
              className="form-input"
              value={form.city ?? ''}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              placeholder="São Paulo"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-1">Estado</label>
            <input
              className="form-input"
              value={form.state ?? ''}
              onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
              placeholder="SP"
              maxLength={2}
            />
          </div>
        </div>

        {saved && (
          <div className="alert-success mb-4">
            <CheckCircle2 size={14} />
            Dados salvos com sucesso!
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving
            ? <><Loader2 size={14} className="animate-spin" /> Salvando...</>
            : <><Save size={14} /> Salvar alterações</>}
        </button>
      </div>
    </div>
  )
}

// ── Financial ─────────────────────────────────────────────
export function Financial() {
  const { company } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!company) return
    supabase
      .from('transactions')
      .select('*, auctions(title), companies!buyer_id(razao_social)')
      .eq('seller_id', company.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTransactions(data ?? []); setLoading(false) })
  }, [company])

  const total   = transactions.reduce((s, t) => s + (t.net_amount ?? 0), 0)
  const pending = transactions.filter(t => t.status === 'pending_payment').reduce((s, t) => s + (t.net_amount ?? 0), 0)
  const paid    = transactions.filter(t => t.status === 'paid').reduce((s, t) => s + (t.net_amount ?? 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-lg font-semibold mb-1">Financeiro</h1>
      <p className="text-sm text-gray-400 mb-6">Repasses e comissões dos leilões encerrados</p>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total líquido',       value: formatCurrency(total),   color: 'text-brand-600', sub: `após comissão de ${(COMMISSION_RATE * 100).toFixed(0)}%` },
          { label: 'A receber',           value: formatCurrency(pending), color: 'text-amber-600', sub: 'pagamentos pendentes' },
          { label: 'Já repassado',        value: formatCurrency(paid),    color: 'text-gray-900',  sub: 'pagamentos confirmados' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-gray-400 mb-2">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Info sobre comissão */}
      <div className="alert-info mb-5 text-xs">
        <AlertCircle size={13} className="shrink-0 mt-0.5" />
        <span>
          A plataforma retém <strong>{(COMMISSION_RATE * 100).toFixed(0)}%</strong> de comissão sobre o valor final de cada venda.
          O repasse é feito em até 5 dias úteis após confirmação do pagamento.
        </span>
      </div>

      {/* Tabela de transações */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Histórico de transações</p>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={20} className="animate-spin text-gray-300 mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 size={28} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Nenhuma transação ainda.</p>
            <p className="text-xs text-gray-300 mt-1">As transações aparecem quando um leilão é concluído.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Equipamento', 'Comprador', 'Bruto', 'Comissão', 'Líquido', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium truncate max-w-[160px]">{t.auctions?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[120px]">{t.companies?.razao_social ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(t.gross_amount)}</td>
                    <td className="px-4 py-3 text-red-500">−{formatCurrency(t.commission_amount ?? 0)}</td>
                    <td className="px-4 py-3 font-semibold text-brand-600">{formatCurrency(t.net_amount ?? 0)}</td>
                    <td className="px-4 py-3">
                      {t.status === 'paid'
                        ? <span className="badge-green">Repassado</span>
                        : <span className="badge-amber">Aguardando</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAuctions
