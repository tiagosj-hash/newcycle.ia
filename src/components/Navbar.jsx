import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Gavel, LogOut, LogIn, Menu, X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { session, company, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-emerald-50 text-emerald-700 font-medium'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 h-[52px] shadow-sm">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
            <Gavel size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">
            new<span className="text-emerald-600">cycle</span>
            <span className="text-gray-400 font-normal">.ia</span>
          </span>
        </NavLink>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/equipamentos" className={linkClass}>Equipamentos</NavLink>
          {session && <NavLink to="/painel" className={linkClass}>Painel</NavLink>}
          {company?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>
              <ShieldCheck size={13} className="inline mr-1" />Admin
            </NavLink>
          )}
        </div>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              {company && (
                <span className="text-xs text-gray-400 truncate max-w-[140px]">
                  {company.razao_social}
                </span>
              )}
              <button onClick={() => navigate('/painel/novo')} className="btn-outline text-sm">
                + Novo leilão
              </button>
              <button onClick={handleSignOut} className="btn-sm flex items-center gap-1 text-gray-500">
                <LogOut size={13} /> Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-outline text-sm flex items-center gap-1.5">
                <LogIn size={14} /> Entrar
              </button>
              <button onClick={() => navigate('/equipamentos')} className="btn-primary text-sm">
                Explorar leilões
              </button>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[52px] z-40 bg-black/30" onClick={() => setMobileOpen(false)}>
          <div className="bg-white border-b border-gray-200 shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 space-y-1">
              <NavLink to="/equipamentos" className={linkClass} onClick={() => setMobileOpen(false)}>
                Equipamentos
              </NavLink>
              {session && (
                <>
                  <NavLink to="/painel" className={linkClass} onClick={() => setMobileOpen(false)}>
                    Painel
                  </NavLink>
                  <NavLink to="/painel/novo" className={linkClass} onClick={() => setMobileOpen(false)}>
                    + Novo leilão
                  </NavLink>
                </>
              )}
              {company?.role === 'admin' && (
                <NavLink to="/admin" className={linkClass} onClick={() => setMobileOpen(false)}>
                  Admin
                </NavLink>
              )}
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              {session ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate">{company?.razao_social}</span>
                  <button onClick={handleSignOut} className="btn-sm flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50">
                    <LogOut size={13} /> Sair
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { navigate('/login'); setMobileOpen(false) }} className="btn-outline flex-1 text-sm">
                    Entrar
                  </button>
                  <button onClick={() => { navigate('/cadastro'); setMobileOpen(false) }} className="btn-primary flex-1 text-sm">
                    Cadastrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
