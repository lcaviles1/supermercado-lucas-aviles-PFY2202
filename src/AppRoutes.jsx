import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import NotFound from './pages/NotFound.jsx'

const InventoryPage = lazy(() => import('./pages/InventoryPage.jsx'))
const ArticlePage = lazy(() => import('./pages/ArticlePage.jsx'))
const NewArticlePage = lazy(() => import('./pages/NewArticlePage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/inventario" replace />} />
        <Route path="inventario">
          <Route index element={<InventoryPage />} />
          <Route path="nuevo" element={<NewArticlePage />} />
          <Route path="articulos/:id" element={<ArticlePage />} />
        </Route>
        <Route path="carrito" element={<CartPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
