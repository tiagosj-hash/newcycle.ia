import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { SkeletonRow } from '../../components/Skeleton'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading]     = useState(true)
  const [acting, setActing]       = useState(null)

  useEffect(() => {
    supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setCompanies(data ?? []); setLoading(false) })
  }, [])

  async function toggleVerified(id, current) {
    setActing(id)
    await supabase.from('companies').update({ cnpj_verified: !current }).eq('id', id)
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, cnpj_verified: !current } : c))
    setActing(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Empresas</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gerenciar cadastros e verificação de CNPJ</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Empresa','CNPJ','E-mail','Cidade / UF','Cadastro','Verificação',''].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={7}><SkeletonRow /></td></tr>)
                : companies.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-gray-400">Nenhuma empresa.</td>
                    </tr>
                  )
                  : companies.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{c.razao_social}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.cnpj}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{c.email}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {[c.city, c.state].filter(Boolean).join(' / ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        {c.cnpj_verified
                          ? <span className="badge-green">✓ Verificada</span>
                          : <span className="badge-amber">Pendente</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVerified(c.id, c.cnpj_verified)}
                          disabled={acting === c.id}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                            c.cnpj_verified
                              ? 'text-red-700 bg-red-50 hover:bg-red-100'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {c.cnpj_verified
                            ? <><XCircle size={12} /> Revogar</>
                            : <><CheckCircle size={12} /> Verificar</>
                          }
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
