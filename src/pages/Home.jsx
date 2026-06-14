import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Brain, Edit3, TrendingUp, Gavel, Building2, ShieldCheck, ArrowRight, Clock, Zap } from 'lucide-react'
import AuctionCard from '../components/AuctionCard'
import { addDays } from 'date-fns'

const MOCK_AUCTIONS = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8 unidades', category: 'TI & Informática', image_url: null, minPrice: 8000, currentBid: 9800, totalBids: 6, endsAt: addDays(new Date(), 0.09).toISOString(), seller: { name: 'Fintech Radius LTDA' } },
  { id: '2', title: 'Monitor Dell 27" 4K — 4 unidades', category: 'TI & Informática', image_url: null, minPrice: 1500, currentBid: 1750, totalBids: 3, endsAt: addDays(new Date(), 0.5).toISOString(), seller: { name: 'Construtora Beta' } },
  { id: '3', title: 'Nobreak APC 1500VA — lote 3 unidades', category: 'TI & Informática', image_url: null, minPrice: 450, currentBid: 450, totalBids: 1, endsAt: addDays(new Date(), 5).toISOString(), seller: { name: 'Clínica Norte Saúde' } },
  { id: '4', title: 'Switch Cisco Catalyst 48 portas', category: 'AV & Telecom', image_url: null, minPrice: 2000, currentBid: null, totalBids: 0, endsAt: addDays(new Date(), 7).toISOString(), seller: { name: 'Grupo Alfa S.A.' } },
]

const STEPS = [
  { num: '01', icon: Camera,    title: 'Foto do equipamento', desc: 'Tire uma foto com o celular. Sem formulário, sem descrição manual.' },
  { num: '02', icon: Brain,     title: 'IA identifica e precifica', desc: 'O modelo, valor de mercado e descrição são gerados automaticamente em segundos.' },
  { num: '03', icon: Edit3,     title: 'Revise e publique', desc: 'Ajuste o preço mínimo e o prazo. Publique com um clique.' },
  { num: '04', icon: TrendingUp, title: 'Receba lances', desc: 'Empresas com CNPJ verificado disputam. Você recebe o maior valor.' },
]

const STATS = [
  { icon: Gavel,       value: '2.400+', label: 'leilões realizados',   color: 'text-brand-600', bg: 'bg-brand-50' },
  { icon: Building2,   value: '380',    label: 'empresas cadastradas', color: 'text-blue-600',  bg: 'bg-blue-50' },
  { icon: ShieldCheck, value: '100%',   label: 'compradores verificados', color: 'text-violet-600', bg: 'bg-violet-50' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100"
        style={{ background: 'linear-gradient(160deg, #031a12 0%, #063322 45%, #0a5539 100%)' }}>

        {/* Pontos de fundo */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        <div className="container-page relative z-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 mb-6">
              <Zap size={11} className="text-brand-400 fill-brand-400" />
              <span className="text-2xs font-bold text-white/80 uppercase tracking-wider">Marketplace B2B com IA</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-5">
              Venda equipamentos<br />
              corporativos em<br />
              <span className="text-brand-400">minutos, não semanas</span>
            </h1>

            <p className="text-brand-200/70 text-base leading-relaxed mb-8 max-w-md">
              Tire uma foto — a IA descreve e precifica. Compradores B2B com CNPJ verificado fazem lances em tempo real.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/cadastro')} className="btn-white px-6 py-2.5">
                Começar grátis <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('/equipamentos')} className="btn-ghost-white px-6 py-2.5">
                Ver leilões ativos
              </button>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['FR','CB','NS','GA','TL'].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full bg-brand-700 ring-2 ring-brand-900 flex items-center justify-center text-2xs font-bold text-brand-200">{i}</div>
                ))}
              </div>
              <p className="text-sm text-white/50">
                <strong className="text-white">+380 empresas</strong> já vendem na plataforma
              </p>
            </div>
          </motion.div>

          {/* Card mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="hidden md:flex justify-center"
          >
            <div className="w-72 bg-white rounded-2xl shadow-float overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Image area */}
              <div className="h-36 bg-gradient-to-br from-blue-100 to-indigo-100 relative flex items-center justify-center">
                <span className="text-6xl">💻</span>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-red-500 text-white text-2xs font-bold px-2 py-0.5 rounded-full">
                  <Clock size={8} className="animate-pulse" /> 02:14:33
                </div>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-brand-600 text-white text-2xs font-bold px-2 py-0.5 rounded-full">
                  <TrendingUp size={9} /> 6 lances
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-2xs text-gray-400 font-semibold uppercase tracking-wide mb-1">TI & Informática</p>
                <p className="text-sm font-bold text-gray-900 leading-snug mb-3">
                  Lenovo ThinkPad E14<br />
                  <span className="font-normal text-gray-500">Lote 8 unidades</span>
                </p>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-2xs text-gray-400 mb-0.5">Lance atual</p>
                  <p className="text-xl font-extrabold text-brand-600 leading-none">R$ 9.800</p>
                  <p className="text-2xs text-gray-400 mt-1">Mín. R$ 8.000</p>
                </div>
              </div>

              <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50 flex items-center justify-between">
                <p className="text-2xs text-gray-400">Fintech Radius LTDA</p>
                <span className="text-2xs font-bold text-brand-600">Ver leilão →</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-white"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="container-page py-10 grid grid-cols-3 gap-4 sm:gap-8">
          {STATS.map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="flex items-center gap-3 sm:gap-4">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-extrabold ${color} leading-none`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────── */}
      <section className="section bg-gray-50 border-b border-gray-100">
        <div className="container-page">
          <div className="text-center mb-14">
            <p className="label-section mb-3">Processo</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Do upload ao recebimento
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Quatro passos simples para transformar equipamento parado em dinheiro na conta
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {STEPS.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-card transition-all duration-200">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Icon size={18} className="text-brand-600" />
                  </div>
                  <span className="text-3xl font-black text-gray-100">{num}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEILÕES EM DESTAQUE ────────────────────────────────── */}
      <section className="section border-b border-gray-100">
        <div className="container-page">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-section mb-2">Ao vivo agora</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Leilões em destaque</h2>
            </div>
            <button onClick={() => navigate('/equipamentos')} className="btn-ghost text-sm hidden sm:flex">
              Ver todos <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {MOCK_AUCTIONS.map(a => <AuctionCard key={a.id} auction={a} />)}
          </div>

          <div className="mt-6 sm:hidden">
            <button onClick={() => navigate('/equipamentos')} className="btn-outline w-full">
              Ver todos os leilões <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="section"
        style={{ background: 'linear-gradient(135deg, #063322 0%, #0e7a52 100%)' }}>
        <div className="container-page text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Sua empresa tem equipamentos parados?
          </h2>
          <p className="text-brand-300/80 mb-8 max-w-md mx-auto">
            Cadastre em menos de 2 minutos e receba ofertas de centenas de empresas verificadas.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/cadastro')} className="btn-white px-6 py-2.5 font-bold">
              Criar conta grátis <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/equipamentos')} className="btn-ghost-white px-6 py-2.5">
              Explorar leilões
            </button>
          </div>
          <p className="text-brand-500 text-xs mt-5">
            Sem mensalidade · Comissão de 5% só na venda · Compradores verificados
          </p>
        </div>
      </section>
    </div>
  )
}
