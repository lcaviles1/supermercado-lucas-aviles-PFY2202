import { useState } from 'react'
import { ArrowRight, Check, CircleAlert, ShoppingCart } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ProductIcon, StockBadge } from '../components/Product.jsx'
import { BackLink, PageHeading, QuantityStepper } from '../components/UI.jsx'
import { categories } from '../inventory/catalog.js'
import { useInventory } from '../inventory/InventoryProvider.jsx'
import { clp, selectAvailable } from '../inventory/model.js'
import NotFound from './NotFound.jsx'

function ArticleDetail({ item, returnSearch }) {
  const { state, dispatch } = useInventory()
  const [requested, setRequested] = useState(1)
  const [message, setMessage] = useState('')
  const available = selectAvailable(state, item)
  const reserved = item.stock - available
  const quantity = Math.min(requested, available)

  function addToCart() {
    if (quantity < 1) return
    dispatch({ type: 'cart/adjusted', id: item.id, delta: quantity })
    setMessage(quantity === 1 ? 'Agregaste 1 unidad al carrito.' : `Agregaste ${quantity} unidades al carrito.`)
    setRequested(1)
  }

  return (
    <>
      <div className="mb-5"><BackLink to={{ pathname: '/inventario', search: returnSearch }}>Volver al inventario</BackLink></div>
      <PageHeading label={categories[item.category]} title={item.name} description={item.description} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)]">
        <section className="panel p-5 sm:p-7" aria-labelledby="ficha">
          <div className="flex flex-wrap items-center gap-4 border-b border-line pb-5 sm:gap-5">
            <ProductIcon category={item.category} large />
            <div>
              <p className="eyebrow mb-1">{item.sku}</p>
              <h2 id="ficha" className="text-xl font-bold tracking-tight">Ficha del artículo</h2>
              <div className="mt-2"><StockBadge available={available} /></div>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 pt-5">
            <div><dt className="data-label">Categoría</dt><dd className="data-value">{categories[item.category]}</dd></div>
            <div><dt className="data-label">Precio unitario</dt><dd className="data-value">{clp.format(item.price)}</dd></div>
            <div><dt className="data-label">Stock total</dt><dd className="data-value">{item.stock} unidades</dd></div>
            <div><dt className="data-label">Stock disponible</dt><dd className="data-value">{available} unidades</dd></div>
            <div><dt className="data-label">Reservadas en el carrito</dt><dd className="data-value">{reserved} unidades</dd></div>
          </dl>
        </section>

        <section className="panel p-5 sm:p-7" aria-labelledby="reserva">
          <p className="eyebrow mb-2">Carrito de compras</p>
          <h2 id="reserva" className="text-xl font-bold tracking-tight">Reservar unidades</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Las unidades agregadas se descuentan del stock disponible.</p>

          {available > 0 ? (
            <>
              <div className="my-5 flex flex-wrap items-center justify-between gap-3">
                <QuantityStepper label="cantidad a agregar" quantity={quantity} min={1} max={available}
                  onChange={(delta) => { setRequested(quantity + delta); setMessage('') }} />
                <span className="font-bold tabular-nums">{clp.format(item.price * quantity)}</span>
              </div>
              <button type="button" className="button button-primary w-full" onClick={addToCart}>
                <ShoppingCart size={18} aria-hidden="true" /> Agregar al carrito
              </button>
            </>
          ) : (
            <p className="notice mt-5"><CircleAlert size={18} aria-hidden="true" /> No hay unidades disponibles para agregar.</p>
          )}

          <div role="status">
            {message && <p className="notice notice-success mt-4"><Check size={18} aria-hidden="true" />{message}</p>}
          </div>
          <Link to="/carrito" className="back-link mt-5">Ver carrito <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </div>
    </>
  )
}

export default function ArticlePage() {
  const { id } = useParams()
  const { search } = useLocation()
  const { state } = useInventory()
  const item = state.items.find((article) => article.id === id)
  return item ? <ArticleDetail key={id} item={item} returnSearch={search} /> : <NotFound article />
}
