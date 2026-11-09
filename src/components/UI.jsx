import { useEffect } from 'react'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PageHeading({ label, title, description, children }) {
  useEffect(() => {
    document.title = `${title} · Abasto`
  }, [title])

  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
      <div className="min-w-0">
        <p className="eyebrow mb-2">{label}</p>
        <h1 className="break-words text-3xl font-bold tracking-[-0.05em] text-ink sm:text-[2.5rem] sm:leading-tight">{title}</h1>
        {description && <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-muted sm:text-[0.95rem]">{description}</p>}
      </div>
      {children}
    </header>
  )
}

export function BackLink({ to, children }) {
  return <Link className="back-link" to={to}><ArrowLeft size={16} aria-hidden="true" />{children}</Link>
}

export function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <section className="flex flex-col items-center px-5 py-12 text-center sm:py-16">
      <span className="mb-4 grid size-13 place-items-center rounded-2xl bg-brand-soft text-brand">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </section>
  )
}

export function QuantityStepper({ quantity, onChange, min, max, label }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Disminuir ${label}`} disabled={quantity <= min} onClick={() => onChange(-1)}>
        <Minus size={16} aria-hidden="true" />
      </button>
      <output className="min-w-8 px-1 text-center text-sm font-semibold tabular-nums" aria-label={label}>{quantity}</output>
      <button type="button" aria-label={`Aumentar ${label}`} disabled={quantity >= max} onClick={() => onChange(1)}>
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
