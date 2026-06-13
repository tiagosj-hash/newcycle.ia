import { useState, useEffect } from 'react'
import { Search, Loader2, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuctionCard from '../components/AuctionCard'
import { SkeletonCard } from '../components/Skeleton'
import { supabase } from '../services/supabase'

const CATEGORIES = ['Todos', 'TI & Informática', 'Escritório', 'Industrial', 'AV & Telecom', 'Saúde']

const CAT_EMOJI = {
  'Todos':          '🔍',
  'TI & Informática': '💻',
  'Escritório':     '🗂️',
  'Industrial':     '⚙️',
  'AV & Telecom':   '📡',
  'Saúde':          '🏥',
}

export default function Browse() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [cat, setCat]           = useState('Todos')
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('auctions')
        .select(`
          id, title, category, images, image_url, min_price, ends_at, status,
          companies!seller_id ( razao_social ),
          bids ( amount )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (cat !== 'Todos') query = query.eq('category', cat)

      const { data, error } = await query
      if (!error) {
        setAuctions(data.map(a => ({
          id:         a.id,
          title:      a.title,
          category:   a.category,
          images:     a.images ?? [],
          image_url:  a.image_url,
          minPrice:   a.min_price,
          currentBid: a.bids?.length ? Math.max(...a.bids.map(b => b.amount)) : null,
          totalBids:  a.bids?.length ?? 0,
          endsAt:     a.ends_at,
          seller:     { name: a.companies?.razao_social ?? '—' },
        })))
      }
      setLoading(false)
    }
    load()
  }, [cat])

  const filtered = auctions.filter(a => {
    if (!search) return true
    const q = search.toLowerCase()
    return a.title.toLowerCase().includes(q) || a.seller.name.toLowerCase().includes(q)
  })

  const hasFilter = search || cat !== 'Todos'

  return (
    <div>
      {/* Header banner */}
      <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 px-6 pt-10 pb-14">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">
            Equipamentos corporativos
          </h1>
          <p className="text-emerald-300/70 text-sm mb-6">
            Leilões ativos · Compradores e vendedores com CNPJ verificado
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/95 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-lg"
              placeholder="Buscar equipamento, empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={13} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-6">
        {/* Filtros de categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border whitespace-nowrap transition-all font-medium shrink-0 shadow-sm ${
                cat === c
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{CAT_EMOJI[c]}</span> {c}
            </button>
          ))}
        </div>

        {/* Barra de resultados */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading
              ? 'Carregando...'
              : <><span className="font-semibold text-gray-900">{filtered.length}</span> {filtered.length === 1 ? 'resultado' : 'resultados'}{cat !== 'Todos' ? ` em ${cat}` : ''}</>
            }
          </p>
          {hasFilter && !loading && (
            <button
              onClick={() => { setSearch(''); setCat('Todos') }}
              className="text-xs text-emerald-600 font-medium hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              <X size={11} /> Limpar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">
              {search ? `Nenhum resultado para "${search}"` : 'Nenhum leilão nessa categoria'}
            </p>
            <p className="text-gray-400 text-sm mb-6">Tente outros termos ou remova os filtros</p>
            <button onClick={() => { setSearch(''); setCat('Todos') }} className="btn-primary text-sm">
              Ver todos os leilões
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
            {filtered.map(a => <AuctionCard key={a.id} auction={a} />)}
          </div>
        )}
      </div>
    </div>
  )
}
