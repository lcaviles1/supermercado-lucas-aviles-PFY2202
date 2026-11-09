import { Suspense, useEffect, useRef } from 'react'
import { ShoppingBasket, ChevronRight, CircleAlert, LayoutGrid, Plus, ShoppingCart } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useInventory } from '../inventory/InventoryProvider.jsx'

export default function AppLayout() {
  const { state, canPersist } = useInventory()
  const { pathname } = useLocation()
  const main = useRef(null)
  const cartCount = Object.values(state.cart).reduce((total, units) => total + units, 0)
  const isCart = pathname === '/carrito'
  const section = isCart ? 'Carrito' : 'Inventario'

  useEffect(() => {
    window.scrollTo(0, 0)
    main.current.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="min-h-screen lg:pl-[248px]">
      <a className="skip-link" href="#contenido" onClick={(event) => {
        event.preventDefault()
        main.current.focus()
      }}>Saltar al contenido</a>

      <aside className="bg-sidebar text-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[248px] lg:flex-col">
        <Link to="/inventario" className="flex items-center gap-3 px-5 pb-4 pt-5 sm:px-6 lg:pb-10 lg:pt-8">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime text-sidebar">
            <ShoppingBasket size={25} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[1.3rem] font-bold leading-6 tracking-tight">Abasto</span>
            <span className="block text-xs text-sidebar-muted">Panel de supermercado</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="px-3 pb-3 sm:px-5 lg:px-4">
          <p className="mb-3 hidden px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sidebar-muted lg:block">Operaciones</p>
          <div className="grid grid-cols-3 gap-1.5 lg:grid-cols-1">
            <NavLink to="/inventario" end className={({ isActive }) => {
              const inInventory = pathname.startsWith('/inventario/') && pathname !== '/inventario/nuevo'
              return isActive || inInventory ? 'nav-item nav-active' : 'nav-item'
            }}>
              <LayoutGrid size={18} aria-hidden="true" /> <span>Inventario</span>
            </NavLink>
            <NavLink to="/inventario/nuevo" className="nav-item">
              <Plus size={18} aria-hidden="true" /> <span className="lg:hidden">Registrar</span><span className="hidden lg:inline">Registrar artículo</span>
            </NavLink>
            <NavLink to="/carrito" className="nav-item" aria-label={cartCount ? `Carrito, ${cartCount} unidades reservadas` : undefined}>
              <ShoppingCart size={18} aria-hidden="true" /> <span>Carrito</span>
              {cartCount > 0 && <span className="nav-count" aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}
            </NavLink>
          </div>
        </nav>

        <div className="mt-auto hidden px-6 pb-7 lg:block">
          <div className="border-t border-white/15 pt-5 text-xs leading-5 text-sidebar-muted">
            <p className="font-semibold text-white">Desarrollo Frontend II</p>
            <p>PFY2202 · Experiencia 1</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-[75vh] flex-col lg:min-h-screen">
        <div className="border-b border-line bg-white">
          <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between px-4 sm:px-8 xl:px-10">
            <p className="flex items-center gap-2 text-xs font-medium text-muted sm:text-sm">
              Supermercado <ChevronRight size={14} aria-hidden="true" /> <span className="font-semibold text-ink">{section}</span>
            </p>
            <span className="hidden items-center gap-2 text-xs font-medium text-muted sm:flex">
              <span className="size-2 rounded-full bg-brand" aria-hidden="true" /> Entorno de demostración
            </span>
          </div>
        </div>

        <main id="contenido" tabIndex={-1} ref={main} className="mx-auto w-full max-w-[1380px] grow px-4 py-7 outline-none sm:px-8 sm:py-9 xl:px-10">
          {!canPersist && <p role="status" className="notice mb-5"><CircleAlert size={18} aria-hidden="true" /> El almacenamiento del navegador no está disponible. Los cambios duran hasta que cierres o recargues la página.</p>}
          <Suspense fallback={<p role="status" className="panel p-6 text-sm text-muted">Cargando vista…</p>}>
            <Outlet />
          </Suspense>
        </main>

        <footer className="mx-auto w-full max-w-[1380px] px-4 pb-5 text-xs leading-5 text-muted sm:px-8 xl:px-10">
          Lucas Avilés
        </footer>
      </div>
    </div>
  )
}
