import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CountdownTimer from '../../components/CountdownTimer'
import { SkeletonRow } from '../../components/Skeleton'
import { formatCurrency, COMMISSION_RATE } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'

// ── STATUS helpers ────────────────────────────────────────
const STATUS_BADGE = {
  active:             <span className="badge-green">Ativo</span>,
  draft:              <span className="badge-gray">Rascunho</span>,
  pending_moderation: <span className="badge-amber">Em análise</span>,
  ended:              <span className="badge-blue">Encerrado</span>,
  sold:               <span className="badge-green">Vendido</span>,
  unsold:             <span className="badge-gray">Sem venda</span>,
  cancelled:          <span className="badge-red">Cancelado</span>,
}

// ── MyAuctions ────────────────────────────────────────────
export function MyAuctions() {
  const navigate = useNavigate()
  const { company } = useAuth()
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading]   = useState(true)

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
    ended:  auctions.filter(a => ['ended','sold'].includes(a.status)).length,
    draft:  auctions.filter(a => ['draft','pending_moderation'].includes(a.status)).length,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
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

      {/* Tabela — scrollável no mobile */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Equipamento', 'Mínimo', 'Lance atual', 'Lances', 'Encerra em', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array(4).fill(0).map((_, i) => <tr key={i}><td colSpan={7}><SkeletonRow /></td></tr>)
                : auctions.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                        Nenhum leilão ainda.{' '}
                        <button onClick={() => navigate('/painel/novo')} className="text-emerald-600 font-medium hover:underline">
                          Criar o primeiro
                        </button>
                      </td>
                    </tr>
                  )
                  : auctions.map(a => (
                      <tr key={a.id} className={`hover:bg-gray-50 transition-colors ${['ended','unsold','cancelled'].includes(a.status) ? 'opacity-60' : ''}`}>
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{a.title}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatCurrency(a.min_price)}</td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">
                          {a.currentBid
                            ? <span className="text-emerald-600">{formatCurrency(a.currentBid)}</span>
                            : <span className="text-gray-300 font-normal">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{a.totalBids}</td>
                        <td className="px-4 py-3">
                          {a.ends_at ? <CountdownTimer endsAt={a.ends_at} /> : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">{STATUS_BADGE[a.status] ?? <span className="badge-gray">{a.status}</span>}</td>
                        <td className="px-4 py-3">
                          {a.status === 'draft' && <button className="btn-sm">Publicar</button>}
                          {a.status === 'unsold' && <button onClick={() => navigate('/painel/novo')} className="btn-sm">Relançar</button>}
                          {['active','ended','sold'].includes(a.status) && (
                            <button onClick={() => navigate(`/leilao/${a.id}`)} className="btn-sm">Ver</button>
                          )}
                        </td>
                      </tr>
                    ))
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
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-lg font-semibold mb-1">Lances recebidos</h1>
      <p className="text-sm text-gray-400 mb-6">Acompanhe em tempo real quem está disputando seus leilões</p>
      <div className="card p-5">
        <p className="text-sm text-gray-400 text-center py-8">
          Selecione um leilão em <button className="text-emerald-600 font-medium hover:underline">Meus leilões</button> para ver os lances.
        </p>
      </div>
    </div>
  )
}

// ── Profile ───────────────────────────────────────────────
export function Profile() {
  const { company } = useAuth()
  const initials = company?.razao_social?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() ?? '??'

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-lg font-semibold mb-1">Perfil da empresa</h1>
      <p className="text-sm text-gray-400 mb-6">Seus dados na plataforma newcycle.ia</p>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-lg font-bold text-emerald-700">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{company?.razao_social ?? '—'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{company?.cnpj ?? ''}</p>
            {company?.cnpj_verified
              ? <span className="badge-green text-xs mt-1.5 inline-flex">✓ Empresa verificada</span>
              : <span className="badge-amber text-xs mt-1.5 inline-flex">Aguardando verificação</span>
            }
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['Razão social', company?.razao_social, false],
            ['CNPJ', company?.cnpj, true],
            ['E-mail', company?.email, false],
            ['Telefone', company?.phone, false],
            ['Cidade', company?.city, false],
            ['Estado', company?.state, false],
          ].map(([label, value, disabled]) => (
            <div key={label}>
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input className="form-input" defaultValue={value ?? ''} disabled={disabled} />
            </div>
          ))}
        </div>
        <button className="btn-primary mt-5">Salvar alterações</button>
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

  const total  = transactions.reduce((s, t) => s + (t.net_amount ?? 0), 0)
  const pending = transactions.filter(t => t.status === 'pending_payment').reduce((s, t) => s + (t.net_amount ?? 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-lg font-semibold mb-1">Financeiro</h1>
      <p className="text-sm text-gray-400 mb-6">Repasses e comissões dos leilões encerrados</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          ['Total recebido',       formatCurrency(total),   'text-emerald-600'],
          ['A receber',            formatCurrency(pending), 'text-gray-900'],
          ['Comissão plataforma',  `${(COMMISSION_RATE*100).toFixed(0)}%`, 'text-gray-900'],
        ].map(([label, value, color]) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-gray-400 mb-2">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-sm font-semibold text-gray-900">
          Histórico de transações
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Carregando...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Nenhuma transação ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Equipamento','Comprador','Valor bruto','Comissão','Líquido','Status'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium truncate max-w-[160px]">{t.auctions?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{t.companies?.razao_social ?? '—'}</td>
                    <td className="px-4 py-3">{formatCurrency(t.gross_amount)}</td>
                    <td className="px-4 py-3 text-red-500">−{formatCurrency(t.commission_amount ?? 0)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(t.net_amount ?? 0)}</td>
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
