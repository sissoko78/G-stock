import { useState, type InputHTMLAttributes } from 'react'
import { Icon } from './Icon'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  return <span className="password-input">
    <input {...props} type={isVisible ? 'text' : 'password'} />
    <button
      type="button"
      className="password-input-toggle"
      aria-label={isVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      aria-pressed={isVisible}
      onClick={() => setIsVisible(!isVisible)}
    >
      <Icon name={isVisible ? 'eyeOff' : 'eye'} size={18}/>
    </button>
  </span>
}
