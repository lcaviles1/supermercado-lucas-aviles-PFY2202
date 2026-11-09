import { Apple, Droplet, Milk, Package, Sandwich, Sparkles, Wheat } from 'lucide-react'
import { stockThreshold } from '../inventory/catalog.js'

const categoryStyle = {
  despensa: [Wheat, 'bg-amber-100 text-amber-800'],
  frescos: [Apple, 'bg-emerald-100 text-emerald-800'],
  lacteos: [Milk, 'bg-sky-100 text-sky-800'],
  panaderia: [Sandwich, 'bg-orange-100 text-orange-800'],
  bebidas: [Droplet, 'bg-cyan-100 text-cyan-800'],
  limpieza: [Sparkles, 'bg-violet-100 text-violet-800'],
}

export function ProductIcon({ category, large = false }) {
  const [Icon, tone] = categoryStyle[category] ?? [Package, 'bg-brand-soft text-brand']
  const size = large ? 'size-20 rounded-2xl sm:size-25' : 'size-10 rounded-xl'

  return (
    <span className={`grid shrink-0 place-items-center ${tone} ${size}`} aria-hidden="true">
      <Icon size={large ? 39 : 20} strokeWidth={1.8} />
    </span>
  )
}

export function StockBadge({ available }) {
  if (available === 0) return <span className="badge bg-red-50 text-red-800">Agotado</span>
  if (available <= stockThreshold) return <span className="badge bg-amber-50 text-amber-900">Stock bajo</span>
  return <span className="badge bg-emerald-50 text-emerald-800">Disponible</span>
}
