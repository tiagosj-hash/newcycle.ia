import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Gavel, Building2, ShieldCheck } from 'lucide-react'

const NAV = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Visão geral',  end: true },
  { to: '/admin/moderacao',  icon: Gavel,           label: 'Moderação' },
  { to: '/admin/empresas',   icon: Building2,       label: 'Empresas' },
]

export default function AdminLayout() {
  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 52px)' }}>
      <aside className="w-52 bg-white border-r border-gray-200 shrink-0 flex flex-col py-5">
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-violet-600" />
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
