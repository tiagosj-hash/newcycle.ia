// MyAuctions.jsx
import { useNavigate } from 'react-router-dom'
import { addDays } from 'date-fns'
import CountdownTimer from '../../components/CountdownTimer'
import { formatCurrency } from '../../services/auctionService'

const AUCTIONS = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8', minPrice: 8000, currentBid: 9800, totalBids: 6, status: 'active', endsAt: addDays(new Date(), 0.09).toISOString() },
  { id: '2', title: 'Monitor Dell 27" — 4 un.', minPrice: 1500, currentBid: 1750, totalBids: 3, status: 'active', endsAt: addDays(new Date(), 0.03).toISOString() },
  { id: '3', title: 'Nobreak APC 1500VA', minPrice: 450, currentBid: 450, totalBids: 1, status: 'active', endsAt: addDays(new Date(), 5).toISOString() },
  { id: '4', title: 'Switch Cisco 48 portas', minPrice: 2000, currentBid: null, totalBids: 0, status: 'active', endsAt: addDays(new Date(), 7).toISOString() },
  { id: '5', title: 'Rack servidor 42U', minPrice: 1800, currentBid: null, totalBids: 0, status: 'draft', endsAt: null },
  { id: '6', title: 'Impressora HP M507', minPrice: 900, currentBid: 1050, totalBids: 4, status: 'ended', endsAt: null },
  { id: '7', title: 'Access points Ubiquiti', minPrice: 800, currentBid: null, totalBids: 0, status: 'unsold', endsAt: null },
]

const STATUS_LABEL = {
  active: <span className="badge-green">Ativo</span>,
  draft: <span className="badge-gray">Rascunho</span>,
  ended: <span className="badge-green">Encerrado</span>,
  unsold: <span className="badge-gray">Sem venda</span>,
}

export function MyAuctions() {
  const navigate = useNavigate()
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Meus leilões</h1>
          <p className="text-sm text-gray-400">5 ativos · 2 encerrados · 1 rascunho</p>
        </div>
        <button onClick={() => navigate('/painel/novo')} className="btn-primary">+ Novo leilão</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Equipamento', 'Mínimo', 'Lance atual', 'Lances', 'Encerra em', 'Status', ''].map(h => (
              <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {AUCTIONS.map(a => (
              <tr key={a.id} className={`hover:bg-gray-50 ${a.status === 'ended' || a.status === 'unsold' ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                <td className="px-4 py-3 text-gray-600">{formatCurrency(a.minPrice)}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">{a.currentBid ? formatCurrency(a.currentBid) : <span className="text-gray-300 font-normal">—</span>}</td>
                <td className="px-4 py-3 text-gray-600">{a.totalBids}</td>
                <td className="px-4 py-3">{a.endsAt ? <CountdownTimer endsAt={a.endsAt} /> : '—'}</td>
                <td className="px-4 py-3">{STATUS_LABEL[a.status]}</td>
                <td className="px-4 py-3">
                  {a.status === 'draft' && <button className="btn-sm">Publicar</button>}
                  {a.status === 'unsold' && <button onClick={() => navigate('/painel/novo')} className="btn-sm">Relançar</button>}
                  {(a.status === 'active' || a.status === 'ended') && <button className="btn-sm">Detalhes</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Bids.jsx
import BidList from '../../components/BidList'

const BID_AUCTION = {
  title: 'Lenovo ThinkPad E14 — lote 8 un.',
  minPrice: 8000,
  currentBid: 9800,
  endsAt: addDays(new Date(), 0.09).toISOString(),
  bids: [
    { id: '1', company: 'TechNova Soluções LTDA', cnpj: true, amount: 9800, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '2', company: 'DataHub Corp', cnpj: true, amount: 9200, createdAt: new Date(Date.now() - 10800000).toISOString() },
    { id: '3', company: 'TechNova Soluções LTDA', cnpj: true, amount: 8800, createdAt: new Date(Date.now() - 14400000).toISOString() },
    { id: '4', company: 'DataHub Corp', cnpj: true, amount: 8400, createdAt: new Date(Date.now() - 18000000).toISOString() },
    { id: '5', company: 'Soluções Omega ME', cnpj: true, amount: 8200, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '6', company: 'TechNova Soluções LTDA', cnpj: true, amount: 8000, createdAt: new Date(Date.now() - 90000000).toISOString() },
  ],
}

export function Bids() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold mb-1">Lances recebidos</h1>
      <p className="text-sm text-gray-400 mb-6">Acompanhe em tempo real quem está disputando seus leilões</p>
      <div className="card p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">{BID_AUCTION.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">Mínimo: {formatCurrency(BID_AUCTION.minPrice)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Lance atual</div>
            <div className="text-lg font-semibold text-emerald-600">{formatCurrency(BID_AUCTION.currentBid)}</div>
            <CountdownTimer endsAt={BID_AUCTION.endsAt} />
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-1 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>Mín. {formatCurrency(BID_AUCTION.minPrice)}</span>
          <span>Atual {formatCurrency(BID_AUCTION.currentBid)}</span>
        </div>
        <BidList bids={BID_AUCTION.bids} />
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button className="btn-sm flex-1">Prorrogar prazo</button>
          <button className="btn-sm flex-1">Encerrar agora</button>
          <button className="btn-sm flex-1 text-red-500 border-red-200 hover:bg-red-50">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// Profile.jsx
export function Profile() {
  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold mb-1">Perfil da empresa</h1>
      <p className="text-sm text-gray-400 mb-6">Dados verificados pelo newcycle.ia</p>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-lg font-semibold text-emerald-700">FR</div>
          <div>
            <div className="font-semibold">Fintech Radius LTDA</div>
            <div className="text-xs text-gray-400 mt-0.5">CNPJ 12.345.678/0001-90</div>
            <span className="badge-green text-xs mt-1">✓ Empresa verificada</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['Razão social', 'Fintech Radius LTDA'], ['CNPJ', '12.345.678/0001-90'], ['E-mail', 'patrimonio@radius.com.br'], ['Telefone', '(11) 3456-7890'], ['Cidade', 'São Paulo'], ['Estado', 'SP']].map(([label, value]) => (
            <div key={label}>
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input className="form-input" defaultValue={value} disabled={label === 'CNPJ'} />
            </div>
          ))}
        </div>
        <button className="btn-primary mt-5">Salvar alterações</button>
      </div>
    </div>
  )
}

// Financial.jsx
const TRANSACTIONS = [
  { title: 'Notebooks Lenovo — lote 8', buyer: 'DataHub Corp', gross: 9600, status: 'paid' },
  { title: 'Impressora HP M507', buyer: 'Clínica Norte', gross: 1050, status: 'paid' },
  { title: 'Monitor Dell 27" — 4 un.', buyer: 'Contábil Souza', gross: 1750, status: 'pending' },
]

const COMMISSION = 0.08

export function Financial() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold mb-1">Financeiro</h1>
      <p className="text-sm text-gray-400 mb-6">Repasses e comissões dos leilões encerrados</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['Total arrecadado', 'R$ 24.600', 'text-emerald-600'], ['A receber', 'R$ 1.610', 'text-gray-900'], ['Comissão plataforma', '8%', 'text-gray-900']].map(([label, value, color]) => (
          <div key={label} className="card p-4">
            <div className="text-xs text-gray-400 mb-2">{label}</div>
            <div className={`text-xl font-semibold ${color}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-sm font-medium">Histórico de transações</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Equipamento', 'Comprador', 'Lance final', 'Comissão 8%', 'Líquido', 'Status'].map(h => (
              <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {TRANSACTIONS.map(t => {
              const commission = t.gross * COMMISSION
              const net = t.gross - commission
              return (
                <tr key={t.title} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3 text-gray-600">{t.buyer}</td>
                  <td className="px-4 py-3">{formatCurrency(t.gross)}</td>
                  <td className="px-4 py-3 text-red-500">−{formatCurrency(commission)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(net)}</td>
                  <td className="px-4 py-3">
                    {t.status === 'paid' ? <span className="badge-green">Repassado</span> : <span className="badge-amber">Aguardando</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyAuctions
