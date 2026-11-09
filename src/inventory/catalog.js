export const categories = {
  despensa: 'Despensa',
  frescos: 'Frutas y verduras',
  lacteos: 'Lácteos',
  panaderia: 'Panadería',
  bebidas: 'Bebidas',
  limpieza: 'Limpieza',
}

export const stockThreshold = 5

const sampleRows = [
  ['DES-001', 'Arroz grano largo', 'despensa', 'Bolsa de 1 kg', 1590, 24],
  ['FRU-001', 'Manzana Fuji', 'frescos', 'Bolsa de 1 kg', 2190, 18],
  ['LAC-001', 'Leche entera', 'lacteos', 'Caja de 1 L', 1290, 12],
  ['PAN-001', 'Pan de molde integral', 'panaderia', 'Paquete de 500 g', 2490, 4],
  ['BEB-001', 'Agua mineral sin gas', 'bebidas', 'Botella de 1,5 L', 890, 36],
  ['LIM-001', 'Lavalozas limón', 'limpieza', 'Botella de 750 ml', 1890, 0],
  ['FRU-002', 'Zanahoria', 'frescos', 'Bolsa de 1 kg', 1190, 8],
  ['DES-002', 'Lentejas', 'despensa', 'Bolsa de 500 g', 1790, 5],
]

export const initialInventory = {
  items: sampleRows.map(([sku, name, category, description, price, stock]) => ({
    id: sku.toLowerCase(), sku, name, category, description, price, stock,
  })),
  cart: {},
}
