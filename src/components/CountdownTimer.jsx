import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'
import { differenceInSeconds } from 'date-fns'

const SNIPE_WINDOW = 30 // segundos — Regra 7

/**
 * Contador regressivo com anti-sniping:
 * se um lance chegar enquanto secondsLeft < 30, o timer reseta para 30s.
 *
 * Props:
 *   endsAt     — ISO string com data/hora de encerramento
 *   lastBidAt  — ISO string do último lance (atualiza quando chega novo lance)
 *   onExtended — callback chamado quando o timer é estendido por anti-sniping
 */
export default function CountdownTimer({ endsAt, lastBidAt, onExtended }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, differenceInSeconds(new Date(endsAt), new Date()))
  )
  const prevLastBidAt = useRef(lastBidAt)

  // Anti-sniping: novo lance nos últimos 30s → reseta para 30s
  useEffect(() => {
    if (!lastBidAt || lastBidAt === prevLastBidAt.current) return
    prevLastBidAt.current = lastBidAt
    setSecondsLeft(s => {
      if (s > 0 && s < SNIPE_WINDOW) {
        onExtended?.()
        return SNIPE_WINDOW
      }
      return s
    })
  }, [lastBidAt])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft <= 0])

  if (secondsLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
        <Clock size={12} /> Encerrado
      </span>
    )
  }

  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60
  const pad = n => String(n).padStart(2, '0')

  let label
  if (days > 0) label = `${days}d ${pad(hours)}h`
  else if (hours > 0) label = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  else label = `${pad(minutes)}:${pad(secs)}`

  const colorClass =
    secondsLeft > 86400 ? 'timer-green' :
    secondsLeft > 3600  ? 'timer-amber' :
    'timer-red'

  const isSnipeZone = secondsLeft < SNIPE_WINDOW

  return (
    <span className={`${colorClass} ${isSnipeZone ? 'animate-pulse' : ''}`} title={isSnipeZone ? 'Últimos 30s — lances reiniciam o contador!' : undefined}>
      <Clock size={12} />
      {label}
      {isSnipeZone && <span className="ml-1 text-[10px] font-bold">⚡</span>}
    </span>
  )
}
