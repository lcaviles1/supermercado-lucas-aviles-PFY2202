import { ArrowUpRight, Boxes, ChevronDown, CircleAlert, Layers3, PackageSearch, Plus, Search, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductIcon, StockBadge } from '../components/Product.jsx'
import { EmptyState, PageHeading } from '../components/UI.jsx'
import { categories, stockThreshold } from '../inventory/catalog.js'
import { useInventory } from '../inventory/InventoryProvider.jsx'
import { clp, filterItems, selectAvailable } from '../inventory/model.js'

function InventoryStats({ items }) {
  const available = items.reduce((total, item) => total + item.available, 0)
  const needsRestock = items.filter((item) => item.available <= stockThreshold).length
  const metrics = [
    { title: 'Artículos registrados', shortTitle: 'Artículos', value: items.length, note: 'En el catálogo', icon: Layers3, featured: true },
    { title: 'Unidades disponibles', shortTitle: 'Unidades libres', value: available, note: 'Stock libre en inventario', icon: Boxes },
    { title: 'Por reponer', value: needsRestock, note: 'Con 5 unidades o menos', icon: CircleAlert },
  ]

  return (
    <section aria-label="Resumen del inventario" className="mb-7 grid grid-cols-3 gap-2 sm:gap-4">
      {metrics.map(({ title, shortTitle, value, note, icon: Icon, featured }) => (
        <div key={title} className={featured ? 'metric metric-featured' : 'metric panel'}>
          <span className="metric-icon"><Icon size={21} aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className="metric-label"><span className="sm:hidden">{shortTitle ?? title}</span><span className="hidden sm:inline">{title}</span></p>
            <p className="mt-1 text-[1.8rem] font-bold leading-8 tracking-tight tabular-nums sm:text-[2rem]">{value.toLocaleString('es-CL')}</p>
            <p className="metric-note mt-1">{note}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

function InventoryTable({ items, search }) {
  return (
    <table className="inventory-table" role="table" aria-label="Artículos del inventario">
      <thead role="rowgroup">
        <tr role="row">
          <th scope="col" role="columnheader">Artículo</th>
          <th scope="col" role="columnheader">Categoría</th>
          <th scope="col" role="columnheader">Precio</th>
          <th scope="col" role="columnheader">Stock disponible</th>
          <th scope="col" role="columnheader">Estado</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {items.map((item) => (
          <tr role="row" key={item.id}>
            <td role="cell" className="inventory-name">
              <Link to={{ pathname: `/inventario/articulos/${item.id}`, search }} className="group flex min-w-0 items-center gap-3 rounded-md">
                <ProductIcon category={item.category} />
                <div className="min-w-0">
                  <span className="flex items-baseline gap-1.5 font-semibold text-ink group-hover:text-brand group-hover:underline">
                    <span className="min-w-0 break-words">{item.name}</span>
                    <ArrowUpRight size={14} className="shrink-0 self-center text-muted group-hover:text-brand" aria-hidden="true" />
                  </span>
                  <span className="mt-0.5 block break-words text-xs leading-5 text-muted">{item.sku} · {item.description}</span>
                </div>
              </Link>
            </td>
            <td role="cell" className="inventory-category text-muted">{categories[item.category]}</td>
            <td role="cell" className="inventory-price font-semibold tabular-nums">
              <span className="mobile-cell-label">Precio</span>{clp.format(item.price)}
            </td>
            <td role="cell" className="inventory-stock font-semibold tabular-nums">
              <span className="mobile-cell-label">Stock disponible</span>{item.available} <span className="text-xs font-normal text-muted">un.</span>
            </td>
            <td role="cell" className="inventory-status"><StockBadge available={item.available} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function InventoryPage() {
  const { state } = useInventory()
  const [params, setParams] = useSearchParams()
  const categoryParam = params.get('categoria')
  const category = Object.hasOwn(categories, categoryParam) ? categoryParam : ''
  const search = params.get('buscar') ?? ''
  const items = state.items.map((item) => ({ ...item, available: selectAvailable(state, item) }))
  const filtered = filterItems(items, category, search)

  function changeFilter(key, value, replace) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace })
  }

  return (
    <>
      <PageHeading label="Control de stock" title="Inventario"
        description="Consulta existencias, registra artículos y reserva unidades en el carrito.">
        <Link to="/inventario/nuevo" className="button button-primary"><Plus size={19} aria-hidden="true" /> Registrar artículo</Link>
      </PageHeading>

      <InventoryStats items={items} />

      <section className="panel overflow-hidden" aria-labelledby="catalogo">
        <div className="px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
          <h2 id="catalogo" className="text-xl font-bold tracking-tight">Catálogo de artículos</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">Selecciona un artículo para consultar su detalle.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12.5rem,0.48fr)]">
            <label>
              <span className="field-label">Buscar</span>
              <span className="relative block">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input type="search" className="field pl-9" placeholder="Nombre, código o descripción"
                  value={search} onChange={(event) => changeFilter('buscar', event.target.value, true)} />
              </span>
            </label>
            <label>
              <span className="field-label">Categoría</span>
              <span className="relative block">
                <select className="field appearance-none pr-9" value={category}
                  onChange={(event) => changeFilter('categoria', event.target.value, false)}>
                  <option value="">Todas las categorías</option>
                  {Object.entries(categories).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              </span>
            </label>
          </div>

          <div className="mt-4 flex min-h-7 flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted" role="status">
              {filtered.length} de {items.length} artículos
            </p>
            {(category || search) && (
              <button className="back-link" type="button" onClick={() => setParams({})}>
                <X size={15} aria-hidden="true" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <InventoryTable items={filtered} search={params.toString()} />
        ) : (
          <EmptyState icon={PackageSearch} title="Sin resultados" description="Prueba con otro nombre o categoría para encontrar un artículo." />
        )}
      </section>
    </>
  )
}
