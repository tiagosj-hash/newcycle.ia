import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gavel } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { setError('E-mail ou senha incorretos.'); return }
    navigate('/painel')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-1 ring-white/20">
            <Gavel size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">
            new<span className="text-emerald-300">cycle</span>.ia
          </h1>
          <p className="text-emerald-200/70 text-sm mt-1">Acesse sua conta</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">E-mail</label>
              <input
                className="form-input"
                type="email"
                placeholder="empresa@exemplo.com.br"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Senha</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-emerald-600 font-medium hover:underline">
              Cadastre sua empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
