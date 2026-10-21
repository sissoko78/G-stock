import { useState, type FormEvent } from 'react'
import type { Movement, Supplier } from '../../../shared/types/domain'
import type { SupplierFormData } from '../../../shared/services/appDataSchema'
import { supplierFormSchema } from '../../../shared/services/appDataSchema'
import { formatMoney } from '../../../shared/utils/format'
import { Button } from '../../../shared/components/ui/Button'
import { Field } from '../../../shared/components/ui/Field'
import { Icon } from '../../../shared/components/ui/Icon'
import { Modal } from '../../../shared/components/ui/Modal'
import { SearchBox } from '../../../shared/components/ui/SearchBox'

interface Props { suppliers: Supplier[]; movements: Movement[]; onAdd: (supplier: SupplierFormData) => void; onRemove: (id: string) => void }
export function SupplierPage({ suppliers, movements, onAdd, onRemove }: Props) {
  const [query, setQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const term = query.toLocaleLowerCase('fr')
  const visible = suppliers.filter((supplier) => `${supplier.name} ${supplier.phone} ${supplier.email}`.toLocaleLowerCase('fr').includes(term))
  const handleCreate = (supplier: SupplierFormData) => { onAdd(supplier); setIsCreating(false) }
  return <><div className="page-heading"><div><div className="eyebrow">PARTENAIRES</div><h1>Fournisseurs</h1><p>Retrouvez vos contacts et l'historique de leurs achats.</p></div><Button icon="plus" onClick={() => setIsCreating(true)}>Ajouter un fournisseur</Button></div>
    <section className="panel data-panel"><div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Nom, téléphone, e-mail…"/><span className="item-count">{visible.length} fournisseur(s)</span></div>
      {visible.length ? <div className="table-scroll"><table><thead><tr><th>FOURNISSEUR</th><th>TÉLÉPHONE</th><th>E-MAIL</th><th>ADRESSE</th><th>ACHATS</th><th>TOTAL DES ACHATS</th><th /></tr></thead><tbody>{visible.map((supplier, index) => <SupplierRow key={supplier.id} supplier={supplier} index={index} movements={movements} onRemove={onRemove}/>)}</tbody></table></div> : <div className="empty-notice"><span><Icon name="users"/></span><b>Aucun fournisseur trouvé</b><p>Ajoutez un partenaire pour retrouver ses achats ici.</p><Button onClick={() => setIsCreating(true)}>Créer un fournisseur</Button></div>}
    </section>{isCreating && <SupplierFormDialog onClose={() => setIsCreating(false)} onSave={handleCreate}/>}</>
}

function SupplierRow({ supplier, index, movements, onRemove }: { supplier: Supplier; index: number; movements: Movement[]; onRemove: (id: string) => void }) {
  const purchases = movements.filter((item) => item.supplier === supplier.name && item.reason === 'Achat fournisseur')
  const amount = purchases.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  const handleRemove = () => { if (window.confirm(`Retirer ${supplier.name} de votre répertoire ? L'historique des mouvements sera conservé.`)) onRemove(supplier.id) }
  return <tr><td><div className="product-cell"><span className={`product-thumb thumb-${index % 5}`}>{supplier.name.slice(0, 1)}</span><b>{supplier.name}</b></div></td><td>{supplier.phone || '—'}</td><td>{supplier.email || '—'}</td><td>{supplier.address || '—'}</td><td>{purchases.length}</td><td className="numeric bold">{formatMoney(amount)}</td><td><button className="icon-button" aria-label={`Retirer ${supplier.name}`} onClick={handleRemove}><Icon name="more"/></button></td></tr>
}

function SupplierFormDialog({ onClose, onSave }: { onClose: () => void; onSave: (supplier: SupplierFormData) => void }) {
  const [form, setForm] = useState<SupplierFormData>({ name: '', phone: '', email: '', address: '' })
  const [error, setError] = useState('')
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = supplierFormSchema.safeParse(form)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Vérifiez les informations saisies.'); return }
    onSave(parsed.data)
  }
  return <Modal title="Ajouter un fournisseur" onClose={onClose}><form className="dialog-form" onSubmit={handleSubmit}>
    <Field label="Nom du fournisseur"><input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></Field>
    <Field label="Téléphone"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })}/></Field>
    <Field label="E-mail"><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })}/></Field>
    <Field label="Adresse"><textarea rows={2} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })}/></Field>
    {error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><Button variant="secondary" type="button" onClick={onClose}>Annuler</Button><Button type="submit">Créer le fournisseur</Button></div>
  </form></Modal>
}
