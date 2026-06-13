import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gavel, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '', password: '', cnpj: '', razaoSocial: '',
    phone: '', city: '', state: 'SP',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const formatCNPJ = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 14)
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.cnpj.replace(/\D/g, '').length !== 14) {
      setError('CNPJ inválido — informe os 14 dígitos.'); return
    }
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-1 ring-white/20">
            <Gavel size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">
            new<span className="text-emerald-300">cycle</span>.ia
          </h1>
          <p className="text-emerald-200/70 text-sm mt-1">Cadastre sua empresa — é grátis</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados da empresa */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Sparkles size={11} className="text-emerald-500" /> Dados da empresa
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">CNPJ</label>
                  <input
                    className="form-input"
                    placeholder="00.000.000/0001-00"
                    value={form.cnpj}
                    onChange={e => set('cnpj', formatCNPJ(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Razão social</label>
                  <input
                    className="form-input"
                    placeholder="Empresa Exemplo LTDA"
                    value={form.razaoSocial}
                    onChange={e => set('razaoSocial', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Telefone</label>
                    <input className="form-input" placeholder="(11) 99999-9999" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Estado</label>
                    <select className="form-input" value={form.state} onChange={e => set('state', e.target.value)}>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Cidade</label>
                  <input className="form-input" placeholder="São Paulo" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Acesso */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Acesso</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">E-mail</label>
                  <input className="form-input" type="email" placeholder="contato@empresa.com.br" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Senha</label>
                  <input className="form-input" type="password" placeholder="mínimo 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Ao cadastrar, você concorda com os termos de uso da plataforma.
            </p>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Já tem conta?{' '}
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
