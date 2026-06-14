import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Gavel, LogOut, LogIn, Menu, X, ShieldCheck, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { session, company, signOut } = useAuth()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const linkCls = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`

  return (
    <>
      <nav className={`bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 h-14 transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <Gavel size={15} className="text-white" />
          </div>
          <span className="text-sm font-extrabold text-gray-900">
            new<span className="text-brand-600">cycle</span>
            <span className="text-gray-300 font-normal">.ia</span>
          </span>
        </NavLink>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/equipamentos" className={linkCls}>Equipamentos</NavLink>
          {session && <NavLink to="/painel" className={linkCls}>Painel</NavLink>}
          {company?.role === 'admin' && (
            <NavLink to="/admin" className={linkCls}>
              <ShieldCheck size={12} className="inline mr-1" />Admin
            </NavLink>
          )}
        </div>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              {company && (
                <span className="text-xs text-gray-400 truncate max-w-[160px] hidden lg:block">{company.razao_social}</span>
              )}
              <button onClick={() => navigate('/painel/novo')} className="btn-primary btn-sm">
                <Plus size={13} /> Novo leilão
              </button>
              <button onClick={handleSignOut} className="btn-ghost btn-sm text-gray-500">
                <LogOut size={13} /> Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost btn-sm">
                <LogIn size={13} /> Entrar
              </button>
              <button onClick={() => navigate('/cadastro')} className="btn-primary btn-sm">
                Criar conta grátis
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setOpen(o => !o)}>
          {open ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
        </button>
      </nav>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed top-14 inset-x-0 z-40 bg-white border-b border-gray-200 shadow-xl"
          >
            <div className="px-4 py-3 space-y-1">
              <NavLink to="/equipamentos" className={linkCls}>Equipamentos</NavLink>
              {session && <>
                <NavLink to="/painel" className={linkCls}>Painel</NavLink>
                <NavLink to="/painel/novo" className={linkCls}>+ Novo leilão</NavLink>
              </>}
              {company?.role === 'admin' && <NavLink to="/admin" className={linkCls}>Admin</NavLink>}
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              {session ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500 truncate">{company?.razao_social}</span>
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
        )}
      </AnimatePresence>
    </>
  )
}
