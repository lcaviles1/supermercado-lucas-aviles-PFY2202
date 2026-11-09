import { MapPinOff, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeading } from '../components/UI.jsx'

export default function NotFound({ article = false }) {
  const title = article ? 'Artículo no encontrado' : 'Página no encontrada'
  return (
    <>
      <PageHeading label={article ? 'Inventario' : 'Navegación'} title={title} />
      <div className="panel">
        <EmptyState icon={article ? PackageSearch : MapPinOff} title="Vuelve al listado"
          description={article ? 'El código de este artículo no está en el inventario de este navegador.' : 'La dirección que abriste no corresponde a una pantalla de Abasto.'}>
          <Link className="button button-primary" to="/inventario">Ver inventario</Link>
        </EmptyState>
      </div>
    </>
  )
}
