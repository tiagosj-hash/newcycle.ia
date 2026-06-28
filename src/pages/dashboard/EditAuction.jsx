import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { formatCurrency, calcEndsAt, COMMISSION_RATE } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'

const CATEGORIES = ['TI & Informática', 'Escritório', 'Industrial', 'AV & Telecom', 'Saúde', 'Outros']
const CONDITIONS = ['Excelente', 'Bom', 'Regular', 'Para retirada de peças']
const DURATIONS = [1, 3, 7, 10, 15, 30]
const RELIST_OPTIONS = [1, 2, 3, 5]

export default function EditAuction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { company } = useAuth()

  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [notOwned, setNotOwned]   = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', category: 'TI & Informática',
    condition: 'Bom', minPrice: '', minIncrement: '100',
    durationDays: 7, autoClose: true,
    autoRelist: false, maxRelistCount: 1,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!company) return
    async function load() {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) { setLoading(false); return }
      if (data.seller_id !== company.id) { setNotOwned(true); setLoading(false); return }
      if (data.status !== 'draft') {
        // Não permite editar leilões que não são rascunho
        navigate('/painel/leiloes')
        return
      }

      setForm({
        title:          data.title ?? '',
        description:    data.description ?? '',
        category:       data.category ?? 'TI & Informática',
        condition:      data.condition ?? 'Bom',
        minPrice:       String(data.min_price ?? ''),
        minIncrement:   String(data.bid_increment ?? 100),
        durationDays:   data.duration_days ?? 7,
        autoClose:      data.auto_close ?? true,
        autoRelist:     data.auto_relist ?? false,
        maxRelistCount: data.max_relist_count ?? 1,
      })
      setLoading(false)
    }
    load()
  }, [id, company])

  const minPriceNum = parseFloat(form.minPrice) || 0
  const incNum      = parseFloat(form.minIncrement) || 0
  const secondBid   = minPriceNum + incNum

  const handleSave = async (publish = false) => {
    if (!company) return
    if (!form.title || !form.minPrice) { setSaveError('Preencha título e preço mínimo.'); return }
    setSaving(true)
    setSaveError('')
    const { error } = await supabase
      .from('auctions')
      .update({
        title:            form.title,
        description:      form.description,
        category:         form.category,
        condition:        form.condition,
        min_price:        parseFloat(form.minPrice),
        bid_increment:    parseFloat(form.minIncrement) || 100,
        duration_days:    form.durationDays,
        ends_at:          publish ? calcEndsAt(form.durationDays) : null,
        auto_close:       form.autoClose,
        auto_relist:      form.autoRelist,
        max_relist_count: form.autoRelist ? form.maxRelistCount : 0,
        status:           publish ? 'pending_moderation' : 'draft',
      })
      .eq('id', id)
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    navigate('/painel/leiloes')
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={24} className="animate-spin text-brand-500" />
    </div>
  )

  if (notOwned) return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
      <p className="text-gray-700 font-semibold mb-1">Acesso negado</p>
      <p className="text-sm text-gray-400 mb-5">Você não tem permissão para editar este leilão.</p>
      <button onClick={() => navigate('/painel/leiloes')} className="btn-primary">Voltar aos leilões</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Editar rascunho</h1>
        <p className="text-sm text-gray-400 mt-0.5">Ajuste os dados antes de publicar para moderação</p>
      </div>

      {/* Dados do equipamento */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-4">Informações do equipamento</h2>
        <div className="space-y-3">
          <div>
            <label className="label">Título</label>
            <input
              className="form-input"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Ex: Servidor Dell PowerEdge R740"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Categoria</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="form-input" value={form.condition} onChange={e => set('condition', e.target.value)}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea
              className="form-input min-h-[80px] resize-none"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Descreva o equipamento, acessórios, histórico de uso..."
            />
          </div>
        </div>
      </div>

      {/* Configuração do leilão */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-4">Configuração do leilão</h2>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="label">Preço mínimo (R$)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={form.minPrice}
              onChange={e => set('minPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Incremento mínimo (R$)</label>
            <input
              className="form-input"
              type="number"
              placeholder="100"
              value={form.minIncrement}
              onChange={e => set('minIncrement', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="label">Duração do leilão</label>
            <select className="form-input" value={form.durationDays} onChange={e => set('durationDays', Number(e.target.value))}>
              {DURATIONS.map(d => <option key={d} value={d}>{d} {d === 1 ? 'dia' : 'dias'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Encerramento</label>
            <select className="form-input" value={String(form.autoClose)} onChange={e => set('autoClose', e.target.value === 'true')}>
              <option value="true">Automático</option>
              <option value="false">Manual</option>
            </select>
          </div>
        </div>

        {/* Relançamento automático */}
        <div className="border border-gray-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Relançamento automático</span>
            </div>
            <button
              type="button"
              onClick={() => set('autoRelist', !form.autoRelist)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.autoRelist ? 'bg-brand-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${form.autoRelist ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Se o leilão encerrar sem venda, republica automaticamente.
          </p>
          {form.autoRelist && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Máximo de relançamentos</label>
              <div className="flex gap-2">
                {RELIST_OPTIONS.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('maxRelistCount', n)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.maxRelistCount === n ? 'bg-brand-50 border-brand-400 text-brand-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Prévia</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Lance inicial', minPriceNum ? formatCurrency(minPriceNum) : '—'],
              ['2º lance mínimo', minPriceNum && incNum ? formatCurrency(secondBid) : '—'],
              ['Duração', `${form.durationDays} dias`],
              ['Comissão', `${(COMMISSION_RATE * 100).toFixed(0)}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {saveError && (
        <div className="alert-error mb-3 text-xs">
          <AlertCircle size={13} className="shrink-0" /> {saveError}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => navigate('/painel/leiloes')} className="btn-ghost flex-1">
          Cancelar
        </button>
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline flex-1">
          {saving ? <><Loader2 size={13} className="animate-spin" /> Salvando...</> : 'Salvar rascunho'}
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary flex-[2]">
          {saving ? <><Loader2 size={13} className="animate-spin" /> Publicando...</> : 'Publicar leilão'}
        </button>
      </div>
    </div>
  )
}
