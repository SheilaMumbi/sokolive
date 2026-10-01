import { useToasts } from '../store/toastStore'
import { CheckIcon, CloseIcon } from './Icons'
import s from '../app.module.css'

export function Toasts() {
  const toasts = useToasts((t) => t.toasts)
  const dismiss = useToasts((t) => t.dismiss)
  return (
    <div className={s.toasts}>
      {toasts.map((t) => (
        <div key={t.id} className={`${s.toast} ${s[`toast_${t.kind}`]}`} role={t.kind === 'error' ? 'alert' : 'status'}>
          <span className={s.toastIcon} aria-hidden="true">{t.kind === 'success' ? <CheckIcon width={16} height={16} /> : t.kind === 'error' ? '!' : '•'}</span>
          <span className={s.toastMsg}>{t.message}</span>
          <button className={s.toastX} onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
