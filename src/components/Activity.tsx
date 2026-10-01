import { memo } from 'react'
import { useFeed } from '../store/feedStore'
import s from '../app.module.css'

export const Activity = memo(function Activity() {
  const events = useFeed((st) => st.events)
  return (
    <section className={s.chat} aria-label="Live activity">
      <h3 className={s.chatHead}>Live activity</h3>
      <ul className={s.chatList}>
        {events.slice(0, 5).map((e) => (
          <li key={e.id} className={`${s.chatRow} ${s[`ev_${e.kind}`]}`}>
            {e.who && <b>{e.who}</b>} {e.text}
          </li>
        ))}
      </ul>
    </section>
  )
})
