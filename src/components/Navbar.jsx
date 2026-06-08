import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-base font-medium text-gray-900">
        new<span className="text-emerald-600">cycle</span>.ia
      </Link>

      <div className="flex items-center gap-5">
        <Link to="/equipamentos" className="text-sm text-gray-500 hover:text-gray-900">
          Equipamentos
        </Link>
        <button
          onClick={() => navigate('/painel')}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Painel
        </button>
        <button onClick={() => navigate('/painel/novo')} className="btn-outline text-sm">
          Quero vender
        </button>
        <button onClick={() => navigate('/equipamentos')} className="btn-primary text-sm">
          Explorar leilões
        </button>
      </div>
    </nav>
  )
}
