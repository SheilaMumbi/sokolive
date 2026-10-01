import { memo } from 'react'
import { useSecondsLeft } from '../hooks/useNow'
import { ClockIcon } from './Icons'
import s from '../app.module.css'

export const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

/** Timer pill over the photo. Only this component re-renders each second. */
export const TimerPill = memo(function TimerPill({ endsAt, name, large }: { endsAt: number; name: string; large?: boolean }) {
  const left = useSecondsLeft(endsAt)
  const ended = left === 0
  const tone = ended ? s.timerEnded : left <= 10 ? s.timerUrgent : left <= 30 ? s.timerWarn : ''
  return (
    <span
      role="timer"
      aria-label={ended ? `${name} ended` : `${name}: ${left} seconds left`}
      className={`${s.timer} ${large ? s.timerLg : ''} ${tone}`}
    >
      <ClockIcon width={large ? 18 : 14} height={large ? 18 : 14} />
      <span aria-hidden="true">{ended ? 'Ended' : mmss(left)}</span>
    </span>
  )
})

/** Thin draining bar. Purely visual; the pill carries the accessible timer. */
export const TimerBar = memo(function TimerBar({ startsAt, endsAt }: { startsAt: number; endsAt: number }) {
  const left = useSecondsLeft(endsAt)
  const total = Math.max(1, Math.round((endsAt - startsAt) / 1000))
  const tone = left === 0 ? '' : left <= 10 ? s.barUrgent : left <= 30 ? s.barWarn : ''
  return (
    <div className={s.timeBar} aria-hidden="true">
      <div className={`${s.timeBarFill} ${tone}`} style={{ transform: `scaleX(${Math.min(1, left / total)})` }} />
    </div>
  )
})
