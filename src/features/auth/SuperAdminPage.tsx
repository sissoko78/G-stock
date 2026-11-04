import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { firebaseAuth } from '../../shared/services/firebase'
import { Button } from '../../shared/components/ui/Button'
import { useAuthSession } from './useAuthSession'
import { adminRequest } from './adminApi'
import { useAdminCompanies } from './useAdminCompanies'
import type { CompanySummary } from './adminApi'

interface CompanyInput { companyName: string; ownerName: string; ownerEmail: string; password: string }

export function SuperAdminPage() {
  const { session, signOut } = useAuthSession()
  const list = useAdminCompanies()
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const handleCreate = async (input: CompanyInput) => createCompany(session, input, list.refresh, setNotice, setError)
  const handleResend = async (email: string) => sendAccessLink(email, setNotice, setError)
  return <AdminLayout email={session?.user.email ?? ''} notice={notice} error={error ?? list.error} onSignOut={signOut}>
    <div className="page-heading"><div><div className="eyebrow">ADMINISTRATION G-STOCK</div><h1>Entreprises</h1><p>Créez l’espace d’une entreprise et son premier compte administrateur.</p></div></div>
    <div className="admin-grid"><CompanyForm onCreate={handleCreate}/><CompanyList companies={list.companies} isLoading={list.isLoading} onRefresh={list.refresh} onResend={handleResend}/></div>
    <p className="admin-security-note">Les comptes appartiennent à un espace d’entreprise distinct. Les rôles sont vérifiés côté serveur.</p>
  </AdminLayout>
}

function AdminLayout({ children, email, notice, error, onSignOut }: { children: React.ReactNode; email: string; notice: string | null; error: string | null; onSignOut: () => Promise<void> }) {
  return <div className="admin-page"><header className="admin-topbar"><AdminBrand/><div className="admin-identity"><span>{email}</span><Button variant="secondary" onClick={() => void onSignOut()}>Déconnexion</Button></div></header>
    <main className="admin-content">{notice && <div className="auth-notice" role="status">{notice}</div>}{error && <div className="auth-alert" role="alert">{error}</div>}{children}</main></div>
}

function AdminBrand() {
  return <div className="auth-brand"><span className="brand-mark">G</span><span className="brand-name">g<span>stock</span><small>CONSOLE SAAS</small></span></div>
}

function CompanyForm({ onCreate }: { onCreate: (input: CompanyInput) => Promise<void> }) {
  const [companyName, setCompanyName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = async (event: React.FormEvent<HTMLFormElement>) => submitCompany(event, { companyName, ownerName, ownerEmail, password }, onCreate, setIsSubmitting, () => { setCompanyName(''); setOwnerName(''); setOwnerEmail(''); setPassword('') })
  return <section className="panel admin-form-panel"><div className="panel-head"><div><h2>Nouvelle entreprise</h2><p>Le responsable pourra se connecter avec le mot de passe initial défini ici.</p></div></div>
    <form className="admin-form" onSubmit={(event) => void submit(event)}><CompanyFields companyName={companyName} ownerName={ownerName} ownerEmail={ownerEmail} password={password} setCompanyName={setCompanyName} setOwnerName={setOwnerName} setOwnerEmail={setOwnerEmail} setPassword={setPassword}/>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Création…' : 'Créer l’entreprise'}</Button></form></section>
}

function CompanyFields({ companyName, ownerName, ownerEmail, password, setCompanyName, setOwnerName, setOwnerEmail, setPassword }: { companyName: string; ownerName: string; ownerEmail: string; password: string; setCompanyName: (value: string) => void; setOwnerName: (value: string) => void; setOwnerEmail: (value: string) => void; setPassword: (value: string) => void }) {
  return <><label className="form-field"><span>Nom de l’entreprise</span><input autoComplete="organization" minLength={2} maxLength={100} required value={companyName} onChange={(event) => setCompanyName(event.target.value)}/></label>
    <label className="form-field"><span>Nom du responsable</span><input autoComplete="name" minLength={2} maxLength={100} required value={ownerName} onChange={(event) => setOwnerName(event.target.value)}/></label>
    <label className="form-field"><span>E-mail du responsable</span><input type="email" autoComplete="email" maxLength={254} required value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)}/></label>
    <label className="form-field"><span>Mot de passe initial</span><input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)}/><small>8 caractères minimum. Le responsable pourra ensuite le modifier.</small></label></>
}

function CompanyList({ companies, isLoading, onRefresh, onResend }: { companies: CompanySummary[]; isLoading: boolean; onRefresh: () => Promise<void>; onResend: (email: string) => Promise<void> }) {
  return <section className="panel admin-companies-panel"><div className="panel-head"><div><h2>Entreprises clientes</h2><p>{companies.length} affichée{companies.length === 1 ? '' : 's'} · limite 100</p></div><Button variant="secondary" onClick={() => void onRefresh()}>Actualiser</Button></div>
    {isLoading ? <p className="admin-empty">Chargement des entreprises…</p> : companies.length === 0 ? <p className="admin-empty">Aucune entreprise pour le moment.</p> : <div className="company-list">{companies.map((company) => <CompanyRow key={company.id} company={company} onResend={onResend}/>)}</div>}
  </section>
}

function CompanyRow({ company, onResend }: { company: CompanySummary; onResend: (email: string) => Promise<void> }) {
  return <article className="company-row"><div><b>{company.name}</b><small>{company.ownerEmail}</small></div><span className={`company-status ${company.status}`}>{company.status === 'active' ? 'Active' : company.status}</span>
    <Button variant="secondary" onClick={() => void onResend(company.ownerEmail)}>Renvoyer le lien</Button></article>
}

async function submitCompany(event: React.FormEvent<HTMLFormElement>, input: CompanyInput, onCreate: (input: CompanyInput) => Promise<void>, setIsSubmitting: (value: boolean) => void, reset: () => void) {
  event.preventDefault()
  setIsSubmitting(true)
  try { await onCreate(input); reset() } catch { return } finally { setIsSubmitting(false) }
}

async function createCompany(session: ReturnType<typeof useAuthSession>['session'], input: CompanyInput, refresh: () => Promise<void>, setNotice: (message: string | null) => void, setError: (message: string | null) => void) {
  setNotice(null); setError(null)
  try {
    const created = await adminRequest(session, 'POST', input)
    if (!created.ownerEmail) throw new Error('L’entreprise a été créée, mais l’adresse du responsable est absente.')
    setNotice(`Entreprise créée. Le compte ${created.ownerEmail} peut se connecter avec le mot de passe initial défini.`)
    await refresh()
  } catch (creationError) {
    setError(creationError instanceof Error ? creationError.message : 'Impossible de créer cette entreprise.')
    throw creationError
  }
}

async function sendAccessLink(email: string, setNotice: (message: string | null) => void, setError: (message: string | null) => void) {
  setNotice(null); setError(null)
  if (!firebaseAuth) { setError('Firebase Authentication n’est pas configuré.'); return }
  try {
    await sendPasswordResetEmail(firebaseAuth, email)
    setNotice(`Le lien de définition du mot de passe a été envoyé à ${email}.`)
  } catch {
    setError('Compte créé, mais e-mail non envoyé. Vérifie les domaines autorisés Firebase et les modèles e-mail.')
  }
}
