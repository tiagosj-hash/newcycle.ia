import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, RefreshCw } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import { formatCurrency, calcEndsAt, COMMISSION_RATE } from '../../services/auctionService'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'

const CATEGORIES = ['TI & Informática', 'Escritório', 'Industrial', 'AV & Telecom', 'Saúde', 'Outros']
const CONDITIONS = ['Excelente', 'Bom', 'Regular', 'Para retirada de peças']
const DURATIONS = [1, 3, 7, 10, 15, 30]
const RELIST_OPTIONS = [1, 2, 3, 5]

export default function NewAuction() {
  const navigate = useNavigate()
  const { company } = useAuth()
  const [aiData, setAiData]   = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', category: 'TI & Informática',
    condition: 'Bom', minPrice: '', minIncrement: '100',
    durationDays: 7, autoClose: true,
    autoRelist: false, maxRelistCount: 1,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAiResult = (data) => {
    if (!data) { setAiData(null); return }
    setAiData(data)
    setForm(f => ({
      ...f,
      title: data.title || f.title,
      description: data.description || f.description,
      category: data.category || f.category,
      condition: data.condition || f.condition,
      minPrice: data.suggestedMinPrice ? String(data.suggestedMinPrice) : f.minPrice,
    }))
  }

  const minPriceNum = parseFloat(form.minPrice) || 0
  const incNum = parseFloat(form.minIncrement) || 0
  const secondBid = minPriceNum + incNum
  const endsAt = calcEndsAt(form.durationDays)

  const handleSubmit = async (draft = false) => {
    if (!company) return
    if (!form.title || !form.minPrice) { setSaveError('Preencha título e preço mínimo.'); return }
    setSaving(true)
    setSaveError('')
    const { error } = await supabase.from('auctions').insert({
      seller_id:        company.id,
      title:            form.title,
      description:      form.description,
      category:         form.category,
      condition:        form.condition,
      min_price:        parseFloat(form.minPrice),
      bid_increment:    parseFloat(form.minIncrement) || 100,
      duration_days:    form.durationDays,
      ends_at:          draft ? null : calcEndsAt(form.durationDays),
      auto_close:       form.autoClose,
      auto_relist:      form.autoRelist,
      max_relist_count: form.autoRelist ? form.maxRelistCount : 0,
      image_url:        imageUrl ?? null,
      status:           draft ? 'draft' : 'pending_moderation',
    })
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    navigate('/painel/leiloes')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold mb-1">Criar novo leilão</h1>
      <p className="text-sm text-gray-400 mb-6">
        Tire uma foto — a IA identifica o equipamento e preenche automaticamente.
      </p>

      {/* 1. Foto */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-3">1. Foto do equipamento</h2>
        <ImageUpload onResult={handleAiResult} onImageUrl={url => setImageUrl(url)} />
      </div>

      {/* 2. Dados do equipamento */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          2. Informações do equipamento
          {aiData && <span className="badge-green text-xs"><Sparkles size={10} className="inline mr-1" />Preenchido pela IA</span>}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Título</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Servidor Dell PowerEdge R740" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Categoria</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Estado</label>
              <select className="form-input" value={form.condition} onChange={e => set('condition', e.target.value)}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Descrição</label>
            <textarea className="form-input min-h-20 resize-none" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descreva o equipamento, acessórios, histórico de uso..." />
          </div>
        </div>
      </div>

      {/* 3. Configuração do leilão */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-1">3. Configuração do leilão</h2>
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-4">
          O preço mínimo é <strong>público</strong> — compradores veem e os lances partem dele. Não há venda abaixo do mínimo.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Preço mínimo (R$)</label>
            <input className="form-input" type="number" placeholder="0" value={form.minPrice} onChange={e => set('minPrice', e.target.value)} />
            {aiData?.suggestedMinPrice && (
              <p className="text-xs text-emerald-600 mt-1">IA sugere: {formatCurrency(aiData.suggestedMinPrice)}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Incremento mínimo (R$)</label>
            <input className="form-input" type="number" placeholder="100" value={form.minIncrement} onChange={e => set('minIncrement', e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">Cada lance deve superar o anterior por este valor</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Duração do leilão</label>
            <select className="form-input" value={form.durationDays} onChange={e => set('durationDays', Number(e.target.value))}>
              {DURATIONS.map(d => <option key={d} value={d}>{d} {d === 1 ? 'dia' : 'dias'}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Encerramento</label>
            <select className="form-input" value={form.autoClose} onChange={e => set('autoClose', e.target.value === 'true')}>
              <option value="true">Automático — vende ao maior lance</option>
              <option value="false">Manual — confirmo antes de vender</option>
            </select>
          </div>
        </div>

        {/* Relançamento automático — Regra 2 */}
        <div className="border border-gray-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Relançamento automático</span>
            </div>
            <button
              type="button"
              onClick={() => set('autoRelist', !form.autoRelist)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.autoRelist ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${form.autoRelist ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Se o leilão encerrar sem venda, republica automaticamente com as mesmas configurações.
          </p>
          {form.autoRelist && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Número máximo de relançamentos</label>
              <div className="flex gap-2">
                {RELIST_OPTIONS.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('maxRelistCount', n)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.maxRelistCount === n ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prévia */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Prévia do leilão</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Lance inicial', minPriceNum ? formatCurrency(minPriceNum) : '—'],
              ['2º lance mínimo', minPriceNum && incNum ? formatCurrency(secondBid) : '—'],
              ['Duração', `${form.durationDays} dias`],
              ['Comissão plataforma', `${(COMMISSION_RATE * 100).toFixed(0)}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {saveError && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">{saveError}</p>}
      <div className="flex gap-3">
        <button onClick={() => handleSubmit(true)} disabled={saving} className="btn-outline flex-1">
          Salvar rascunho
        </button>
        <button onClick={() => handleSubmit(false)} disabled={saving} className="btn-primary flex-2 flex-grow-[2]">
          {saving ? 'Salvando...' : 'Publicar leilão'}
        </button>
      </div>
    </div>
  )
}
