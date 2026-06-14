import { useNavigate } from 'react-router-dom'
import { TrendingUp, Clock } from 'lucide-react'
import CountdownTimer from './CountdownTimer'

const CAT_BG = {
  'TI & Informática': 'from-blue-100 to-indigo-100',
  'Escritório':       'from-amber-100 to-yellow-50',
  'Industrial':       'from-slate-100 to-gray-200',
  'AV & Telecom':     'from-violet-100 to-purple-50',
  'Saúde':            'from-teal-100 to-emerald-50',
}
const CAT_EMOJI = {
  'TI & Informática': '💻', 'Escritório': '🗂️',
  'Industrial': '⚙️', 'AV & Telecom': '📡', 'Saúde': '🏥',
}

function urgencyBar(endsAt) {
  const s = (new Date(endsAt) - new Date()) / 1000
  if (s <= 0)    return 'bg-gray-300'
  if (s < 3600)  return 'bg-red-500'
  if (s < 86400) return 'bg-amber-400'
  return 'bg-brand-500'
}

export default function AuctionCard({ auction }) {
  const navigate = useNavigate()
  const {
    id, title, category,
    images, image_url,
    minPrice, currentBid, totalBids = 0,
    endsAt, seller,
  } = auction

  const img  = image_url || images?.[0] || null
  const bg   = CAT_BG[category] ?? 'from-gray-100 to-gray-200'
  const secs = (new Date(endsAt) - new Date()) / 1000
  const hot  = totalBids >= 4

  return (
    <article
      onClick={() => navigate(`/leilao/${id}`)}
      className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Faixa de urgência */}
      <div className={`h-0.5 w-full shrink-0 ${urgencyBar(endsAt)}`} />

      {/* Imagem */}
      <div className={`relative h-44 bg-gradient-to-br ${bg} flex items-center justify-center shrink-0`}>
        {img
          ? <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <span className="text-5xl select-none">{CAT_EMOJI[category] ?? '📦'}</span>
        }

        {/* Overlay gradiente bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Timer sobreposto */}
        <div className="absolute bottom-2.5 left-2.5">
          <CountdownTimer endsAt={endsAt} />
        </div>

        {/* Badge lances */}
        <div className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full shadow-sm ${
          hot
            ? 'bg-red-500 text-white'
            : totalBids > 0
              ? 'bg-brand-600 text-white'
              : 'bg-white/90 text-gray-500'
        }`}>
          <TrendingUp size={9} />
          {totalBids > 0 ? `${totalBids} lances` : 'Sem lances'}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Título */}
        <div>
          <p className="text-2xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {category ?? 'Equipamento'}
          </p>
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>
          {seller?.name && (
            <p className="text-2xs text-gray-400 mt-1 truncate">{seller.name}</p>
          )}
        </div>

        {/* Preços */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          {currentBid ? (
            <>
              <p className="text-2xs text-gray-400 mb-0.5">Lance atual</p>
              <p className="text-lg font-extrabold text-brand-600 leading-none">
                {currentBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-2xs text-gray-400 mt-1">
                Mín. {minPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xs text-gray-400 mb-0.5">Preço mínimo</p>
              <p className="text-lg font-extrabold text-gray-700 leading-none">
                {minPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-2xs text-brand-600 font-semibold mt-1">Seja o primeiro →</p>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
