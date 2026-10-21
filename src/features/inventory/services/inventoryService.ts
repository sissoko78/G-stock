import type { Movement, Product } from '../../../shared/types/domain'
import type { MovementFormData } from '../../../shared/services/appDataSchema'
import { createId } from '../../../shared/utils/format'
import { failure, success, type Result } from '../../../shared/utils/result'
import { ValidationError } from '../../../shared/utils/errors'

export interface MovementResult { products: Product[]; movement: Movement }

export const createMovement = (
  products: Product[], input: MovementFormData, supplier: string, now = new Date().toISOString(),
): Result<MovementResult, ValidationError> => {
  const product = products.find((item) => item.id === input.productId)
  if (!product) return failure(new ValidationError('Ce produit est introuvable. Actualisez la page et réessayez.'))
  const isIncoming = input.type === 'Entrée'
  if (!isIncoming && product.stock < input.quantity) {
    return failure(new ValidationError(`Stock insuffisant : il reste ${product.stock} ${product.unit}.`))
  }
  const movement: Movement = {
    ...input, id: createId(), quantity: input.quantity, supplier,
    unitPrice: input.unitPrice, costAtTime: product.cost, date: now, user: 'Aminata Traoré',
  }
  const nextProducts = products.map((item) => item.id !== product.id ? item : {
    ...item,
    stock: item.stock + (isIncoming ? input.quantity : -input.quantity),
    cost: isIncoming && input.reason === 'Achat fournisseur' ? input.unitPrice : item.cost,
  })
  return success({ products: nextProducts, movement })
}

export const updateProduct = (products: Product[], product: Product): Product[] =>
  products.map((item) => item.id === product.id ? product : item)
