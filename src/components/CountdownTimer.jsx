import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'
import { differenceInSeconds } from 'date-fns'

const SNIPE_WINDOW = 30

export default function CountdownTimer({ endsAt, lastBidAt, onExtended }) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!endsAt) return 0
    return Math.max(0, differenceInSeconds(new Date(endsAt), new Date()))
  })
  const prevLastBidAt = useRef(lastBidAt)
  const onExtendedRef = useRef(onExtended)
  onExtendedRef.current = onExtended

  // Anti-sniping: novo lance nos últimos 30s → reseta para 30s
  useEffect(() => {
    if (!lastBidAt || lastBidAt === prevLastBidAt.current) return
    prevLastBidAt.current = lastBidAt
    setSecondsLeft(s => {
      if (s > 0 && s < SNIPE_WINDOW) {
        onExtendedRef.current?.()
        return SNIPE_WINDOW
      }
      return s
    })
  }, [lastBidAt])

  // Tick — criado uma vez, limpo quando chega a zero
  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!endsAt || secondsLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
        <Clock size={12} /> Encerrado
      </span>
    )
  }

  const days    = Math.floor(secondsLeft / 86400)
  const hours   = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const secs    = secondsLeft % 60
  const pad = n => String(n).padStart(2, '0')

  const label =
    days > 0  ? `${days}d ${pad(hours)}h` :
    hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}` :
    `${pad(minutes)}:${pad(secs)}`

  const colorClass =
    secondsLeft > 86400 ? 'timer-green' :
    secondsLeft > 3600  ? 'timer-amber' :
    'timer-red'

  const isSnipeZone = secondsLeft < SNIPE_WINDOW

  return (
    <span
      className={`${colorClass} ${isSnipeZone ? 'animate-pulse' : ''}`}
      title={isSnipeZone ? 'Últimos 30s — lances reiniciam o contador!' : undefined}
    >
      <Clock size={12} />
      {label}
      {isSnipeZone && <span className="ml-1 text-[10px] font-bold">⚡</span>}
    </span>
  )
}
