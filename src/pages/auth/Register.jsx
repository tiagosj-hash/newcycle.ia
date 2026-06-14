import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Gavel, Mail, Lock, Building2, Phone, MapPin, Hash,
  ArrowRight, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const STEPS_INFO = [
  { num: 1, label: 'Empresa' },
  { num: 2, label: 'Localização' },
  { num: 3, label: 'Acesso' },
]

export default function Register() {
  const { signUp }  = useAuth()
  const navigate    = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: '', password: '', cnpj: '', razaoSocial: '',
    phone: '', city: '', state: 'SP',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const formatCNPJ = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 14)
    return d
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  const nextStep = (e) => {
    e.preventDefault()
    if (step === 1 && form.cnpj.replace(/\D/g, '').length !== 14) {
      setError('CNPJ inválido — informe os 14 dígitos.'); return
    }
    setError('')
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(form)
      navigate('/painel')
    } catch (err) {
      setError(err.message ?? 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Painel esquerdo ─────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #042E25 0%, #085041 40%, #0F6E56 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-400/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center ring-1 ring-white/20">
            <Gavel size={20} className="text-brand-300" />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">
            new<span className="text-brand-300">cycle</span><span className="text-white/50 font-normal">.ia</span>
          </span>
        </div>

        <div className="relative z-10">
          <p className="text-brand-300/70 text-sm font-semibold uppercase tracking-widest mb-4">Cadastro gratuito</p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-8">
            Comece a vender<br />
            equipamentos<br />
            <span className="text-brand-300">em minutos</span>
          </h2>

          {/* Passos visuais */}
          <div className="space-y-4">
            {STEPS_INFO.map(({ num, label }) => (
              <div key={num} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${
                  step > num
                    ? 'bg-brand-400 text-white'
                    : step === num
                      ? 'bg-white text-brand-800'
                      : 'bg-white/10 text-white/40'
                }`}>
                  {step > num ? <CheckCircle size={15} /> : num}
                </div>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  step >= num ? 'text-white' : 'text-white/40'
                }`}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2025 newcycle.ia · Todos os direitos reservados</p>
        </div>
      </div>

      {/* ── Painel direito ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Logo mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Gavel size={18} className="text-white" />
          </div>
          <span className="text-gray-900 text-base font-bold">
            new<span className="text-brand-600">cycle</span><span className="text-gray-400 font-normal">.ia</span>
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Header do passo */}
          <div className="mb-8">
            {/* Progresso mobile */}
            <div className="flex gap-1.5 mb-6 lg:hidden">
              {STEPS_INFO.map(({ num }) => (
                <div key={num} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= num ? 'bg-brand-600' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
              Passo {step} de 3
            </p>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {step === 1 && 'Dados da empresa'}
              {step === 2 && 'Localização'}
              {step === 3 && 'Acesso à conta'}
            </h1>
            <p className="text-sm text-gray-500">
              {step === 1 && 'Informe o CNPJ e razão social da empresa'}
              {step === 2 && 'Onde sua empresa está localizada?'}
              {step === 3 && 'Crie as credenciais de acesso'}
            </p>
          </div>

          {/* Step 1 — Empresa */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
              onSubmit={nextStep} className="space-y-4"
            >
              <div className="form-group">
                <label className="form-label">CNPJ</label>
                <div className="relative">
                  <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="form-input pl-10 font-mono"
                    placeholder="00.000.000/0001-00"
                    value={form.cnpj}
                    onChange={e => set('cnpj', formatCNPJ(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Razão social</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="form-input pl-10"
                    placeholder="Empresa Exemplo LTDA"
                    value={form.razaoSocial}
                    onChange={e => set('razaoSocial', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="form-input pl-10"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
              </div>
              {error && <div className="form-error"><AlertCircle size={13} className="shrink-0" />{error}</div>}
              <button type="submit" className="btn-primary w-full py-3 mt-2">
                Continuar <ArrowRight size={16} />
              </button>
            </motion.form>
          )}

          {/* Step 2 — Localização */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
              onSubmit={nextStep} className="space-y-4"
            >
              <div className="form-group">
                <label className="form-label">Cidade</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="form-input pl-10"
                    placeholder="São Paulo"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" value={form.state} onChange={e => set('state', e.target.value)}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">Voltar</button>
                <button type="submit" className="btn-primary flex-1">Continuar <ArrowRight size={16} /></button>
              </div>
            </motion.form>
          )}

          {/* Step 3 — Acesso */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
              onSubmit={handleSubmit} className="space-y-4"
            >
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="form-input pl-10"
                    type="email"
                    placeholder="contato@empresa.com.br"
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
                    placeholder="mínimo 6 caracteres"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <Sparkles size={14} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-brand-700 leading-relaxed">
                  Ao criar sua conta, você concorda com os termos de uso. A verificação do CNPJ é feita pela equipe newcycle.ia em até 24h.
                </p>
              </div>

              {error && <div className="form-error"><AlertCircle size={13} className="shrink-0" />{error}</div>}

              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">Voltar</button>
                <button type="submit" disabled={loading} className="btn-primary flex-[2]">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Criando...</>
                    : <>Criar conta <ArrowRight size={16} /></>
                  }
                </button>
              </div>
            </motion.form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Entrar →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
