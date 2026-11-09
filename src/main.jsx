import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { InventoryProvider } from './inventory/InventoryProvider.jsx'
import AppRoutes from './AppRoutes.jsx'
import '@fontsource-variable/inter'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <InventoryProvider>
        <AppRoutes />
      </InventoryProvider>
    </HashRouter>
  </StrictMode>,
)
