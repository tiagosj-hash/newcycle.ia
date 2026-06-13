import { useState, useRef } from 'react'
import { Camera, Sparkles, Check, RefreshCw, Upload } from 'lucide-react'
import { analyzeEquipmentImage } from '../services/aiService'
import { supabase } from '../services/supabase'

export default function ImageUpload({ onResult, onImageUrl }) {
  const [status, setStatus]         = useState('idle') // idle | uploading | loading | done | error
  const [loadingMsg, setLoadingMsg] = useState('')
  const [progress, setProgress]     = useState(0)
  const [preview, setPreview]       = useState(null)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target.result
      setPreview(dataUrl)
      const base64 = dataUrl.split(',')[1]
      await uploadAndAnalyze(file, base64)
    }
    reader.readAsDataURL(file)
  }

  const uploadAndAnalyze = async (file, base64) => {
    setStatus('uploading')
    setProgress(10)

    // Upload para Supabase Storage
    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('auction-images')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      // Sem autenticação ou erro — continua sem salvar URL
      console.warn('Upload falhou, continuando só com IA:', uploadError.message)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('auction-images')
        .getPublicUrl(uploadData.path)
      onImageUrl?.(publicUrl)
    }

    setProgress(30)
    await runAI(base64, file.type)
  }

  const runAI = async (base64, mimeType) => {
    setStatus('loading')
    const msgs = ['Identificando o equipamento...', 'Consultando preço de mercado...', 'Gerando descrição...']
    let idx = 0
    setLoadingMsg(msgs[0])

    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 3, 88)
        if (next > 50 && idx === 0) { idx = 1; setLoadingMsg(msgs[1]) }
        if (next > 70 && idx === 1) { idx = 2; setLoadingMsg(msgs[2]) }
        return next
      })
    }, 100)

    try {
      const result = await analyzeEquipmentImage(base64, mimeType)
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => { setStatus('done'); onResult(result) }, 300)
    } catch {
      clearInterval(interval)
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle'); setPreview(null); setProgress(0)
    inputRef.current.value = ''
    onResult(null); onImageUrl?.(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div>
      <div
        onClick={() => status === 'idle' && inputRef.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl transition-colors
          ${status === 'idle' ? 'border-gray-200 hover:border-emerald-400 cursor-pointer hover:bg-emerald-50/30' : ''}
          ${status === 'done' ? 'border-emerald-400 bg-emerald-50' : ''}
          ${status === 'loading' || status === 'uploading' ? 'border-gray-200 bg-gray-50' : ''}
          ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        {/* Preview da imagem */}
        {preview && status !== 'idle' ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-44 object-cover rounded-[10px]" />
            {status === 'done' && (
              <div className="absolute inset-0 bg-emerald-900/30 rounded-[10px] flex items-center justify-center">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <Check size={20} className="text-emerald-600" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            {status === 'idle' && (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={22} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Clique ou arraste a foto aqui</p>
                <p className="text-xs text-gray-400">JPG, PNG ou WEBP — até 10MB</p>
              </>
            )}
            {status === 'error' && (
              <>
                <p className="text-sm font-medium text-red-600 mb-2">Erro ao analisar imagem</p>
                <button onClick={reset} className="btn-outline text-xs">Tentar novamente</button>
              </>
            )}
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />

      {/* Barra de progresso + status */}
      {(status === 'loading' || status === 'uploading') && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-emerald-600 animate-pulse" />
              <span className="text-xs text-gray-500">
                {status === 'uploading' ? 'Enviando imagem...' : loadingMsg}
              </span>
            </div>
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Ação pós-análise */}
      {status === 'done' && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <Sparkles size={12} /> Análise concluída pela IA
          </div>
          <button onClick={reset} className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600">
            <RefreshCw size={11} /> Trocar foto
          </button>
        </div>
      )}
    </div>
  )
}
