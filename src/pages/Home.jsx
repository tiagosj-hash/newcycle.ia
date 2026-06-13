import { useNavigate } from 'react-router-dom'
import {
  Camera, Brain, Edit3, TrendingUp, Gavel, Building2,
  Zap, Clock, ArrowRight, ShieldCheck, Star, ChevronRight,
} from 'lucide-react'
import AuctionCard from '../components/AuctionCard'
import { addDays } from 'date-fns'

const MOCK_AUCTIONS = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8 unidades', category: 'TI & Informática', image_url: null, minPrice: 8000, currentBid: 9800, totalBids: 6, endsAt: addDays(new Date(), 0.09).toISOString(), seller: { name: 'Fintech Radius LTDA' } },
  { id: '2', title: 'Monitor Dell 27" 4K — 4 unidades', category: 'TI & Informática', image_url: null, minPrice: 1500, currentBid: 1750, totalBids: 3, endsAt: addDays(new Date(), 0.03).toISOString(), seller: { name: 'Construtora Beta' } },
  { id: '3', title: 'Nobreak APC 1500VA — 3 unidades', category: 'TI & Informática', image_url: null, minPrice: 450, currentBid: 450, totalBids: 1, endsAt: addDays(new Date(), 5).toISOString(), seller: { name: 'Clínica Norte Saúde' } },
  { id: '4', title: 'Switch Cisco Catalyst 48 portas', category: 'TI & Informática', image_url: null, minPrice: 2000, currentBid: null, totalBids: 0, endsAt: addDays(new Date(), 7).toISOString(), seller: { name: 'Grupo Alfa S.A.' } },
]

const STATS = [
  { icon: Gavel,       value: '2.400+', label: 'leilões realizados',   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: Building2,   value: '380',    label: 'empresas cadastradas', color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  { icon: ShieldCheck, value: '100%',   label: 'compradores com CNPJ', color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
]

const HOW_IT_WORKS = [
  { icon: Camera,     title: 'Tire uma foto',      desc: 'Upload pelo celular ou computador. Sem formulário longo, sem descrição manual.' },
  { icon: Brain,      title: 'IA analisa',          desc: 'Identificação automática do modelo, valor de mercado e descrição técnica.' },
  { icon: Edit3,      title: 'Publique em 2 min',  desc: 'Ajuste preço mínimo e prazo. O leilão vai ao ar automaticamente.' },
  { icon: TrendingUp, title: 'Receba lances',       desc: 'Empresas verificadas com CNPJ disputam e você vende pelo maior valor.' },
]

const TESTIMONIALS = [
  { name: 'Carla Mendes', role: 'Gestora de TI · Fintech Radius', text: 'Em 10 minutos publiquei 40 notebooks que estavam parados. Arrecadamos 3x mais do que esperávamos.', stars: 5 },
  { name: 'Rodrigo Lima', role: 'CFO · Grupo Construção Beta', text: 'A IA identificou o equipamento e sugeriu o preço na hora. Fechamos em 4 dias.', stars: 5 },
  { name: 'Ana Paula Souza', role: 'Coord. Patrimônio · Clínica Norte', text: 'Processo muito mais rápido do que licitação. Compradores sérios, todos com CNPJ verificado.', stars: 5 },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 80%, rgba(29,158,117,0.35) 0%, transparent 50%),
            radial-gradient(circle at 90% 20%, rgba(15,110,86,0.3) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E")`
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Texto */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 ring-1 ring-white/20 backdrop-blur-sm">
              <Zap size={11} className="fill-emerald-300 text-emerald-300" />
              Marketplace B2B com Inteligência Artificial
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
              Dê um novo ciclo<br />
              aos equipamentos<br />
              <span className="text-emerald-300">da sua empresa</span>
            </h1>

            <p className="text-emerald-100/75 text-base leading-relaxed mb-8 max-w-md">
              Tire uma foto — a IA descreve, precifica e publica seu equipamento corporativo em minutos.
              Compradores verificados disputam no leilão.
            </p>

            <div className="flex gap-3 flex-wrap mb-8">
              <button
                onClick={() => navigate('/painel/novo')}
                className="btn-white flex items-center gap-2 font-bold"
              >
                <Camera size={15} /> Cadastrar equipamento
              </button>
              <button
                onClick={() => navigate('/equipamentos')}
                className="btn-ghost-white flex items-center gap-1.5"
              >
                Ver leilões ativos <ArrowRight size={14} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {['FR','CB','NS','GA'].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full bg-emerald-600/50 ring-2 ring-emerald-900 flex items-center justify-center text-[9px] font-bold text-white">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-300/80">
                <span className="text-white font-semibold">+380 empresas</span> já vendem na plataforma
              </p>
            </div>
          </div>

          {/* Card flutuante mock */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-[0_24px_48px_-8px_rgba(0,0,0,0.45)] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* topo verde */}
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 h-36 flex items-center justify-center relative">
                <span className="text-6xl">💻</span>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  AO VIVO
                </div>
                <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp size={8} /> 6
                </div>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold text-gray-900 leading-tight mb-0.5">Lenovo ThinkPad E14</p>
                <p className="text-[10px] text-gray-400 mb-3">Lote 8 unidades · TI & Informática</p>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">Lance atual</p>
                    <p className="text-xl font-extrabold text-emerald-600 leading-none mt-0.5">R$ 9.800</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">Encerra em</p>
                    <p className="text-xs font-bold text-red-500 flex items-center gap-0.5 justify-end mt-0.5">
                      <Clock size={10} className="animate-pulse" /> 02:14:33
                    </p>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '72%' }} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[9px] text-gray-400">Mín. R$ 8.000</p>
                  <p className="text-[9px] text-emerald-600 font-medium">+22,5% acima do mínimo</p>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50 flex items-center justify-between">
                <p className="text-[9px] text-gray-400">TechNova LTDA vencendo</p>
                <button className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Dar lance →
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-emerald-400/50 mt-3">exemplo de leilão ativo</p>
          </div>
        </div>

        {/* onda de transição */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L1440 40L1440 0C1200 35 960 40 720 35C480 30 240 10 0 0L0 40Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STATS.map(({ icon: Icon, value, label, color, bg, border }) => (
            <div key={label} className={`flex items-center gap-4 p-5 rounded-2xl border ${border} ${bg}`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className={`text-3xl font-extrabold ${color} leading-none`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ───────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
              <Zap size={10} /> Processo simples
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Como funciona</h2>
            <p className="text-gray-500 mt-3 max-w-sm mx-auto">
              Do upload da foto ao dinheiro na conta — em menos de uma semana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* linha conectora desktop */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100" />

            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative group">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-card-hover transition-all duration-200 h-full">
                  {/* número */}
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-extrabold flex items-center justify-center mb-4 shadow-sm">
                    {i + 1}
                  </div>
                  {/* ícone */}
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-2">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leilões em destaque ─────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ativos agora
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Leilões em destaque</h2>
            </div>
            <button
              onClick={() => navigate('/equipamentos')}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              Ver todos <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {MOCK_AUCTIONS.map(a => <AuctionCard key={a.id} auction={a} />)}
          </div>

          <div className="mt-5 sm:hidden text-center">
            <button onClick={() => navigate('/equipamentos')} className="btn-outline">
              Ver todos os leilões <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 uppercase tracking-widest bg-violet-50 border border-violet-200 px-3 py-1 rounded-full mb-4">
              <Star size={10} className="fill-violet-500 text-violet-500" /> Quem usa
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">O que nossos clientes dizem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, text, stars }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array(stars).fill(0).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {name.split(' ').map(w => w[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{name}</p>
                    <p className="text-[10px] text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 50%, #0F6E56 100%)',
          backgroundSize: '200% 200%',
        }}
      >
        {/* decorative blobs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 ring-1 ring-white/20">
            <Zap size={10} className="fill-emerald-300 text-emerald-300" /> Comece hoje
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Sua empresa tem<br />equipamentos parados?
          </h2>
          <p className="text-emerald-100/80 mb-8 max-w-sm mx-auto">
            Cadastre em menos de 2 minutos e receba ofertas de centenas de empresas verificadas.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/cadastro')} className="btn-white font-bold flex items-center gap-2">
              <Camera size={15} /> Criar conta gratuita
            </button>
            <button onClick={() => navigate('/equipamentos')} className="btn-ghost-white flex items-center gap-1.5">
              Explorar leilões <ArrowRight size={14} />
            </button>
          </div>
          <p className="text-emerald-300/60 text-xs mt-5">Sem mensalidade · Comissão só na venda · Compradores verificados</p>
        </div>
      </section>
    </div>
  )
}
