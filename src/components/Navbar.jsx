import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, LogIn, Menu, X, ShieldCheck, Plus, Recycle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { session, company, signOut } = useAuth()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  return (
    <>
      <nav
        className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 transition-all duration-200"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        {/* ── Logo ──────────────────────────────────────── */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, #22c58a 0%, #0e7a52 100%)',
              boxShadow: '0 2px 8px rgba(22,163,109,0.35)',
            }}
          >
            <Recycle size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none select-none">
            <span className="text-[15px] font-black text-gray-900 tracking-tight">
              new<span style={{ color: '#16a36d' }}>cycle</span>
            </span>
            <span className="text-[15px] font-light text-gray-300">.ia</span>
          </div>
        </NavLink>

        {/* ── Links desktop ─────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/equipamentos"
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            Equipamentos
          </NavLink>

          {session && (
            <NavLink
              to="/painel"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              Painel
            </NavLink>
          )}

          {company?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1 ${
                  isActive ? 'bg-violet-100 text-violet-800' : 'text-violet-600 hover:bg-violet-50'
                }`
              }
            >
              <ShieldCheck size={13} />Admin
            </NavLink>
          )}
        </div>

        {/* ── CTAs desktop ──────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              {company && (
                <span className="text-xs text-gray-400 truncate max-w-[180px] hidden lg:block font-medium">
                  {company.razao_social}
                </span>
              )}
              <button
                onClick={() => navigate('/painel/novo')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #22c58a 0%, #16a36d 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(22,163,109,0.25)',
                }}
              >
                <Plus size={13} /> Novo leilão
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #22c58a 0%, #16a36d 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(22,163,109,0.25)',
                }}
              >
                Criar conta grátis
              </button>
            </>
          )}
        </div>

        {/* ── Hamburger mobile ──────────────────────────── */}
        <button
          className="md:hidden w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          {open
            ? <X size={18} className="text-gray-700" />
            : <Menu size={18} className="text-gray-700" />}
        </button>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 top-16 bg-black/20 z-30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-200"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { to: '/equipamentos', label: 'Equipamentos' },
                  ...(session ? [{ to: '/painel', label: 'Painel' }, { to: '/painel/novo', label: '+ Novo leilão' }] : []),
                  ...(company?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
                ].map(({ to, label }) => (
                  <NavLink
                    key={to} to={to}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              <div className="px-4 pb-4 pt-3 border-t border-gray-100">
                {session ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium truncate">{company?.razao_social}</span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 shrink-0"
                    >
                      <LogOut size={13} /> Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => navigate('/cadastro')}
                      className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(180deg, #22c58a, #16a36d)' }}
                    >
                      Criar conta
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
