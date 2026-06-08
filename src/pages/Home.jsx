import { useNavigate } from 'react-router-dom'
import { Camera, Brain, Edit3, TrendingUp } from 'lucide-react'
import AuctionCard from '../components/AuctionCard'
import { addDays } from 'date-fns'

const MOCK_AUCTIONS = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8 unidades', category: 'TI & Informática', images: [], minPrice: 8000, currentBid: 9800, totalBids: 6, endsAt: addDays(new Date(), 0.09).toISOString(), seller: { name: 'Fintech Radius LTDA' } },
  { id: '2', title: 'Monitor Dell 27" 4K — 4 unidades', category: 'TI & Informática', images: [], minPrice: 1500, currentBid: 1750, totalBids: 3, endsAt: addDays(new Date(), 0.03).toISOString(), seller: { name: 'Construtora Beta' } },
  { id: '3', title: 'Nobreak APC 1500VA — 3 unidades', category: 'TI & Informática', images: [], minPrice: 450, currentBid: 450, totalBids: 1, endsAt: addDays(new Date(), 5).toISOString(), seller: { name: 'Clínica Norte Saúde' } },
  { id: '4', title: 'Switch Cisco Catalyst 48 portas', category: 'TI & Informática', images: [], minPrice: 2000, currentBid: null, totalBids: 0, endsAt: addDays(new Date(), 7).toISOString(), seller: { name: 'Grupo Alfa S.A.' } },
]

const HOW_IT_WORKS = [
  { icon: Camera, title: '1. Tire uma foto', desc: 'Upload simples pelo celular ou computador' },
  { icon: Brain, title: '2. IA descreve', desc: 'Identificação automática com título, descrição e preço mínimo sugerido' },
  { icon: Edit3, title: '3. Configure o leilão', desc: 'Defina preço mínimo, incremento e prazo — publique em menos de 2 min' },
  { icon: TrendingUp, title: '4. Receba lances', desc: 'Empresas disputam seu equipamento e você vende pelo maior valor' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-16 px-6 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3 leading-tight">
          Dê um <span className="text-emerald-600">novo ciclo</span> aos<br />
          equipamentos da sua empresa
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm leading-relaxed">
          Marketplace B2B de leilões com IA — tire uma foto e nossa inteligência artificial
          descreve, precifica e publica seu equipamento em minutos.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/painel/novo')} className="btn-primary">
            Cadastrar equipamento
          </button>
          <button onClick={() => navigate('/equipamentos')} className="btn-outline">
            Ver leilões ativos
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200 grid grid-cols-3 divide-x divide-gray-100">
        {[['2.400+', 'leilões realizados'], ['380', 'empresas cadastradas'], ['até 70%', 'abaixo do preço novo']].map(([v, l]) => (
          <div key={l} className="py-5 text-center">
            <div className="text-xl font-semibold text-emerald-600">{v}</div>
            <div className="text-xs text-gray-400 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Como funciona */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-base font-semibold text-gray-900 mb-6">Como funciona</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon size={18} className="text-emerald-600" />
              </div>
              <div className="text-sm font-medium mb-1">{title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leilões em destaque */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Leilões em destaque</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MOCK_AUCTIONS.map(a => <AuctionCard key={a.id} auction={a} />)}
        </div>
        <div className="text-center mt-6">
          <button onClick={() => navigate('/equipamentos')} className="btn-outline">
            Ver todos os leilões
          </button>
        </div>
      </section>
    </div>
  )
}
