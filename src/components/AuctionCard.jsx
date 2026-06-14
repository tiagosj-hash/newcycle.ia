import { useNavigate } from 'react-router-dom'
import { TrendingUp, Flame, ArrowRight } from 'lucide-react'
import CountdownTimer from './CountdownTimer'

const CAT_BG = {
  'TI & Informática': 'from-blue-100 via-blue-50 to-indigo-100',
  'Escritório':       'from-amber-100 via-yellow-50 to-orange-100',
  'Industrial':       'from-slate-200 via-gray-100 to-slate-100',
  'AV & Telecom':     'from-violet-100 via-purple-50 to-fuchsia-100',
  'Saúde':            'from-teal-100 via-emerald-50 to-green-100',
}
const CAT_EMOJI = {
  'TI & Informática': '💻', 'Escritório': '🗂️',
  'Industrial': '⚙️', 'AV & Telecom': '📡', 'Saúde': '🏥',
}
const CAT_COLOR = {
  'TI & Informática': 'text-blue-600',
  'Escritório':       'text-amber-600',
  'Industrial':       'text-slate-600',
  'AV & Telecom':     'text-violet-600',
  'Saúde':            'text-teal-600',
}

export default function AuctionCard({ auction }) {
  const navigate = useNavigate()
  const { id, title, category, images, image_url, minPrice, currentBid, totalBids = 0, endsAt, seller } = auction

  const img  = image_url || images?.[0] || null
  const bg   = CAT_BG[category]  ?? 'from-gray-100 to-gray-200'
  const hot  = totalBids >= 4
  const secs = (new Date(endsAt) - new Date()) / 1000
  const urgent = secs < 3600

  const fmt = (n) => n?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

  return (
    <article
      onClick={() => navigate(`/leilao/${id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#d1d5db'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#e5e7eb'
      }}
    >
      {/* Image area */}
      <div className={`relative h-48 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden shrink-0`}>
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl select-none opacity-80">{CAT_EMOJI[category] ?? '📦'}</span>
        )}

        {/* Dark gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Timer — bottom left */}
        <div className="absolute bottom-3 left-3">
          <CountdownTimer endsAt={endsAt} />
        </div>

        {/* Bid badge — top right */}
        <div className={`absolute top-3 right-3 flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${
          hot
            ? 'bg-red-500/90 text-white'
            : totalBids > 0
              ? 'bg-brand-600/90 text-white'
              : 'bg-black/30 text-white/80'
        }`}>
          {hot ? <Flame size={9} /> : <TrendingUp size={9} />}
          {totalBids > 0 ? `${totalBids} lances` : 'Aberto'}
        </div>

        {/* Hot overlay */}
        {hot && (
          <div className="absolute top-3 left-3">
            <span className="text-2xs font-black uppercase tracking-wider text-amber-400 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              🔥 Hot
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">

        {/* Category */}
        <p className={`text-2xs font-bold uppercase tracking-widest mb-1.5 ${CAT_COLOR[category] ?? 'text-gray-400'}`}>
          {category ?? 'Equipamento'}
        </p>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
          {title}
        </h3>

        {/* Seller */}
        {seller?.name && (
          <p className="text-2xs text-gray-400 truncate mb-3">{seller.name}</p>
        )}

        {/* Price section */}
        <div className="mt-auto">
          <div className="h-px bg-gray-100 mb-3" />
          {currentBid ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xs text-gray-400 font-medium mb-0.5">Lance atual</p>
                <p className="text-xl font-extrabold text-brand-600 leading-none tabular-nums">
                  {fmt(currentBid)}
                </p>
                <p className="text-2xs text-gray-400 mt-1">Mín. {fmt(minPrice)}</p>
              </div>
              <span className="text-2xs font-bold text-gray-400 group-hover:text-brand-600 transition-colors flex items-center gap-0.5">
                Ver <ArrowRight size={10} />
              </span>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xs text-gray-400 font-medium mb-0.5">Preço mínimo</p>
                <p className="text-xl font-extrabold text-gray-800 leading-none tabular-nums">
                  {fmt(minPrice)}
                </p>
                <p className="text-2xs text-brand-600 font-semibold mt-1">Faça o primeiro lance</p>
              </div>
              <span className="text-2xs font-bold text-brand-600 flex items-center gap-0.5">
                Dar lance <ArrowRight size={10} />
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
