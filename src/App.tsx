import { useRef } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { Feed } from './components/Feed'
import { BagIcon, EyeIcon, HomeIcon, LiveIcon, MoonIcon, PlusIcon, SunIcon } from './components/Icons'
import { SellDialog } from './components/SellDialog'
import { Sparkline } from './components/Sparkline'
import { Toasts } from './components/Toasts'
import { useTheme } from './hooks/useTheme'
import { control } from './mocks/control'
import { useCart } from './store/cartStore'
import { useFeed } from './store/feedStore'
import s from './app.module.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const cart = useRef<HTMLDialogElement>(null)
  const sell = useRef<HTMLDialogElement>(null)
  const count = useCart((c) => c.lines.length)
  const viewers = useFeed((f) => f.viewers)
  const history = useFeed((f) => f.viewerHistory)
  const close = (r: React.RefObject<HTMLDialogElement | null>) => () => r.current?.open && r.current.close()
  const openCart = () => cart.current?.showModal()
  const openSell = () => sell.current?.showModal()
  const goTo = (id: string) => () =>
    id === 'top' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <a href="#main" className={s.skip}>Skip to the live drop</a>
      <header className={s.header}>
        <div className={s.headerRow}>
          <a href="/" className={s.logo} aria-label="SokoLive home">Soko<b>Live</b></a>
          <nav className={s.nav} aria-label="Sections">
            <button onClick={goTo('live')}>On air</button>
            <button onClick={goTo('wall')}>Just dropped</button>
          </nav>
          <span className={s.spacer} />
          {viewers > 0 && (
            <p className={s.viewers} aria-label={`${viewers} viewers now`}>
              <EyeIcon width={16} height={16} />
              <span><b>{viewers}</b> <i>viewers now</i></span>
              <Sparkline values={history} />
            </p>
          )}
          <button className={`${s.btn} ${s.sellBtn}`} onClick={openSell}>
            <PlusIcon width={16} height={16} /> Sell
          </button>
          <button className={s.iconBtn} onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className={s.iconBtn} onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <BagIcon />
            {count > 0 && <span className={s.badge} aria-hidden="true">{count}</span>}
          </button>
        </div>
      </header>

      <Feed />

      <footer className={s.footer}>
        <p className={s.footLogo}>Soko<b>Live</b></p>
        <p>Live thrift &amp; sneaker drops from Nairobi. A portfolio demo with a mocked API.</p>
        <button className={s.linkBtn} onClick={() => { control.offline = !control.offline }}>
          Toggle simulated network failure
        </button>
      </footer>

      <nav className={s.tabs} aria-label="Primary">
        <button onClick={goTo('top')}><HomeIcon /><span>Home</span></button>
        <button onClick={goTo('live')}><LiveIcon /><span>Live</span></button>
        <button onClick={openSell}><PlusIcon /><span>Sell</span></button>
        <button onClick={openCart} aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
          <span className={s.tabIcon}><BagIcon />{count > 0 && <span className={s.badge} aria-hidden="true">{count}</span>}</span>
          <span>Cart</span>
        </button>
      </nav>

      <CartDrawer ref={cart} onClose={close(cart)} />
      <SellDialog ref={sell} onClose={close(sell)} />
      <Toasts />
    </>
  )
}
