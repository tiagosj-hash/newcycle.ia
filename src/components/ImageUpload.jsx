import { useState, useRef } from 'react'
import { Camera, Sparkles, Check, RefreshCw } from 'lucide-react'
import { analyzeEquipmentImage } from '../services/aiService'

/**
 * Componente de upload de imagem com análise por IA.
 * Após o upload, chama a API Claude para identificar o equipamento
 * e retorna os dados via onResult(data).
 *
 * Props:
 *   onResult: (data: { title, description, category, tags, suggestedPrice }) => void
 */
export default function ImageUpload({ onResult }) {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [loadingMsg, setLoadingMsg] = useState('')
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target.result
      setPreview(dataUrl)
      const base64 = dataUrl.split(',')[1]
      await runAI(base64, file.type)
    }
    reader.readAsDataURL(file)
  }

  const runAI = async (base64, mimeType) => {
    setStatus('loading')
    setProgress(0)

    const msgs = [
      'Identificando o equipamento...',
      'Consultando preço de mercado...',
      'Gerando descrição...',
    ]
    let idx = 0
    setLoadingMsg(msgs[0])

    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 4, 88)
        if (next > 30 && idx === 0) { idx = 1; setLoadingMsg(msgs[1]) }
        if (next > 60 && idx === 1) { idx = 2; setLoadingMsg(msgs[2]) }
        return next
      })
    }, 100)

    try {
      const result = await analyzeEquipmentImage(base64, mimeType)
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setStatus('done')
        onResult(result)
      }, 300)
    } catch {
      clearInterval(interval)
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setPreview(null)
    setProgress(0)
    inputRef.current.value = ''
    onResult(null)
  }

  return (
    <div>
      {/* Zona de upload */}
      <div
        onClick={() => status === 'idle' && inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${status === 'idle' ? 'border-gray-200 hover:border-emerald-400 cursor-pointer' : ''}
          ${status === 'done' ? 'border-emerald-400 bg-emerald-50' : ''}
          ${status === 'loading' ? 'border-gray-200' : ''}
          ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        {status === 'idle' && (
          <>
            <Camera size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">Clique para enviar a foto</p>
            <p className="text-xs text-gray-400">JPG, PNG ou WEBP — até 10MB</p>
          </>
        )}
        {status === 'done' && (
          <>
            <Check size={28} className="text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-700">Análise concluída!</p>
            <button onClick={e => { e.stopPropagation(); reset() }} className="mt-2 text-xs text-emerald-600 flex items-center gap-1 mx-auto hover:underline">
              <RefreshCw size={11} /> Trocar foto
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-sm font-medium text-red-600">Erro ao analisar imagem</p>
            <button onClick={reset} className="btn-outline mt-2 text-xs">Tentar novamente</button>
          </>
        )}
        {status === 'loading' && (
          <p className="text-sm text-gray-500">Analisando...</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />

      {/* Preview */}
      {preview && status !== 'idle' && (
        <img src={preview} alt="Preview" className="w-full h-44 object-cover rounded-xl mt-3" />
      )}

      {/* Loading bar */}
      {status === 'loading' && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={13} className="text-emerald-600 animate-pulse" />
            <span className="text-xs text-gray-500">{loadingMsg}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
