import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { differenceInSeconds } from 'date-fns'

/**
 * Exibe um contador regressivo até a data de encerramento do leilão.
 * Muda de cor conforme o tempo restante:
 *   > 24h  → verde
 *   < 24h  → âmbar
 *   < 1h   → vermelho
 */
export default function CountdownTimer({ endsAt }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, differenceInSeconds(new Date(endsAt), new Date()))
  )

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

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

  return (
    <span className={colorClass}>
      <Clock size={12} />
      {label}
    </span>
  )
}
