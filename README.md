# Exp1_S3_Claudia_Álvarez

**Abasto** es un panel de supermercado para registrar artículos, consultar existencias por categoría y reservar unidades en un carrito. Proyecto de Desarrollo Frontend II (PFY2202), Experiencia 1, Semana 3, forma B.

**Estudiante** · Claudia Álvarez

**Colaboración** · Lucas Avilés

[Abrir Abasto en GitHub Pages](https://lcaviles1.github.io/supermercado-claudia-alvarez-PFY2202/)

## Ejecutar en local

Requiere Node.js 22.12 o posterior dentro de la línea 22, o una versión LTS más reciente compatible.

```bash
npm ci
npm run dev
```

Abre la dirección que imprime Vite. Usa `npm test` para ejecutar las pruebas de la lógica de inventario y `npm run build` para generar la versión de producción en `dist/`.

## Usar el panel

El inventario comienza con artículos de demostración. Puedes filtrar por categoría y combinar el filtro con una búsqueda por nombre, código o descripción. El contador del catálogo muestra los resultados visibles y el resumen superior conserva las cifras del inventario completo.

Para probar la reserva, abre **Pan de molde integral**, que parte con cuatro unidades, y agrégalo al carrito. El stock disponible baja a tres. En el carrito, **+** reserva otra unidad si hay stock y **−** la devuelve. Al disminuir a cero o quitar la línea, el artículo sale del carrito y las unidades restantes vuelven a estar disponibles.

**Registrar artículo** incorpora productos con un SKU único, categoría, descripción, precio unitario en pesos chilenos y stock inicial. El inventario y el carrito se guardan en el almacenamiento local del navegador. Cada navegador tiene sus propios datos de demostración y cambios.

## Estructura

- `src/AppRoutes.jsx` centraliza rutas anidadas y carga cada pantalla bajo demanda. El detalle usa el parámetro `:id` y las URLs con hash permiten abrir y recargar enlaces directos en GitHub Pages.
- `src/inventory/` concentra el catálogo, la validación y el estado compartido con Context y `useReducer`. La disponibilidad se calcula restando la reserva del stock total. El reducer valida los límites antes de aplicar cada cambio.
- `src/pages/` contiene las pantallas de inventario, alta, detalle y carrito. `src/components/` comparte el layout, fichas visuales, estados vacíos y controles de cantidad.
- `src/styles.css` define el tema de Tailwind CSS. En pantallas pequeñas, cada fila del catálogo conserva todos sus campos en formato de ficha.
