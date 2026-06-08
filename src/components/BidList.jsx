import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trophy } from 'lucide-react'

/**
 * Lista ordenada de lances de um leilão (do maior para o menor).
 * Props:
 *   bids: Array<{ id, company, cnpj, amount, createdAt }>
 */
export default function BidList({ bids = [] }) {
  if (bids.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        Nenhum lance ainda — seja o primeiro!
      </div>
    )
  }

  const sorted = [...bids].sort((a, b) => b.amount - a.amount)

  return (
    <div className="divide-y divide-gray-100">
      {sorted.map((bid, i) => (
        <div
          key={bid.id}
          className={`flex items-center justify-between py-3 px-4 ${i === 0 ? 'bg-emerald-50 -mx-4' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${i === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
              {i === 0 ? <Trophy size={12} /> : i + 1}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{bid.company}</div>
              <div className="text-xs text-gray-400">
                {bid.cnpj ? 'CNPJ verificado · ' : ''}
                {format(new Date(bid.createdAt), "dd/MM HH:mm", { locale: ptBR })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${i === 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
              {bid.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            {i === 0 && <div className="badge-green text-xs mt-0.5">Vencendo</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
