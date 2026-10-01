import { forwardRef, useRef, useState } from 'react'
import { kes } from '../format'
import { SHAPES, artFor } from '../palettes'
import { useFeed } from '../store/feedStore'
import type { Category } from '../types'
import { CameraIcon, CloseIcon } from './Icons'
import { Photo } from './Photo'
import s from '../app.module.css'

const CATS: Category[] = ['shoes', 'tops', 'bags']
const RUN = [1, 2, 5]

/** Seller flow: put your own item on the wall. */
export const SellDialog = forwardRef<HTMLDialogElement, { onClose: () => void }>(function SellDialog({ onClose }, ref) {
  const host = useFeed((f) => f.host)
  const [category, setCategory] = useState<Category>('shoes')
  const [shape, setShape] = useState(SHAPES.shoes[0].shape)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('')
  const [minutes, setMinutes] = useState(2)
  const [photo, setPhoto] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [touched, setTouched] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const priceNum = Number(price)
  const nameErr = name.trim().length < 3 ? 'Give it a name (at least 3 letters)' : ''
  const priceErr = !(priceNum >= 100 && priceNum <= 200000) ? 'Price between KES 100 and 200,000' : ''

  const pickCategory = (c: Category) => {
    setCategory(c)
    setShape(SHAPES[c][0].shape)
  }
  const pickPhoto = (f?: File) => {
    if (photo) URL.revokeObjectURL(photo)
    setPhoto(f ? URL.createObjectURL(f) : undefined)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (nameErr || priceErr) return
    setBusy(true)
    const ok = await host({ name: name.trim(), category, shape, price: priceNum, size, minutes, palette: 3, photo })
    setBusy(false)
    if (ok) {
      // The photo URL now belongs to the listing, so don't revoke it.
      setPhoto(undefined); setName(''); setPrice(''); setSize(''); setTouched(false)
      onClose()
    }
  }

  return (
    <dialog ref={ref} className={`${s.dlg} ${s.sellDlg}`} aria-labelledby="sell-title" onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className={s.dlgInner} onSubmit={submit} noValidate>
        <header className={s.dlgHead}>
          <div>
            <h2 id="sell-title">Host a drop</h2>
            <p className={s.dlgSub}>Put an item live for buyers to claim.</p>
          </div>
          <button type="button" className={s.iconBtn} onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </header>

        <div className={`${s.dlgBody} ${s.sellBody}`}>
          <div className={s.preview}>
            <div className={s.previewMedia}>
              <Photo src={photo} art={artFor(shape, 3)} />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className={s.srOnly} id="f-photo" onChange={(e) => pickPhoto(e.target.files?.[0])} />
            <label htmlFor="f-photo" className={`${s.btn} ${s.btnGhost} ${s.fileBtn}`}>
              <CameraIcon width={18} height={18} /> {photo ? 'Change photo' : 'Add a photo'}
            </label>
            <p className={s.previewName}>{name.trim() || 'Your item'}</p>
            <p className={s.previewPrice}>{priceNum > 0 ? kes(priceNum) : 'KES —'}</p>
          </div>

          <div className={s.fields}>
            <fieldset className={s.fieldset}>
              <legend>Category</legend>
              <div className={s.seg}>
                {CATS.map((c) => (
                  <label key={c} className={s.segItem}>
                    <input type="radio" name="category" checked={category === c} onChange={() => pickCategory(c)} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={s.fieldset}>
              <legend>Type</legend>
              <div className={s.seg}>
                {SHAPES[category].map((o) => (
                  <label key={o.shape} className={s.segItem}>
                    <input type="radio" name="shape" checked={shape === o.shape} onChange={() => setShape(o.shape)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={s.field}>
              <label htmlFor="f-name">Item name</label>
              <input id="f-name" value={name} maxLength={60} placeholder="e.g. Nike Air Force 1 ’07" onChange={(e) => setName(e.target.value)} aria-invalid={touched && !!nameErr} aria-describedby={touched && nameErr ? 'f-name-err' : undefined} autoComplete="off" />
              {touched && nameErr && <p id="f-name-err" className={s.err}>{nameErr}</p>}
            </div>

            <div className={s.row2}>
              <div className={s.field}>
                <label htmlFor="f-price">Price (KES)</label>
                <input id="f-price" inputMode="numeric" value={price} placeholder="4500" onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} aria-invalid={touched && !!priceErr} aria-describedby={touched && priceErr ? 'f-price-err' : undefined} autoComplete="off" />
                {touched && priceErr && <p id="f-price-err" className={s.err}>{priceErr}</p>}
              </div>
              <div className={s.field}>
                <label htmlFor="f-size">Size</label>
                <input id="f-size" value={size} maxLength={12} placeholder="EU 42 / M" onChange={(e) => setSize(e.target.value)} autoComplete="off" />
              </div>
            </div>

            <fieldset className={s.fieldset}>
              <legend>Live for</legend>
              <div className={s.seg}>
                {RUN.map((m) => (
                  <label key={m} className={s.segItem}>
                    <input type="radio" name="minutes" checked={minutes === m} onChange={() => setMinutes(m)} />
                    <span>{m} min</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <footer className={s.dlgFoot}>
          <button className={`${s.btn} ${s.btnClaim} ${s.btnBig}`} disabled={busy}>
            {busy ? 'Going live…' : 'Go live'}
          </button>
        </footer>
      </form>
    </dialog>
  )
})
