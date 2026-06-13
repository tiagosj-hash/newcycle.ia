import { useState, useEffect } from 'react'
import { Building2, Gavel, Activity, DollarSign } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { formatCurrency } from '../../services/auctionService'
import { SkeletonMetric } from '../../components/Skeleton'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const [
        { count: companies },
        { count: auctions },
        { count: pending },
        { data: bids },
      ] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('auctions').select('*', { count: 'exact', head: true }),
        supabase.from('auctions').select('*', { count: 'exact', head: true }).eq('status', 'pending_moderation'),
        supabase.from('bids').select('amount'),
      ])
      const volume = bids?.reduce((s, b) => s + (b.amount ?? 0), 0) ?? 0
      setStats({ companies: companies ?? 0, auctions: auctions ?? 0, pending: pending ?? 0, volume })
    }
    load()
  }, [])

  const METRICS = stats ? [
    { label: 'Empresas cadastradas', value: String(stats.companies),        icon: Building2,  iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
    { label: 'Total de leilões',     value: String(stats.auctions),         icon: Gavel,      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Aguardando moderação', value: String(stats.pending),          icon: Activity,   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
    { label: 'Volume total de bids', value: formatCurrency(stats.volume),   icon: DollarSign, iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
  ] : []

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Painel administrativo</h1>
        <p className="text-sm text-gray-400 mt-0.5">Visão geral da plataforma newcycle.ia</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {!stats
          ? Array(4).fill(0).map((_, i) => <SkeletonMetric key={i} />)
          : METRICS.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
              <div key={label} className="card p-4">
                <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            ))
        }
      </div>
    </div>
  )
}
