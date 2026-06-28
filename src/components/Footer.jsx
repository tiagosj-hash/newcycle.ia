import { NavLink, useNavigate } from 'react-router-dom'
import { Recycle, Github, Mail, ArrowUpRight } from 'lucide-react'

const NAV_COLS = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Equipamentos',   to: '/equipamentos' },
      { label: 'Como funciona',  to: '/#como-funciona' },
      { label: 'Criar conta',    to: '/cadastro' },
      { label: 'Entrar',         to: '/login' },
    ],
  },
  {
    title: 'Vendedores',
    links: [
      { label: 'Painel do vendedor', to: '/painel' },
      { label: 'Criar leilão',       to: '/painel/novo' },
      { label: 'Meus leilões',       to: '/painel/leiloes' },
      { label: 'Financeiro',         to: '/painel/financeiro' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Contato',           href: 'mailto:suporte@newcycle.ia' },
      { label: 'Termos de uso',     href: 'mailto:suporte@newcycle.ia' },
      { label: 'Privacidade',       href: 'mailto:suporte@newcycle.ia' },
    ],
  },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5 mb-4 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(145deg, #22c58a 0%, #0e7a52 100%)', boxShadow: '0 2px 8px rgba(22,163,109,0.3)' }}
              >
                <Recycle size={17} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-none">
                <span className="text-[15px] font-black text-gray-900">new<span style={{ color: '#16a36d' }}>cycle</span></span>
                <span className="text-[15px] font-light text-gray-300">.ia</span>
              </div>
            </button>

            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-[200px]">
              Marketplace B2B de leilões de equipamentos corporativos com IA.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="mailto:suporte@newcycle.ia"
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="E-mail"
              >
                <Mail size={14} className="text-gray-500" />
              </a>
              <a
                href="https://github.com/tiagosj-hash/newcycle.ia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <Github size={14} className="text-gray-500" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</p>
              <ul className="space-y-3">
                {links.map(({ label, to, href }) => (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1 group"
                      >
                        {label}
                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <NavLink
                        to={to}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        {label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} newcycle.ia — Todos os direitos reservados
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Plataforma operacional
          </div>
        </div>
      </div>
    </footer>
  )
}
