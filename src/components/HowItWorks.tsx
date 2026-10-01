import { BoxIcon, ClockIcon, LiveIcon } from './Icons'
import s from '../app.module.css'

const STEPS = [
  [LiveIcon, 'Live drops', 'A new item goes live every 20–30 seconds.'],
  [ClockIcon, 'Claim instantly', 'Tap before the timer and before someone else does.'],
  [BoxIcon, 'Pay & collect', 'Settle with M-Pesa. Pickup or delivery in Nairobi.'],
] as const

export function HowItWorks() {
  return (
    <section className={s.how} aria-label="How it works">
      <ul className={s.howList}>
        {STEPS.map(([Icon, h, p]) => (
          <li key={h}>
            <span className={s.howIcon}><Icon width={22} height={22} /></span>
            <div>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
