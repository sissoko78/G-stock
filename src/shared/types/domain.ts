export type Id = string
export type MovementType = 'Entrée' | 'Sortie'
export type MovementReason =
  | 'Achat fournisseur' | 'Retour client' | 'Ajustement positif' | 'Transfert entrant'
  | 'Vente' | 'Perte' | 'Casse' | 'Vol' | 'Péremption' | 'Consommation interne'
  | 'Ajustement négatif' | 'Transfert sortant'

export interface Product {
  id: Id
  name: string
  sku: string
  category: string
  unit: string
  cost: number
  stock: number
  threshold: number
  archived: boolean
}

export interface Supplier {
  id: Id
  name: string
  phone: string
  email: string
  address: string
}

export interface Movement {
  id: Id
  productId: Id
  type: MovementType
  reason: MovementReason
  quantity: number
  unitPrice: number
  costAtTime: number
  date: string
  supplier: string
  user: string
  note?: string
}

export interface Company {
  name: string
  phone: string
  currency: string
}

export interface AppData {
  products: Product[]
  suppliers: Supplier[]
  movements: Movement[]
  company: Company
}

export type PageId = 'dashboard' | 'products' | 'movements' | 'reports' | 'suppliers' | 'users' | 'settings'
export type ToastKind = 'success' | 'error' | 'warning' | 'info'
export interface ToastMessage { id: string; kind: ToastKind; message: string }
