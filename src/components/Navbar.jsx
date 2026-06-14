import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Gavel, LogOut, LogIn, Menu, X, ShieldCheck, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { session, company, signOut } = useAuth()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const linkCls = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <>
      <nav className={`bg-white/95 backdrop-blur-sm border-b border-gray-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 h-[56px] transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
            <Gavel size={15} className="text-white" />
          </div>
          <span className="text-sm font-extrabold text-gray-900 tracking-tight">
            new<span className="text-emerald-600">cycle</span>
            <span className="text-gray-400 font-normal">.ia</span>
          </span>
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
                <span className="text-xs text-gray-400 font-medium truncate max-w-[160px] hidden lg:block">
                  {company.razao_social}
                </span>
              )}
              <button onClick={() => navigate('/painel/novo')} className="btn-primary text-xs px-3 py-2">
                <Plus size={13} /> Novo leilão
              </button>
              <button onClick={handleSignOut} className="btn-sm text-gray-500">
                <LogOut size={13} /> Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-sm">
                <LogIn size={13} /> Entrar
              </button>
              <button onClick={() => navigate('/cadastro')} className="btn-primary text-xs px-3 py-2">
                Criar conta grátis
              </button>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-b border-gray-200 shadow-lg z-40 relative"
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
                  <span className="text-xs text-gray-500 font-medium truncate flex-1">{company?.razao_social}</span>
                  <button onClick={handleSignOut} className="btn-sm text-red-500 border-red-200 hover:bg-red-50 shrink-0">
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
