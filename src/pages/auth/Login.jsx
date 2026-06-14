import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Mail, Lock, ArrowRight, ShieldCheck, Zap, Building2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const BENEFITS = [
  { icon: Zap,        text: 'IA identifica e descreve o equipamento em segundos' },
  { icon: ShieldCheck, text: 'Compradores verificados com CNPJ ativo' },
  { icon: Building2,  text: '+380 empresas B2B já na plataforma' },
]

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { setError('E-mail ou senha incorretos. Verifique e tente novamente.'); return }
    navigate('/painel')
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Painel esquerdo ─────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #042E25 0%, #085041 40%, #0F6E56 100%)' }}
      >
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        {/* Blobs decorativos */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ring-1 ring-white/20">
              <Gavel size={20} className="text-emerald-300" />
            </div>
            <span className="text-white text-lg font-bold tracking-tight">
              new<span className="text-emerald-300">cycle</span><span className="text-white/50 font-normal">.ia</span>
            </span>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-300/70 text-sm font-semibold uppercase tracking-widest mb-4">
              Marketplace B2B com IA
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Dê um novo ciclo<br />
              aos equipamentos<br />
              <span className="text-emerald-300">da sua empresa</span>
            </h2>
            <div className="space-y-4">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-emerald-300" />
                  </div>
                  <p className="text-white/75 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Rodapé esquerdo */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2025 newcycle.ia · Todos os direitos reservados</p>
        </div>
      </div>

      {/* ── Painel direito ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Logo mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Gavel size={18} className="text-white" />
          </div>
          <span className="text-gray-900 text-base font-bold">
            new<span className="text-emerald-600">cycle</span><span className="text-gray-400 font-normal">.ia</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Bem-vindo de volta</h1>
            <p className="text-sm text-gray-500">Entre com as credenciais da sua empresa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  className="form-input pl-10"
                  type="email"
                  placeholder="empresa@exemplo.com.br"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  className="form-input pl-10"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="form-error">
                <AlertCircle size={13} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Entrando...</>
                : <> Entrar <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="divider my-6">ou</div>

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Cadastre sua empresa →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
