import { useNavigate } from 'react-router-dom'
import { TrendingUp, Clock } from 'lucide-react'
import CountdownTimer from './CountdownTimer'

const CATEGORY_EMOJI = {
  'TI & Informática': '💻',
  'Escritório':       '🗂️',
  'Industrial':       '⚙️',
  'AV & Telecom':     '📡',
  'Saúde':            '🏥',
}

const CATEGORY_GRADIENT = {
  'TI & Informática': 'from-blue-100 to-slate-200',
  'Escritório':       'from-amber-100 to-orange-100',
  'Industrial':       'from-gray-200 to-slate-200',
  'AV & Telecom':     'from-violet-100 to-blue-100',
  'Saúde':            'from-emerald-100 to-teal-100',
}

const CATEGORY_TEXT = {
  'TI & Informática': 'text-blue-700 bg-blue-50 border-blue-200',
  'Escritório':       'text-amber-700 bg-amber-50 border-amber-200',
  'Industrial':       'text-gray-700 bg-gray-100 border-gray-200',
  'AV & Telecom':     'text-violet-700 bg-violet-50 border-violet-200',
  'Saúde':            'text-teal-700 bg-teal-50 border-teal-200',
}

function urgencyColor(endsAt) {
  const secs = (new Date(endsAt) - new Date()) / 1000
  if (secs <= 0)    return 'bg-gray-300'
  if (secs < 3600)  return 'bg-red-500'
  if (secs < 86400) return 'bg-amber-400'
  return 'bg-emerald-500'
}

export default function AuctionCard({ auction }) {
  const navigate  = useNavigate()
  const { id, title, category, images, image_url, minPrice, currentBid, totalBids = 0, endsAt, seller } = auction

  // Suporta tanto image_url (campo novo) quanto images[] (array antigo)
  const imgSrc    = image_url || images?.[0] || null
  const bg        = CATEGORY_GRADIENT[category] ?? 'from-gray-100 to-gray-200'
  const catBadge  = CATEGORY_TEXT[category] ?? 'text-gray-600 bg-gray-100 border-gray-200'
  const isHot     = totalBids >= 4
  const secs      = (new Date(endsAt) - new Date()) / 1000
  const isUrgent  = secs > 0 && secs < 3600

  return (
    <div
      className="card-hover overflow-hidden group flex flex-col"
      onClick={() => navigate(`/leilao/${id}`)}
    >
      {/* Faixa de urgência */}
      <div className={`h-1 w-full shrink-0 ${urgencyColor(endsAt)}`} />

      {/* Imagem */}
      <div className={`relative h-40 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden shrink-0`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl select-none opacity-80">{CATEGORY_EMOJI[category] ?? '📦'}</span>
        )}

        {/* Overlay sutil no bottom da imagem */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />

        {/* Badge lances */}
        <div className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm ${
          isHot ? 'bg-red-500 text-white' : totalBids > 0 ? 'bg-emerald-600 text-white' : 'bg-white/90 text-gray-500 border border-gray-200'
        }`}>
          {totalBids > 0
            ? <><TrendingUp size={8} /> {totalBids}</>
            : <span className="text-[9px]">sem lances</span>
          }
        </div>

        {/* Badge urgência */}
        {isUrgent && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            <Clock size={8} className="animate-pulse" /> URGENTE
          </div>
        )}
      </div>

      {/* Corpo */}
      <div className="p-4 flex flex-col flex-1">
        {/* Categoria */}
        <div className="mb-2">
          <span className={`inline-flex text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${catBadge}`}>
            {category ?? 'Outros'}
          </span>
        </div>

        {/* Título */}
        <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-3 flex-1">
          {title}
        </p>

        {/* Preços */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Mínimo</p>
            <p className="text-sm text-gray-500 font-semibold">
              {minPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Lance atual</p>
            <p className={`text-base font-extrabold leading-none ${currentBid ? 'text-emerald-600' : 'text-gray-200'}`}>
              {currentBid
                ? currentBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : '—'}
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        {currentBid && (
          <div className="mb-3">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                style={{ width: `${Math.min(100, ((currentBid / minPrice) * 50))}%` }}
              />
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <CountdownTimer endsAt={endsAt} />
          {seller?.name && (
            <p className="text-[9px] text-gray-400 truncate max-w-[80px] ml-2 text-right">{seller.name}</p>
          )}
        </div>
      </div>
    </div>
  )
}
