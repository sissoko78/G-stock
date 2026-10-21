import { Icon } from './Icon'

interface SearchBoxProps { value: string; onChange: (value: string) => void; placeholder?: string }
export function SearchBox({ value, onChange, placeholder = 'Rechercher…' }: SearchBoxProps) {
  return <label className="search-box"><Icon name="search" size={17} />
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    <kbd>Ctrl K</kbd>
  </label>
}
