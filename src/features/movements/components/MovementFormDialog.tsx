import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { movementFormSchema, movementReasons, type MovementFormData } from '../../../shared/services/appDataSchema'
import type { MovementReason, Product, Supplier } from '../../../shared/types/domain'
import { Button } from '../../../shared/components/ui/Button'
import { Field } from '../../../shared/components/ui/Field'
import { Modal } from '../../../shared/components/ui/Modal'
import { formatMoney } from '../../../shared/utils/format'

interface Props { type: 'Entrée' | 'Sortie'; products: Product[]; suppliers: Supplier[]; onClose: () => void; onSave: (data: MovementFormData) => boolean }
const incomingReasons: MovementReason[] = movementReasons.filter((reason) => ['Achat fournisseur', 'Retour client', 'Ajustement positif', 'Transfert entrant'].includes(reason))
const outgoingReasons: MovementReason[] = movementReasons.filter((reason) => !incomingReasons.includes(reason))

export function MovementFormDialog({ type, products, suppliers, onClose, onSave }: Props) {
  const reasons = type === 'Entrée' ? incomingReasons : outgoingReasons
  const [form, setForm] = useState<MovementFormData>({ productId: '', type, reason: type === 'Entrée' ? incomingReasons[0] : outgoingReasons[0], quantity: 1, unitPrice: 0, supplier: '', note: '' })
  const [error, setError] = useState('')
  const product = products.find((item) => item.id === form.productId)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = movementFormSchema.safeParse(form)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Vérifiez les informations saisies.'); return }
    if (onSave(parsed.data as MovementFormData)) onClose()
  }
  return <Modal title={type === 'Entrée' ? 'Nouvelle entrée de stock' : 'Nouvelle sortie de stock'} onClose={onClose}>
    <form onSubmit={handleSubmit} className="dialog-form"><MovementFields form={form} setForm={setForm} products={products} suppliers={suppliers} reasons={reasons} product={product} type={type}/>
    <Field label="Note (facultatif)"><textarea rows={2} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Référence ou détail utile" /></Field>
    {error && <p className="form-error" role="alert">{error}</p>}
    <p className="form-hint">Montant de l'opération : <b>{formatMoney(form.quantity * form.unitPrice)}</b></p>
    <div className="modal-actions"><Button variant="secondary" type="button" onClick={onClose}>Annuler</Button><Button type="submit">Enregistrer le mouvement</Button></div></form>
  </Modal>
}

function MovementFields({ form, setForm, products, suppliers, reasons, product, type }: { form: MovementFormData; setForm: Dispatch<SetStateAction<MovementFormData>>; products: Product[]; suppliers: Supplier[]; reasons: MovementReason[]; product?: Product; type: 'Entrée' | 'Sortie' }) {
  return <><Field label="Produit"><select required autoFocus value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })}><option value="">Choisir un produit…</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.stock} {item.unit} disponibles</option>)}</select></Field>
    <MovementDetails form={form} setForm={setForm} suppliers={suppliers} reasons={reasons} product={product} type={type}/>
  </>
}

function MovementDetails({ form, setForm, suppliers, reasons, product, type }: { form: MovementFormData; setForm: Dispatch<SetStateAction<MovementFormData>>; suppliers: Supplier[]; reasons: MovementReason[]; product?: Product; type: 'Entrée' | 'Sortie' }) {
  return <><div className="form-grid"><Field label="Motif"><select value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value as MovementFormData['reason'] })}>{reasons.map((reason) => <option key={reason}>{reason}</option>)}</select></Field>
    <Field label="Quantité"><input type="number" required min="1" max={type === 'Sortie' ? product?.stock : undefined} value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}/></Field>
    {type === 'Entrée' && form.reason === 'Achat fournisseur' && <Field label="Fournisseur"><select value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })}><option value="">Sélectionner…</option>{suppliers.map((item) => <option key={item.id}>{item.name}</option>)}</select></Field>}
    <MovementPriceField form={form} setForm={setForm} type={type}/></div>{product && <div className="movement-preview"><span>Stock après opération</span><b>{Math.max(0, product.stock + (type === 'Entrée' ? form.quantity : -form.quantity))} {product.unit}</b></div>}
    <Field label="Note (facultatif)"><textarea rows={2} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Référence ou détail utile"/></Field>
  </>
}

function MovementPriceField({ form, setForm, type }: { form: MovementFormData; setForm: Dispatch<SetStateAction<MovementFormData>>; type: 'Entrée' | 'Sortie' }) {
  const label = type === 'Entrée' ? 'Coût unitaire (FCFA)' : 'Prix de vente unitaire (FCFA)'
  return <Field label={label}><input type="number" required min="0" value={form.unitPrice} onChange={(event) => setForm({ ...form, unitPrice: Number(event.target.value) })}/></Field>
}
