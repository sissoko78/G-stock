import { useState, type FormEvent } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../../shared/services/firebase'
import { Field } from '../../shared/components/ui/Field'
import { Button } from '../../shared/components/ui/Button'
import { PasswordInput } from '../../shared/components/ui/PasswordInput'

async function authenticate(email: string, password: string): Promise<string | null> {
  if (!firebaseAuth) return 'La connexion Firebase n’est pas configurée.'
  try { await signInWithEmailAndPassword(firebaseAuth, email.trim(), password); return null }
  catch { return 'Adresse e-mail ou mot de passe incorrect.' }
}

export function SignInPage({ configError }: { configError?: string | null }) {
  return <main className="auth-screen"><section className="auth-card"><AuthBrand/><div className="eyebrow">ESPACE SÉCURISÉ</div>
    <h1>Connexion à G-stock</h1><p className="auth-description">Connectez-vous avec les identifiants fournis par votre administrateur.</p>
    {configError && <div className="auth-alert" role="alert">{configError}</div>}<SignInForm disabled={Boolean(configError)}/>
    <p className="auth-footnote">Les comptes sont créés par l’équipe G-stock. L’inscription publique est désactivée.</p>
  </section></main>
}

function AuthBrand() {
  return <div className="auth-brand"><span className="brand-mark">G</span><span className="brand-name">g<span>stock</span><small>GESTION DE STOCK</small></span></div>
}

function SignInForm({ disabled }: { disabled: boolean }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => submitCredentials(event, email, password, setError, setIsSubmitting)
  return <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
    <Field label="Adresse e-mail"><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)}/></Field>
    <Field label="Mot de passe"><PasswordInput autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)}/></Field>
    {error && <div className="auth-alert" role="alert">{error}</div>}
    <Button type="submit" disabled={disabled || isSubmitting}>{isSubmitting ? 'Connexion…' : 'Se connecter'}</Button>
  </form>
}

async function submitCredentials(event: FormEvent<HTMLFormElement>, email: string, password: string, setError: (value: string | null) => void, setIsSubmitting: (value: boolean) => void) {
  event.preventDefault()
  setError(null)
  setIsSubmitting(true)
  setError(await authenticate(email, password))
  setIsSubmitting(false)
}
