import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initialInventory } from '../src/inventory/catalog.js'
import { filterItems, inventoryReducer, selectAvailable, selectCart, validateItem } from '../src/inventory/model.js'

const bread = initialInventory.items.find((item) => item.sku === 'PAN-001')
const form = { name: 'Café de grano', sku: ' des-099 ', category: 'despensa', description: 'Bolsa de 500 g', price: '4290', stock: '3' }

function adjust(state, delta, id = bread.id) {
  return inventoryReducer(state, { type: 'cart/adjusted', id, delta })
}

test('las reservas respetan el stock incluso si se reciben aumentos seguidos', () => {
  const partial = adjust(initialInventory, 3)
  const full = adjust(partial, 1)
  assert.equal(selectAvailable(partial, bread), 1)
  assert.equal(selectAvailable(full, bread), 0)
  assert.equal(selectCart(full)[0].quantity, 4)
  assert.equal(adjust(full, 1), full)
  assert.equal(adjust(full, -5), full)
  assert.equal(adjust(full, 0.5), full)
  assert.equal(adjust(full, 1, 'lim-001'), full)
  assert.equal(adjust(full, 1, 'no-existe'), full)
  assert.equal(selectAvailable(initialInventory, bread), 4)
})

test('disminuir a cero o quitar una línea libera todas sus unidades', () => {
  const reserved = adjust(initialInventory, 2)
  const reduced = adjust(reserved, -1)
  assert.equal(selectAvailable(reduced, bread), 3)
  const emptied = adjust(reduced, -1)
  const removed = inventoryReducer(reserved, { type: 'cart/removed', id: bread.id })
  for (const state of [emptied, removed]) {
    assert.equal(selectAvailable(state, bread), 4)
    assert.deepEqual(selectCart(state), [])
    assert.equal(state.items, initialInventory.items)
  }
})

test('el alta normaliza el SKU y rechaza duplicados y cantidades inválidas', () => {
  const added = inventoryReducer(initialInventory, { type: 'item/added', fields: form })
  assert.equal(added.items.length, initialInventory.items.length + 1)
  assert.deepEqual(added.items.at(-1), {
    id: 'des-099', sku: 'DES-099', name: 'Café de grano', category: 'despensa',
    description: 'Bolsa de 500 g', price: 4290, stock: 3,
  })
  assert.equal(inventoryReducer(added, { type: 'item/added', fields: form }), added)
  for (const invalid of ['-1', '3.5', '', '1000000']) {
    assert.ok(validateItem({ ...form, stock: invalid }, []).errors.stock)
  }
  assert.deepEqual(validateItem({ ...form, stock: '0' }, []).errors, {})
})

test('el filtro combina búsqueda y categoría sin reemplazar el catálogo', () => {
  const added = inventoryReducer(initialInventory, { type: 'item/added', fields: form })
  const ids = added.items.map((item) => item.id)
  assert.deepEqual(filterItems(added.items, 'despensa', 'cafe').map((item) => item.id), ['des-099'])
  assert.deepEqual(filterItems(added.items, 'lacteos', 'cafe'), [])
  assert.deepEqual(filterItems(added.items, '', '').map((item) => item.id), ids)
})

test('un SKU igual a un nombre heredado de Object funciona como cualquier otro', () => {
  const added = inventoryReducer(initialInventory, { type: 'item/added', fields: { ...form, sku: 'constructor' } })
  const item = added.items.at(-1)
  assert.equal(selectAvailable(added, item), 3)
  const reserved = adjust(added, 1, item.id)
  assert.equal(selectAvailable(reserved, item), 2)
  assert.equal(selectCart(reserved)[0].id, 'constructor')
})
