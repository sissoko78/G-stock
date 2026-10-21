import { z } from 'zod'
import type { AppData, MovementReason, MovementType } from '../types/domain'

const nonNegativeNumber = z.number().finite().nonnegative()
export const movementReasons = [
  'Achat fournisseur', 'Retour client', 'Ajustement positif', 'Transfert entrant', 'Vente', 'Perte',
  'Casse', 'Vol', 'Péremption', 'Consommation interne', 'Ajustement négatif', 'Transfert sortant',
] as const
export const productSchema = z.object({
  id: z.string().min(1), name: z.string().trim().min(1), sku: z.string().trim().min(1),
  category: z.string().min(1), unit: z.string().min(1), cost: nonNegativeNumber,
  stock: nonNegativeNumber, threshold: nonNegativeNumber, archived: z.boolean(),
})
export const supplierSchema = z.object({
  id: z.string().min(1), name: z.string().trim().min(1), phone: z.string(),
  email: z.string(), address: z.string(),
})
export const movementSchema = z.object({
  id: z.string().min(1), productId: z.string().min(1), type: z.enum(['Entrée', 'Sortie']),
  reason: z.enum(movementReasons), quantity: z.number().positive(), unitPrice: nonNegativeNumber,
  costAtTime: nonNegativeNumber, date: z.string().datetime(), supplier: z.string(), user: z.string(), note: z.string().optional(),
})
export const companySchema = z.object({ name: z.string().trim().min(1), phone: z.string(), currency: z.string().min(1) })
export const appDataSchema = z.object({
  products: z.array(productSchema), suppliers: z.array(supplierSchema),
  movements: z.array(movementSchema), company: companySchema,
})

export const productFormSchema = z.object({
  id: z.string().optional(), name: z.string().trim().min(1, 'Saisissez le nom du produit.'),
  sku: z.string().trim().min(1, 'Saisissez une référence.'), category: z.string().trim().transform((value) => value || 'Sans catégorie'),
  unit: z.string().min(1), cost: z.coerce.number().finite().nonnegative('Le coût ne peut pas être négatif.'),
  threshold: z.coerce.number().int().nonnegative('Le seuil doit être un nombre entier positif.'),
})
export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, 'Saisissez le nom du fournisseur.'), phone: z.string(),
  email: z.string().email('Saisissez une adresse e-mail valide.').or(z.literal('')), address: z.string(),
})
export const movementFormSchema = z.object({
  productId: z.string().min(1, 'Choisissez un produit.'), type: z.enum(['Entrée', 'Sortie']),
  reason: z.enum(movementReasons), quantity: z.coerce.number().int().positive('Saisissez une quantité supérieure à zéro.'),
  unitPrice: z.coerce.number().finite().nonnegative('Le prix ne peut pas être négatif.'),
  supplier: z.string(), note: z.string().optional(),
})
export const companyFormSchema = companySchema

export type ProductFormData = z.infer<typeof productFormSchema>
export type SupplierFormData = z.infer<typeof supplierFormSchema>
export type MovementFormData = z.infer<typeof movementFormSchema> & { type: MovementType; reason: MovementReason }
export type CompanyFormData = z.infer<typeof companyFormSchema>

export const validateAppData = (value: unknown) => appDataSchema.safeParse(value)
export const asAppData = (data: AppData): AppData => data
