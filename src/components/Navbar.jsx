import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Gavel, LogOut, LogIn, Menu, X, ShieldCheck, Plus, Recycle } from 'lucide-react'
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

  const linkCls = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-gray-100 text-gray-900 font-semibold'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`

  return (
    <>
      <nav
        className={`bg-white/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 h-16 transition-all duration-200 ${
          scrolled ? 'border-b border-gray-200' : 'border-b border-transparent'
        }`}
        style={scrolled ? { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)' } : {}}
      >

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(180deg, #22c58a 0%, #16a36d 100%)', boxShadow: '0 2px 8px rgba(22,163,109,0.35)' }}>
            <Recycle size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="text-[15px] font-black text-gray-900 tracking-tight">
              new<span className="text-brand-600">cycle</span>
            </span>
            <span className="text-[15px] font-light text-gray-300">.ia</span>
          </div>
        </NavLink>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          <NavLink to="/equipamentos" className={linkCls}>Equipamentos</NavLink>
          {session && <NavLink to="/painel" className={linkCls}>Painel</NavLink>}
          {company?.role === 'admin' && (
            <NavLink to="/admin" className={linkCls}>
              <ShieldCheck size={13} className="inline mr-1 -mt-0.5" />Admin
            </NavLink>
          )}
        </div>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              {company && (
                <span className="text-xs text-gray-400 truncate max-w-[180px] hidden lg:block font-medium">
                  {company.razao_social}
                </span>
              )}
              <button onClick={() => navigate('/painel/novo')} className="btn-primary btn-sm">
                <Plus size={13} /> Novo leilão
              </button>
              <button onClick={handleSignOut} className="btn-ghost btn-sm text-gray-500 hover:text-red-600">
                <LogOut size={13} /> Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost btn-sm text-gray-600">
                Entrar
              </button>
              <button onClick={() => navigate('/cadastro')} className="btn-primary btn-sm">
                Criar conta grátis
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          onClick={() => setOpen(o => !o)}
        >
          {open
            ? <X size={18} className="text-gray-700" />
            : <Menu size={18} className="text-gray-700" />}
        </button>
      </nav>

      {/* Mobile drawer */}
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
              className="md:hidden fixed top-16 inset-x-0 z-40 bg-white"
              style={{ borderBottom: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              <div className="px-4 py-3 space-y-1">
                <NavLink to="/equipamentos" className={linkCls}>Equipamentos</NavLink>
                {session && (
                  <>
                    <NavLink to="/painel" className={linkCls}>Painel</NavLink>
                    <NavLink to="/painel/novo" className={linkCls}>+ Novo leilão</NavLink>
                  </>
                )}
                {company?.role === 'admin' && <NavLink to="/admin" className={linkCls}>Admin</NavLink>}
              </div>

              <div className="px-4 pb-4 pt-3 border-t border-gray-100">
                {session ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium truncate">{company?.razao_social}</span>
                    <button onClick={handleSignOut} className="btn-ghost btn-sm text-red-500 shrink-0">
                      <LogOut size={13} /> Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/login')} className="btn-outline flex-1">Entrar</button>
                    <button onClick={() => navigate('/cadastro')} className="btn-primary flex-1">Criar conta</button>
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
