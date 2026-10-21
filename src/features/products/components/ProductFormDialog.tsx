import { useState, type FormEvent } from 'react'
import type { Product } from '../../../shared/types/domain'
import { productFormSchema, type ProductFormData } from '../../../shared/services/appDataSchema'
import { Button } from '../../../shared/components/ui/Button'
import { Field } from '../../../shared/components/ui/Field'
import { Modal } from '../../../shared/components/ui/Modal'

interface Props { product: Product | null; products: Product[]; onClose: () => void; onSave: (product: ProductFormData) => void }
const blankProduct: ProductFormData = { name: '', sku: '', category: '', unit: 'pièce', cost: 0, threshold: 5 }

export function ProductFormDialog({ product, products, onClose, onSave }: Props) {
  const [form, setForm] = useState<ProductFormData>(product ?? blankProduct)
  const [error, setError] = useState('')
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = productFormSchema.safeParse(form)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Vérifiez les informations saisies.'); return }
    if (products.some((item) => item.sku.toLowerCase() === parsed.data.sku.toLowerCase() && item.id !== product?.id)) { setError('Cette référence existe déjà. Choisissez-en une autre.'); return }
    onSave({ ...parsed.data, ...(product ? { id: product.id } : {}) })
  }
  return <Modal title={product ? 'Modifier le produit' : 'Ajouter un produit'} onClose={onClose}>
    <form onSubmit={handleSubmit} className="dialog-form"><ProductFields form={form} setForm={setForm}/>{error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-actions"><Button variant="secondary" type="button" onClick={onClose}>Annuler</Button><Button type="submit">{product ? 'Enregistrer le produit' : 'Créer le produit'}</Button></div></form>
  </Modal>
}

function ProductFields({ form, setForm }: { form: ProductFormData; setForm: (form: ProductFormData) => void }) {
  const update = (field: keyof ProductFormData, value: string | number) => setForm({ ...form, [field]: value })
  return <div className="form-grid"><Field label="Nom du produit"><input autoFocus required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ex. Riz parfumé"/></Field>
    <Field label="Référence / SKU"><input required value={form.sku} onChange={(event) => update('sku', event.target.value)} placeholder="Ex. AL-005"/></Field>
    <Field label="Catégorie"><input value={form.category} onChange={(event) => update('category', event.target.value)} placeholder="Ex. Épicerie"/></Field>
    <Field label="Unité"><select value={form.unit} onChange={(event) => update('unit', event.target.value)}>{['pièce', 'kg', 'g', 'litre', 'carton', 'sac', 'bidon', 'boîte', 'bouteille', 'paquet'].map((unit) => <option key={unit}>{unit}</option>)}</select></Field>
    <Field label="Coût d'achat unitaire (FCFA)"><input type="number" min="0" value={form.cost} onChange={(event) => update('cost', Number(event.target.value))}/></Field>
    <Field label="Seuil d'alerte"><input type="number" min="0" step="1" value={form.threshold} onChange={(event) => update('threshold', Number(event.target.value))}/></Field>
  </div>
}
