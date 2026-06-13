import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { formatCurrency } from '../../services/auctionService'
import { SkeletonRow } from '../../components/Skeleton'

const FILTER_TABS = [
  { key: 'pending_moderation', label: 'Pendentes' },
  { key: 'active',             label: 'Ativos' },
  { key: 'ended',              label: 'Encerrados' },
]

export default function AuctionModeration() {
  const navigate = useNavigate()
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('pending_moderation')
  const [acting, setActing]     = useState(null)

  async function load(status) {
    setLoading(true)
    const { data } = await supabase
      .from('auctions')
      .select('*, companies(razao_social, cnpj, cnpj_verified)')
      .eq('status', status)
      .order('created_at', { ascending: false })
    setAuctions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load(filter) }, [filter])

  async function moderate(id, action) {
    setActing(id)
    const newStatus = action === 'approve' ? 'active' : 'cancelled'
    await supabase.from('auctions').update({ status: newStatus }).eq('id', id)
    setAuctions(prev => prev.filter(a => a.id !== id))
    setActing(null)
  }

  const pending = auctions.filter(a => a.status === 'pending_moderation')

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Moderação de leilões</h1>
          <p className="text-sm text-gray-400 mt-0.5">Aprovar ou rejeitar anúncios submetidos pelas empresas</p>
        </div>
        {filter === 'pending_moderation' && !loading && pending.length > 0 && (
          <span className="badge-amber">{pending.length} aguardando</span>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-1 mb-5 p-1 bg-gray-100 rounded-xl w-fit">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Equipamento','Empresa','Mínimo','Categoria','Enviado em','Ações'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6}><SkeletonRow /></td></tr>)
                : auctions.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                        Nenhum leilão nesta categoria.
                      </td>
                    </tr>
                  )
                  : auctions.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-[200px] truncate">{a.title}</p>
                        {a.description && (
                          <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{a.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 truncate max-w-[140px]">{a.companies?.razao_social ?? '—'}</p>
                        <div className="mt-0.5">
                          {a.companies?.cnpj_verified
                            ? <span className="badge-green text-[10px]">✓ Verificada</span>
                            : <span className="badge-amber text-[10px]">Não verificada</span>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(a.min_price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge-gray capitalize">{a.category ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {new Date(a.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Ver detalhe */}
                          <button
                            onClick={() => navigate(`/leilao/${a.id}`)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Ver leilão"
                          >
                            <ExternalLink size={14} />
                          </button>
                          {filter === 'pending_moderation' && (
                            <>
                              <button
                                onClick={() => moderate(a.id, 'approve')}
                                disabled={acting === a.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle size={13} />
                                Aprovar
                              </button>
                              <button
                                onClick={() => moderate(a.id, 'reject')}
                                disabled={acting === a.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                <XCircle size={13} />
                                Rejeitar
                              </button>
                            </>
                          )}
                        </div>
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
