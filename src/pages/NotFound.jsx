import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* Number */}
        <div className="relative mb-8 select-none">
          <span className="text-[160px] font-black text-gray-100 leading-none block">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center"
              style={{ boxShadow: '0 4px 16px rgba(22,163,109,0.15)' }}>
              <Search size={28} className="text-brand-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-3">Página não encontrada</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          A URL que você acessou não existe ou foi movida.
          Verifique o endereço ou volte para a página inicial.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline gap-2"
          >
            <ArrowLeft size={15} /> Voltar
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary gap-2"
          >
            Ir para o início
          </button>
        </div>
      </motion.div>
    </div>
  )
}
