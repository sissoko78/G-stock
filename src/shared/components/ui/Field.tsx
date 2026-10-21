import type { InputHTMLAttributes, ReactNode } from 'react'

interface FieldProps { label: string; children: ReactNode; hint?: string; error?: string }
export function Field({ label, children, hint, error }: FieldProps) {
  return <label className="form-field"><span>{label}</span>{children}
    {error ? <small className="field-error">{error}</small> : hint && <small>{hint}</small>}
  </label>
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>
