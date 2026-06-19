import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Gavel, TrendingUp, PlusCircle,
  Wallet, User, Menu, X, LogOut, Recycle,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to: '/painel',            icon: LayoutDashboard, label: 'Visão geral',  end: true },
  { to: '/painel/leiloes',    icon: Gavel,           label: 'Meus leilões' },
  { to: '/painel/lances',     icon: TrendingUp,      label: 'Lances recebidos' },
  { to: '/painel/financeiro', icon: Wallet,          label: 'Financeiro' },
  { to: '/painel/perfil',     icon: User,            label: 'Perfil' },
]

function SidebarContent({ onClose }) {
  const { company, signOut } = useAuth()
  const navigate = useNavigate()
  const initials = company?.razao_social?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() ?? '??'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Logo ───────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-gray-100">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(145deg, #22c58a, #0e7a52)' }}>
            <Recycle size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="text-[15px] font-black text-gray-900">new<span style={{ color: '#16a36d' }}>cycle</span></span>
            <span className="text-[15px] font-light text-gray-300">.ia</span>
          </div>
        </NavLink>
      </div>

      {/* ── Botão "Novo leilão" ─────────────────────────── */}
      <div className="px-4 pt-5 pb-3">
        <button
          onClick={() => { navigate('/painel/novo'); onClose?.() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(180deg, #22c58a 0%, #16a36d 100%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 2px 8px rgba(22,163,109,0.30), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <PlusCircle size={15} />
          Novo leilão
        </button>
      </div>

      {/* ── Nav ────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-2 mb-2 mt-1">
          Painel do vendedor
        </p>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #16a36d 0%, #0e7a52 100%)',
              boxShadow: '0 2px 8px rgba(22,163,109,0.25)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                <span className="flex-1 leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Company card ───────────────────────────────── */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl mb-2"
          style={{ background: '#f8fffe', border: '1px solid #d3f4e5' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0"
            style={{ background: 'linear-gradient(145deg, #22c58a, #0e7a52)' }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 truncate leading-snug">
              {company?.razao_social ?? '—'}
            </p>
            <span className={`text-[10px] font-semibold mt-0.5 inline-block ${company?.cnpj_verified ? 'text-brand-600' : 'text-amber-600'}`}>
              {company?.cnpj_verified ? '✓ Verificada' : '⏳ Aguardando'}
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={13} />
          Sair da conta
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-gray-200 sticky top-[64px] self-start h-[calc(100vh-64px)] overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-gray-50/60 min-w-0">
        {/* Topbar mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3.5 bg-white border-b border-gray-200 sticky top-0 z-30"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #22c58a, #0e7a52)' }}>
              <Recycle size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">Painel do vendedor</span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
