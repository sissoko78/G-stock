import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { AppData, Company, Product, Supplier } from '../../../shared/types/domain'
import type { MovementFormData, ProductFormData, SupplierFormData } from '../../../shared/services/appDataSchema'
import { createMovement } from '../services/inventoryService'
import { createId } from '../../../shared/utils/format'

type Notify = (kind: 'success' | 'error', message: string) => void
type SetData = Dispatch<SetStateAction<AppData>>

export function useProductActions(setData: SetData, notify: Notify) {
  const addProduct = useCallback((input: ProductFormData) => {
    const product: Product = { ...input, id: input.id || createId(), stock: 0, archived: false }
    setData((current) => ({ ...current, products: input.id ? current.products.map((item) => item.id === product.id ? { ...item, ...product, stock: item.stock, archived: item.archived } : item) : [product, ...current.products] }))
    notify('success', input.id ? 'Produit modifié.' : 'Produit ajouté au catalogue.')
  }, [notify, setData])
  const archiveProduct = useCallback((product: Product) => {
    setData((current) => ({ ...current, products: current.products.map((item) => item.id === product.id ? { ...item, archived: true } : item) }))
    notify('success', `${product.name} a été archivé. Son historique est conservé.`)
  }, [notify, setData])
  return { addProduct, archiveProduct }
}

export function useMovementActions(products: Product[], setData: SetData, notify: Notify) {
  const recordMovement = useCallback((input: MovementFormData) => {
    const result = createMovement(products, input, input.supplier)
    if (!result.ok) { notify('error', result.error.message); return false }
    setData((current) => ({ ...current, products: result.value.products, movements: [result.value.movement, ...current.movements] }))
    notify('success', input.type === 'Entrée' ? 'Entrée enregistrée. Le stock est à jour.' : 'Sortie enregistrée. Le stock est à jour.')
    return true
  }, [notify, products, setData])
  return { recordMovement }
}

export function useSupplierActions(setData: SetData, notify: Notify) {
  const addSupplier = useCallback((input: SupplierFormData) => {
    const supplier: Supplier = { ...input, id: createId() }
    setData((current) => ({ ...current, suppliers: [supplier, ...current.suppliers] }))
    notify('success', 'Fournisseur ajouté à votre répertoire.')
  }, [notify, setData])
  const removeSupplier = useCallback((supplierId: string) => {
    setData((current) => ({ ...current, suppliers: current.suppliers.filter((item) => item.id !== supplierId) }))
    notify('success', 'Fournisseur retiré du répertoire.')
  }, [notify, setData])
  return { addSupplier, removeSupplier }
}

export function useCompanyActions(setData: SetData, notify: Notify) {
  const updateCompany = useCallback((company: Company) => {
    setData((current) => ({ ...current, company }))
    notify('success', 'Paramètres de la boutique enregistrés.')
  }, [notify, setData])
  return { updateCompany }
}
