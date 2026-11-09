import { categories, initialInventory } from './catalog.js'

const storageKey = 'abasto.pfy2202.inventory.v1'
const limits = { price: 9_999_999, stock: 999_999 }
const skuPattern = /^[A-Z0-9][A-Z0-9-]{2,19}$/

export const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

function cartQuantity(cart, id) {
  return Object.hasOwn(cart, id) ? cart[id] : 0
}

export function selectAvailable(state, item) {
  return item.stock - cartQuantity(state.cart, item.id)
}

export function selectCart(state) {
  return state.items
    .filter((item) => Object.hasOwn(state.cart, item.id))
    .map((item) => ({
      ...item,
      quantity: state.cart[item.id],
      available: selectAvailable(state, item),
    }))
}

export function filterItems(items, category, search) {
  const simplify = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const query = simplify(search.trim())
  return items.filter((item) =>
    (!category || item.category === category) &&
    simplify(`${item.name} ${item.sku} ${item.description}`).includes(query),
  )
}

function isIntegerInRange(value, min, max) {
  return Number.isSafeInteger(value) && value >= min && value <= max
}

export function validateItem(fields, items) {
  const sku = fields.sku.trim().toUpperCase()
  const name = fields.name.trim()
  const description = fields.description.trim()
  const errors = {}
  const price = Number(fields.price)
  const stock = Number(fields.stock)

  if (name.length < 2 || name.length > 70) errors.name = 'Ingresa entre 2 y 70 caracteres.'
  if (!skuPattern.test(sku)) errors.sku = 'Usa entre 3 y 20 letras, números o guiones. Empieza con una letra o un número.'
  else if (items.some((item) => item.sku === sku)) errors.sku = 'Ya existe un artículo con este código.'
  if (!Object.hasOwn(categories, fields.category)) errors.category = 'Selecciona una categoría.'
  if (description.length < 2 || description.length > 180) errors.description = 'Ingresa entre 2 y 180 caracteres.'
  if (String(fields.price).trim() === '' || !isIntegerInRange(price, 1, limits.price)) {
    errors.price = 'Ingresa un precio entero entre $1 y $9.999.999.'
  }
  if (String(fields.stock).trim() === '' || !isIntegerInRange(stock, 0, limits.stock)) {
    errors.stock = 'Ingresa una cantidad entera entre 0 y 999.999.'
  }

  return {
    errors,
    item: { id: sku.toLowerCase(), sku, name, category: fields.category, description, price, stock },
  }
}

export function inventoryReducer(state, action) {
  if (action.type === 'item/added') {
    const { errors, item } = validateItem(action.fields, state.items)
    if (Object.keys(errors).length > 0) return state
    return { ...state, items: [...state.items, item] }
  }

  if (action.type === 'cart/adjusted') {
    const item = state.items.find(({ id }) => id === action.id)
    if (!item || !Number.isSafeInteger(action.delta) || action.delta === 0) return state

    const next = cartQuantity(state.cart, item.id) + action.delta
    if (!isIntegerInRange(next, 0, item.stock)) return state

    const cart = { ...state.cart }
    if (next === 0) delete cart[item.id]
    else cart[item.id] = next
    return { ...state, cart }
  }

  if (action.type === 'cart/removed') {
    if (!Object.hasOwn(state.cart, action.id)) return state
    const cart = { ...state.cart }
    delete cart[action.id]
    return { ...state, cart }
  }

  return state
}

export function readInventory() {
  try {
    const snapshot = JSON.parse(localStorage.getItem(storageKey))
    if (!snapshot || !Array.isArray(snapshot.items) || !snapshot.cart ||
        typeof snapshot.cart !== 'object' || Array.isArray(snapshot.cart)) {
      return initialInventory
    }

    const items = []
    const cart = {}
    for (const raw of snapshot.items) {
      const { errors, item } = validateItem(raw, items)
      if (Object.keys(errors).length > 0 || item.id !== raw.id) return initialInventory
      items.push(item)
      const quantity = cartQuantity(snapshot.cart, item.id)
      if (isIntegerInRange(quantity, 1, item.stock)) cart[item.id] = quantity
    }
    return { items, cart }
  } catch {
    return initialInventory
  }
}

export function saveInventory(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
