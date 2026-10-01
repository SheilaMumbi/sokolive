import { forwardRef, useState } from 'react'
import { kes } from '../format'
import { cartTotal, useCart } from '../store/cartStore'
import { useFeed } from '../store/feedStore'
import { BagIcon, CheckIcon, CloseIcon } from './Icons'
import { Photo } from './Photo'
import s from '../app.module.css'

const PHONE = /^(?:\+?254|0)[17]\d{8}$/

/** Native <dialog>: focus trapping, Escape-to-close and an inert background come free. */
export const CartDrawer = forwardRef<HTMLDialogElement, { onClose: () => void }>(function CartDrawer({ onClose }, ref) {
  const lines = useCart((c) => c.lines)
  const clear = useCart((c) => c.clear)
  const release = useFeed((f) => f.release)
  const [step, setStep] = useState<'cart' | 'pay' | 'sending' | 'done'>('cart')
  const [phone, setPhone] = useState('')
  const [paid, setPaid] = useState(0)
  const [err, setErr] = useState('')
  const total = cartTotal(lines)

  function close() {
    onClose()
    if (step === 'done' || step === 'sending') setStep('cart')
  }

  function pay(e: React.FormEvent) {
    e.preventDefault()
    if (!PHONE.test(phone.replace(/\s/g, ''))) return setErr('Enter a Safaricom number like 0712 345 678')
    setErr('')
    setStep('sending')
    setPaid(total)
    // Mock STK push.
    setTimeout(() => {
      clear()
      setStep('done')
    }, 1800)
  }

  return (
    <dialog ref={ref} className={`${s.dlg} ${s.drawer}`} aria-labelledby="cart-title" onClose={close} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className={s.dlgInner}>
        <header className={s.dlgHead}>
          <div>
            <h2 id="cart-title">{step === 'done' ? 'Order placed' : step === 'cart' ? 'Your cart' : 'Pay with M-Pesa'}</h2>
            {step === 'cart' && <p className={s.dlgSub}>{lines.length} {lines.length === 1 ? 'item' : 'items'}, reserved for you</p>}
          </div>
          <button className={s.iconBtn} onClick={close} aria-label="Close cart">
            <CloseIcon />
          </button>
        </header>

        {step === 'done' ? (
          <div className={s.done}>
            <span className={s.doneMark}><CheckIcon width={32} height={32} /></span>
            <p><strong>Demo complete.</strong> In a live store, an M-Pesa prompt for {kes(paid)} would now go to {phone}. Nothing was sent.</p>
            <button className={`${s.btn} ${s.btnClaim}`} onClick={close}>Back to the drop</button>
          </div>
        ) : (
          <>
            {lines.length === 0 ? (
              <div className={s.cartEmpty}>
                <span className={s.stateIcon}><BagIcon width={34} height={34} /></span>
                <p>Nothing claimed yet. Tap <strong>Claim</strong> on any live item and it lands here.</p>
              </div>
            ) : (
              <ul className={s.cartList}>
                {lines.map((l) => (
                  <li key={l.id} className={s.cartLine}>
                    <span className={s.cartThumb}>
                      <Photo src={l.photo} art={l.art} />
                    </span>
                    <span className={s.cartName}>
                      <span className={s.cartBrand}>{l.brand} · Lot {l.lot}</span>
                      <span className={s.cartTitle}>{l.name}</span>
                      <strong>{kes(l.price)}</strong>
                    </span>
                    {step === 'cart' && (
                      <button className={s.linkBtn} onClick={() => release(l.id)} aria-label={`Remove ${l.name} from cart`}>
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <footer className={s.dlgFoot}>
              <p className={s.total}>
                <span>Total</span>
                <strong aria-live="polite">{kes(total)}</strong>
              </p>
              {step === 'cart' ? (
                <button className={`${s.btn} ${s.btnClaim} ${s.btnBig}`} disabled={!lines.length} onClick={() => setStep('pay')}>
                  Checkout
                </button>
              ) : (
                <form onSubmit={pay} noValidate className={s.payForm}>
                  <div className={s.field}>
                    <label htmlFor="f-phone">M-Pesa number</label>
                    <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!err} aria-describedby={err ? 'f-phone-err' : undefined} disabled={step === 'sending'} />
                    {err && <p id="f-phone-err" className={s.err}>{err}</p>}
                  </div>
                  <p className={s.demoNote} role="note">
                    <strong>Demo only.</strong> No real M-Pesa prompt is sent and no money moves. Please don’t enter your real number.
                  </p>
                  <button className={`${s.btn} ${s.btnClaim} ${s.btnBig}`} disabled={step === 'sending' || !lines.length}>
                    {step === 'sending' ? 'Sending prompt…' : `Pay ${kes(total)}`}
                  </button>
                  {step === 'pay' && (
                    <button type="button" className={s.linkBtn} onClick={() => setStep('cart')}>Back to cart</button>
                  )}
                </form>
              )}
            </footer>
          </>
        )}
      </div>
    </dialog>
  )
})
