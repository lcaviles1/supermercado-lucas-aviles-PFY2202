import { ArrowRight, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductIcon } from '../components/Product.jsx'
import { BackLink, EmptyState, PageHeading, QuantityStepper } from '../components/UI.jsx'
import { useInventory } from '../inventory/InventoryProvider.jsx'
import { clp, selectCart } from '../inventory/model.js'

function CartRow({ item, dispatch }) {
  return (
    <li className="grid items-center gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto] px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:col-span-2">
        <ProductIcon category={item.category} />
        <div className="min-w-0 grow">
          <Link to={`/inventario/articulos/${item.id}`} className="break-words font-semibold hover:text-brand hover:underline">{item.name}</Link>
          <p className="mt-1 break-words text-xs leading-5 text-muted">{item.sku} · {clp.format(item.price)} por unidad</p>
        </div>
        <button type="button" className="icon-button" aria-label={`Quitar ${item.name} del carrito`}
          onClick={() => dispatch({ type: 'cart/removed', id: item.id })}>
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <QuantityStepper label={`cantidad de ${item.name}`} quantity={item.quantity} min={0} max={item.stock}
          onChange={(delta) => dispatch({ type: 'cart/adjusted', id: item.id, delta })} />
        <p className="text-xs leading-5 text-muted">{item.available} un. libres</p>
      </div>
      <p className="text-sm font-bold tabular-nums sm:text-right sm:text-base">{clp.format(item.price * item.quantity)}</p>
    </li>
  )
}

export default function CartPage() {
  const { state, dispatch } = useInventory()
  const items = selectCart(state)
  const units = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + BigInt(item.price) * BigInt(item.quantity), 0n)

  return (
    <>
      <div className="mb-5"><BackLink to="/inventario">Volver al inventario</BackLink></div>
      <PageHeading label="Reservas de stock" title="Carrito de compras"
        description="Al disminuir la cantidad o quitar un artículo, sus unidades vuelven al stock disponible." />
      {items.length === 0 ? (
        <div className="panel">
          <EmptyState icon={ShoppingCart} title="Tu carrito está vacío"
            description="Abre el detalle de un artículo disponible para agregar unidades.">
            <Link to="/inventario" className="button button-primary">Explorar inventario <ArrowRight size={18} aria-hidden="true" /></Link>
          </EmptyState>
        </div>
      ) : (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,0.52fr)]">
          <section className="panel" aria-labelledby="articulos">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-5 sm:px-6">
              <h2 id="articulos" className="text-xl font-bold tracking-tight">Artículos en el carrito</h2>
              <p className="text-xs font-medium text-muted">{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</p>
            </div>
            <ul className="divide-y divide-line">
              {items.map((item) => <CartRow key={item.id} item={item} dispatch={dispatch} />)}
            </ul>
          </section>

          <section className="panel p-5 sm:p-6" aria-labelledby="resumen">
            <p className="eyebrow mb-2">Carrito de compras</p>
            <h2 id="resumen" className="text-xl font-bold tracking-tight">Resumen</h2>
            <dl className="mt-5 space-y-4" aria-live="polite">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <dt className="text-muted">Unidades reservadas</dt><dd className="font-semibold tabular-nums">{units}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
                <dt className="font-semibold">Total del carrito</dt>
                <dd className="text-2xl font-bold tracking-tight text-brand tabular-nums">{clp.format(total)}</dd>
              </div>
            </dl>
            <Link to="/inventario" className="button button-secondary mt-5 w-full">Seguir explorando <ArrowRight size={17} aria-hidden="true" /></Link>
          </section>
        </div>
      )}
    </>
  )
}
