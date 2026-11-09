import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { inventoryReducer, readInventory, saveInventory } from './model.js'

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, undefined, readInventory)
  const [canPersist, setCanPersist] = useState(true)

  useEffect(() => {
    setCanPersist(saveInventory(state))
  }, [state])

  return (
    <InventoryContext.Provider value={{ state, dispatch, canPersist }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  return useContext(InventoryContext)
}
