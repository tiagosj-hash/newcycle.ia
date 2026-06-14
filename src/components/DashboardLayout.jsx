import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Gavel, TrendingUp, PlusCircle,
  Wallet, User, Menu, X, LogOut, ChevronRight,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to: '/painel',            icon: LayoutDashboard, label: 'Visão geral',  end: true },
  { to: '/painel/leiloes',    icon: Gavel,           label: 'Meus leilões' },
  { to: '/painel/lances',     icon: TrendingUp,      label: 'Lances' },
  { to: '/painel/novo',       icon: PlusCircle,      label: 'Novo leilão',  highlight: true },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
            <Gavel size={15} className="text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">
            new<span className="text-emerald-600">cycle</span>
            <span className="text-gray-400 font-normal">.ia</span>
          </span>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">
          Painel do vendedor
        </p>
        {NAV.map(({ to, icon: Icon, label, end, highlight }) => (
          <NavLink
            key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) => [
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
              isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : highlight
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-white' : highlight ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} className="text-white/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Company card */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 truncate">{company?.razao_social ?? '—'}</p>
            <div className="mt-0.5">
              {company?.cnpj_verified
                ? <span className="badge-green text-[9px] px-1.5 py-0.5">✓ Verificada</span>
                : <span className="badge-amber text-[9px] px-1.5 py-0.5">Aguardando</span>
              }
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Sair da conta
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 52px)' }}>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 shrink-0 flex-col">
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
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-white shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-gray-50 min-w-0">
        {/* Topbar mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={18} className="text-gray-600" />
          </button>
          <span className="text-sm font-bold text-gray-800">Painel do vendedor</span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
