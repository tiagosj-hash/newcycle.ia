import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Gavel, TrendingUp, PlusCircle, Wallet, User, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to: '/painel',            icon: LayoutDashboard, label: 'Visão geral',  end: true },
  { to: '/painel/leiloes',    icon: Gavel,           label: 'Meus leilões' },
  { to: '/painel/lances',     icon: TrendingUp,      label: 'Lances' },
  { to: '/painel/novo',       icon: PlusCircle,      label: 'Novo leilão' },
  { to: '/painel/financeiro', icon: Wallet,          label: 'Financeiro' },
  { to: '/painel/perfil',     icon: User,            label: 'Perfil' },
]

function NavItems({ onClose }) {
  const { company } = useAuth()
  return (
    <>
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mx-4 pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-800 truncate">{company?.razao_social ?? '—'}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{company?.cnpj ?? ''}</p>
        {company?.cnpj_verified
          ? <span className="badge-green text-xs mt-2 inline-flex">✓ Verificada</span>
          : <span className="badge-amber text-xs mt-2 inline-flex">Aguardando verificação</span>
        }
      </div>
    </>
  )
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 52px)' }}>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-52 bg-white border-r border-gray-200 shrink-0 flex-col py-5">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium px-4 mb-3">
          Painel do vendedor
        </p>
        <NavItems />
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)}>
          <aside
            className="w-64 bg-white h-full flex flex-col py-5 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 mb-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Painel</p>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <NavItems onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto bg-gray-50 min-w-0">
        {/* Barra mobile com botão de menu */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={18} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700">Painel do vendedor</span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
