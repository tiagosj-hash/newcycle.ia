import { useNavigate } from 'react-router-dom'
import { Gavel, TrendingUp } from 'lucide-react'
import CountdownTimer from './CountdownTimer'

/**
 * Card de leilão para listagens (homepage e browse).
 * Props:
 *   auction: { id, title, category, images, minPrice, currentBid, totalBids, endsAt, seller }
 */
export default function AuctionCard({ auction }) {
  const navigate = useNavigate()
  const {
    id, title, category, images = [],
    minPrice, currentBid, totalBids = 0, endsAt, seller
  } = auction

  const hasImage = images.length > 0
  const isAboveMin = currentBid >= minPrice

  return (
    <div
      className="card overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors"
      onClick={() => navigate(`/leilao/${id}`)}
    >
      {/* Imagem */}
      <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
        {hasImage
          ? <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          : <Gavel size={32} className="text-gray-300" />
        }
      </div>

      {/* Corpo */}
      <div className="p-3">
        <div className="text-xs text-gray-400 mb-1">{category}</div>
        <div className="text-sm font-medium text-gray-900 leading-snug mb-2 line-clamp-2">{title}</div>

        {/* Preços */}
        <div className="flex gap-3 mb-2">
          <div>
            <div className="text-xs text-gray-400">Mín.</div>
            <div className="text-sm text-gray-600 font-medium">
              {minPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Lance atual</div>
            <div className={`text-sm font-semibold ${isAboveMin ? 'text-emerald-600' : 'text-gray-400'}`}>
              {currentBid
                ? currentBid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'Nenhum lance'
              }
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <CountdownTimer endsAt={endsAt} />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={12} />
            {totalBids} {totalBids === 1 ? 'lance' : 'lances'}
          </div>
        </div>

        {seller && (
          <div className="text-xs text-gray-400 mt-2 truncate">{seller.name}</div>
        )}
      </div>
    </div>
  )
}
