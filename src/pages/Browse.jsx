import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuctionCard from '../components/AuctionCard'
import { SkeletonCard } from '../components/Skeleton'
import { supabase } from '../services/supabase'

const CATS = [
  { key: 'Todos',           label: 'Todos',             emoji: null },
  { key: 'TI & Informática', label: 'TI & Informática', emoji: '💻' },
  { key: 'Escritório',      label: 'Escritório',        emoji: '🗂️' },
  { key: 'Industrial',      label: 'Industrial',        emoji: '⚙️' },
  { key: 'AV & Telecom',    label: 'AV & Telecom',      emoji: '📡' },
  { key: 'Saúde',           label: 'Saúde',             emoji: '🏥' },
]

export default function Browse() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [cat, setCat]           = useState('Todos')
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      setLoading(true)
      let q = supabase
        .from('auctions')
        .select(`id, title, category, images, image_url, min_price, ends_at, status,
                 companies!seller_id(razao_social), bids(amount)`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (cat !== 'Todos') q = q.eq('category', cat)

      const { data } = await q
      setAuctions((data ?? []).map(a => ({
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
      setLoading(false)
    }
    load()
  }, [cat])

  const filtered = search
    ? auctions.filter(a => {
        const q = search.toLowerCase()
        return a.title.toLowerCase().includes(q) || a.seller.name.toLowerCase().includes(q)
      })
    : auctions

  return (
    <div className="bg-white min-h-screen">

      {/* Header fixo */}
      <div className="border-b border-gray-100 bg-white sticky top-[56px] z-30">
        <div className="container-page py-4">

          {/* Título + busca */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className="input-icon pr-8"
                placeholder="Buscar equipamento ou empresa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
            <button className="btn-outline btn-sm gap-2 hidden sm:flex shrink-0">
              <SlidersHorizontal size={13} /> Filtros
            </button>
          </div>

          {/* Tabs de categoria */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {CATS.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => setCat(key)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 ${
                  cat === key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {emoji && <span>{emoji}</span>}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-page py-6 pb-16">

        {/* Contagem */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? (
              <span className="inline-block w-24 h-4 bg-gray-100 rounded animate-pulse" />
            ) : (
              <><strong className="text-gray-900">{filtered.length}</strong> {filtered.length === 1 ? 'resultado' : 'resultados'}</>
            )}
          </p>
          {(search || cat !== 'Todos') && !loading && (
            <button
              onClick={() => { setSearch(''); setCat('Todos') }}
              className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1"
            >
              <X size={11} /> Limpar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-700 mb-1">
              {search ? `Sem resultados para "${search}"` : 'Nenhum leilão nessa categoria'}
            </p>
            <p className="text-sm text-gray-400 mb-6">Tente outros termos ou outra categoria</p>
            <button onClick={() => { setSearch(''); setCat('Todos') }} className="btn-primary">
              Ver todos os leilões
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map(a => <AuctionCard key={a.id} auction={a} />)}
          </motion.div>
        )}
      </div>
    </div>
  )
}
