import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Brain, Edit3, TrendingUp, Gavel, Building2, ShieldCheck, ArrowRight, Clock, Zap, CheckCircle2, Star } from 'lucide-react'
import AuctionCard from '../components/AuctionCard'
import { addDays } from 'date-fns'

const MOCK_AUCTIONS = [
  { id: '1', title: 'Lenovo ThinkPad E14 — lote 8 unidades', category: 'TI & Informática', image_url: null, minPrice: 8000, currentBid: 9800, totalBids: 6, endsAt: addDays(new Date(), 0.09).toISOString(), seller: { name: 'Fintech Radius LTDA' } },
  { id: '2', title: 'Monitor Dell 27" 4K — 4 unidades', category: 'TI & Informática', image_url: null, minPrice: 1500, currentBid: 1750, totalBids: 3, endsAt: addDays(new Date(), 0.5).toISOString(), seller: { name: 'Construtora Beta' } },
  { id: '3', title: 'Nobreak APC 1500VA — lote 3 unidades', category: 'TI & Informática', image_url: null, minPrice: 450, currentBid: 450, totalBids: 1, endsAt: addDays(new Date(), 5).toISOString(), seller: { name: 'Clínica Norte Saúde' } },
  { id: '4', title: 'Switch Cisco Catalyst 48 portas', category: 'AV & Telecom', image_url: null, minPrice: 2000, currentBid: null, totalBids: 0, endsAt: addDays(new Date(), 7).toISOString(), seller: { name: 'Grupo Alfa S.A.' } },
]

const STEPS = [
  { num: '01', icon: Camera,     title: 'Foto do equipamento',    desc: 'Tire uma foto com o celular. Sem formulário, sem descrição manual.' },
  { num: '02', icon: Brain,      title: 'IA identifica e precifica', desc: 'Modelo, valor de mercado e descrição gerados automaticamente em segundos.' },
  { num: '03', icon: Edit3,      title: 'Revise e publique',      desc: 'Ajuste o preço mínimo e o prazo. Publique com um clique.' },
  { num: '04', icon: TrendingUp, title: 'Receba lances',          desc: 'Empresas com CNPJ verificado disputam. Você recebe o maior valor.' },
]

const BENEFITS = [
  'CNPJ verificado em todos os compradores',
  'Pagamento garantido antes da retirada',
  'Comissão de apenas 5% sobre a venda',
  'Suporte em português 7 dias por semana',
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #021610 0%, #04231a 35%, #063322 65%, #0a5539 100%)' }}>

        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #22c58a 0%, transparent 65%)' }} />

        <div className="container-page relative z-10 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full text-2xs font-bold uppercase tracking-widest text-brand-300"
                style={{ background: 'rgba(34,197,138,0.12)', border: '1px solid rgba(34,197,138,0.2)' }}>
                <Zap size={10} className="text-brand-400 fill-brand-400" />
                Marketplace B2B com Inteligência Artificial
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                Venda equipamentos<br />
                corporativos em<br />
                <span className="text-brand-400">minutos.</span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-lg">
                Tire uma foto — a IA descreve e precifica. Compradores B2B com CNPJ verificado fazem lances em tempo real.
              </p>

              {/* Benefits */}
              <ul className="space-y-2.5 mb-10">
                {BENEFITS.map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-white/60">
                    <CheckCircle2 size={15} className="text-brand-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => navigate('/cadastro')} className="btn-white btn-lg px-8">
                  Criar conta grátis <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/equipamentos')} className="btn-ghost-white btn-lg">
                  Ver leilões ativos
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {['F','C','N','G','T','M'].map(l => (
                    <div key={l} className="w-8 h-8 rounded-full ring-2 ring-brand-900 flex items-center justify-center text-xs font-bold text-brand-200"
                      style={{ background: `hsl(${l.charCodeAt(0)*17}deg 40% 30%)` }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-white/40">
                    <span className="text-white/70 font-semibold">+380 empresas</span> já vendem na plataforma
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right — preview card */}
            <motion.div
              initial={{ opacity: 0, y: 32, rotateY: -5 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-end"
            >
              <div className="relative">
                {/* Main card */}
                <div className="w-80 bg-white rounded-2xl overflow-hidden"
                  style={{ boxShadow: '0 32px 64px -12px rgba(0,0,0,0.5), 0 8px 32px -8px rgba(0,0,0,0.3)' }}>
                  <div className="h-44 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 relative flex items-center justify-center">
                    <span className="text-7xl select-none">💻</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-red-500"
                      style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                      <Clock size={9} className="animate-pulse" /> 02:14:33
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-full bg-red-500/90 text-white backdrop-blur-sm">
                      🔥 6 lances
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-2xs font-bold uppercase tracking-widest text-blue-600 mb-2">TI & Informática</p>
                    <p className="text-sm font-bold text-gray-900 leading-snug mb-1">Lenovo ThinkPad E14</p>
                    <p className="text-xs text-gray-400 mb-4">Fintech Radius LTDA · Lote 8 unidades</p>
                    <div className="h-px bg-gray-100 mb-3" />
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xs text-gray-400 mb-0.5">Lance atual</p>
                        <p className="text-2xl font-extrabold text-brand-600 leading-none tabular-nums">R$ 9.800</p>
                        <p className="text-2xs text-gray-400 mt-1">Mín. R$ 8.000</p>
                      </div>
                      <span className="text-2xs font-bold text-gray-400 flex items-center gap-0.5">
                        Ver <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-5 -left-10 bg-white rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                    <TrendingUp size={14} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Novo lance!</p>
                    <p className="text-2xs text-gray-400">Construtora Beta → R$ 9.800</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-12 fill-white">
            <path d="M0,48 L0,32 Q720,0 1440,32 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="py-12 border-b border-gray-100">
        <div className="container-page">
          <div className="grid grid-cols-3 gap-6 sm:gap-12">
            {[
              { value: 'R$ 12M+', label: 'em equipamentos leiloados', color: 'text-brand-600' },
              { value: '380',     label: 'empresas compradoras verificadas', color: 'text-blue-600' },
              { value: '2.400+', label: 'leilões concluídos com sucesso', color: 'text-violet-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center sm:text-left">
                <p className={`text-3xl sm:text-4xl font-black ${color} leading-none mb-1.5 tabular-nums`}>{value}</p>
                <p className="text-xs sm:text-sm text-gray-500 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────── */}
      <section className="section bg-gray-50/70 border-b border-gray-100">
        <div className="container-page">
          <div className="max-w-2xl mb-16">
            <span className="label-section mb-3 block">Processo</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
              Do upload ao recebimento<br />em 4 passos
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Sem burocracia. Sem intermediários. A IA faz o trabalho pesado.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200"
                style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <span className="absolute top-4 right-5 text-5xl font-black text-gray-100 group-hover:text-brand-100 transition-colors select-none leading-none">
                  {num}
                </span>
                <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={20} className="text-brand-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEILÕES EM DESTAQUE ────────────────────────────────── */}
      <section className="section border-b border-gray-100">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="label-section mb-3 block">Ao vivo agora</span>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Leilões em destaque</h2>
            </div>
            <button
              onClick={() => navigate('/equipamentos')}
              className="btn-outline hidden sm:flex"
            >
              Ver todos <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_AUCTIONS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <AuctionCard auction={a} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <button onClick={() => navigate('/equipamentos')} className="btn-outline w-full">
              Ver todos os leilões <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04231a 0%, #0a5539 50%, #0e7a52 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
        <div className="container-page relative z-10 py-24 text-center">
          <span className="label-section text-brand-400 mb-4 block">Comece hoje</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Sua empresa tem equipamentos<br className="hidden md:block" /> parados?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Cadastre em menos de 2 minutos e receba ofertas de centenas de empresas verificadas.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/cadastro')} className="btn-white btn-lg px-10">
              Criar conta grátis <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/equipamentos')} className="btn-ghost-white btn-lg px-8">
              Explorar leilões
            </button>
          </div>
          <p className="text-brand-500/60 text-xs mt-8 font-medium">
            Sem mensalidade · Comissão de 5% só na venda · Compradores com CNPJ verificado
          </p>
        </div>
      </section>
    </div>
  )
}
