import { useRef, useState } from 'react'
import { ChevronDown, CircleAlert, PackagePlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BackLink, PageHeading } from '../components/UI.jsx'
import { categories } from '../inventory/catalog.js'
import { useInventory } from '../inventory/InventoryProvider.jsx'
import { validateItem } from '../inventory/model.js'

const emptyFields = { name: '', sku: '', category: '', description: '', price: '', stock: '' }

function FormField({ name, label, error, hint, children }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>{label}</label>
      {children}
      {hint && <p id={`${name}-hint`} className="mt-1.5 text-xs leading-5 text-muted">{hint}</p>}
      {error && <p id={`${name}-error`} className="mt-1.5 text-xs font-medium leading-5 text-red-800">{error}</p>}
    </div>
  )
}

export default function NewArticlePage() {
  const { state, dispatch } = useInventory()
  const navigate = useNavigate()
  const [fields, setFields] = useState(emptyFields)
  const [errors, setErrors] = useState({})
  const form = useRef(null)

  function submit(event) {
    event.preventDefault()
    const { errors: nextErrors, item } = validateItem(fields, state.items)
    const firstError = Object.keys(nextErrors)[0]
    setErrors(nextErrors)

    if (firstError) {
      form.current.elements.namedItem(firstError).focus()
      return
    }

    dispatch({ type: 'item/added', fields })
    navigate(`/inventario/articulos/${item.id}`)
  }

  function fieldProps(name, hasHint = false) {
    const descriptions = [hasHint && `${name}-hint`, errors[name] && `${name}-error`].filter(Boolean)
    return {
      id: name,
      name,
      className: 'field',
      required: true,
      value: fields[name],
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': descriptions.join(' ') || undefined,
      onChange: (event) => {
        const { value } = event.target
        setFields((current) => ({ ...current, [name]: value }))
        setErrors((current) => {
          if (!current[name]) return current
          const next = { ...current }
          delete next[name]
          return next
        })
      },
    }
  }

  return (
    <>
      <div className="mb-5"><BackLink to="/inventario">Volver al inventario</BackLink></div>
      <PageHeading label="Control de stock" title="Registrar artículo"
        description="Completa la ficha para incorporar un nuevo artículo al inventario." />

      <form className="panel max-w-3xl" noValidate ref={form} onSubmit={submit}>
        <div className="flex items-center gap-3 border-b border-line px-5 py-5 sm:px-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><PackagePlus size={22} aria-hidden="true" /></span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Datos del artículo</h2>
            <p className="mt-1 text-xs leading-5 text-muted">Todos los campos son obligatorios.</p>
          </div>
        </div>

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
          <FormField name="name" label="Nombre del artículo" error={errors.name}>
            <input {...fieldProps('name')} maxLength={70} placeholder="Ej. Aceite de oliva" />
          </FormField>

          <FormField name="sku" label="Código SKU" hint="Código único de 3 a 20 caracteres." error={errors.sku}>
            <input {...fieldProps('sku', true)} maxLength={20} placeholder="Ej. DES-003" autoCapitalize="characters" />
          </FormField>

          <div className="sm:col-span-2">
            <FormField name="category" label="Categoría" error={errors.category}>
              <div className="relative">
                <select {...fieldProps('category')} className="field appearance-none pr-9">
                  <option value="">Selecciona una categoría</option>
                  {Object.entries(categories).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              </div>
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField name="description" label="Descripción o presentación" error={errors.description}>
              <textarea {...fieldProps('description')} rows={3} maxLength={180} placeholder="Ej. Botella de 500 ml" />
            </FormField>
          </div>

          <FormField name="price" label="Precio unitario (CLP)" error={errors.price}>
            <input {...fieldProps('price')} type="number" inputMode="numeric" min="1" max="9999999" step="1" placeholder="Ej. 5490" />
          </FormField>

          <FormField name="stock" label="Stock inicial (unidades)" error={errors.stock}>
            <input {...fieldProps('stock')} type="number" inputMode="numeric" min="0" max="999999" step="1" placeholder="Ej. 20" />
          </FormField>
        </div>

        <div className="border-t border-line px-5 py-5 sm:px-7">
          {Object.keys(errors).length > 0 &&
            <p className="notice mb-4" role="alert"><CircleAlert size={18} aria-hidden="true" /> Revisa los campos marcados antes de guardar.</p>}
          <div className="flex flex-wrap justify-end gap-3">
            <Link to="/inventario" className="button button-secondary">Cancelar</Link>
            <button type="submit" className="button button-primary"><PackagePlus size={18} aria-hidden="true" /> Guardar artículo</button>
          </div>
        </div>
      </form>
    </>
  )
}
