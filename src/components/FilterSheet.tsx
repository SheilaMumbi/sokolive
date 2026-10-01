import { forwardRef, useEffect, useState } from 'react'
import type { Category } from '../types'
import { BagCatIcon, CloseIcon, GridIcon, ShirtIcon, ShoeIcon } from './Icons'
import s from '../app.module.css'

const OPTIONS = [
  { id: 'all', label: 'All items', Icon: GridIcon },
  { id: 'shoes', label: 'Shoes', Icon: ShoeIcon },
  { id: 'tops', label: 'Tops', Icon: ShirtIcon },
  { id: 'bags', label: 'Bags', Icon: BagCatIcon },
] as const

interface Props {
  category: Category | 'all'
  liveOnly: boolean
  onApply: (c: Category | 'all', liveOnly: boolean) => void
}

/** Bottom sheet on phones, centred modal on desktop. Native <dialog> handles focus + Esc. */
export const FilterSheet = forwardRef<HTMLDialogElement, Props>(function FilterSheet({ category, liveOnly, onApply }, ref) {
  const [c, setC] = useState(category)
  const [l, setL] = useState(liveOnly)
  useEffect(() => { setC(category); setL(liveOnly) }, [category, liveOnly])
  const close = () => (ref as React.RefObject<HTMLDialogElement>).current?.close()

  return (
    <dialog ref={ref} className={`${s.dlg} ${s.filterDlg}`} aria-labelledby="filter-title" onClick={(e) => e.target === e.currentTarget && close()}>
      <form method="dialog" onSubmit={() => onApply(c, l)} className={s.dlgInner}>
        <header className={s.dlgHead}>
          <h2 id="filter-title">Filter by category</h2>
          <button type="button" className={s.iconBtn} onClick={close} aria-label="Close filters"><CloseIcon /></button>
        </header>
        <div className={s.dlgBody}>
          <fieldset className={s.optList}>
            <legend className={s.srOnly}>Category</legend>
            {OPTIONS.map(({ id, label, Icon }) => (
              <label key={id} className={s.opt}>
                <input type="radio" name="cat" checked={c === id} onChange={() => setC(id)} />
                <span className={s.optIcon}><Icon width={20} height={20} /></span>
                <span className={s.optLabel}>{label}</span>
                <span className={s.radio} aria-hidden="true" />
              </label>
            ))}
          </fieldset>
          <label className={`${s.opt} ${s.optSwitch}`}>
            <input type="checkbox" checked={l} onChange={(e) => setL(e.target.checked)} />
            <span className={s.optLabel}>Hide ended and sold-out items</span>
            <span className={s.switch} aria-hidden="true" />
          </label>
        </div>
        <footer className={s.dlgFoot}>
          <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={() => { setC('all'); setL(false) }}>Clear</button>
          <button className={`${s.btn} ${s.btnClaim}`}>Apply</button>
        </footer>
      </form>
    </dialog>
  )
})
