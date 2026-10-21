import type { AppData } from '../types/domain'
import { companySchema, movementSchema, productSchema, supplierSchema, validateAppData } from './appDataSchema'
import { z } from 'zod'
import { failure, success, type Result } from '../utils/result'
import { StorageError } from '../utils/errors'
import { logger } from '../utils/logger'
import { APP_STORAGE_KEY, LEGACY_STORAGE_KEYS } from '../utils/constants'

export const readAppData = (fallback: AppData): Result<AppData, StorageError> => {
  try {
    const stored = localStorage.getItem(APP_STORAGE_KEY)
    if (!stored) return readLegacyData(fallback)
    const parsed: unknown = JSON.parse(stored)
    const validated = validateAppData(parsed)
    if (!validated.success) {
      logger.error('Stored application data failed validation', { issues: validated.error.issues.length })
      return failure(new StorageError('Les données enregistrées sont invalides. Restaurez une sauvegarde ou réinitialisez les données.'))
    }
    return success(validated.data)
  } catch (error) {
    logger.error('Unable to read application data')
    return failure(new StorageError('Impossible de lire les données de ce navigateur.', { cause: error }))
  }
}

const readLegacyData = (fallback: AppData): Result<AppData, StorageError> => {
  const products = localStorage.getItem(LEGACY_STORAGE_KEYS.products)
  const movements = localStorage.getItem(LEGACY_STORAGE_KEYS.movements)
  const suppliers = localStorage.getItem(LEGACY_STORAGE_KEYS.suppliers)
  if (!products && !movements && !suppliers) return success(fallback)
  try {
    return migrateLegacyData(fallback, products, movements, suppliers, localStorage.getItem(LEGACY_STORAGE_KEYS.company))
  } catch (error) {
    logger.error('Unable to migrate legacy browser data')
    return failure(new StorageError('Les anciennes données ne peuvent pas être lues. Gardez une copie avant de réinitialiser le navigateur.', { cause: error }))
  }
}

const migrateLegacyData = (fallback: AppData, products: string | null, movements: string | null, suppliers: string | null, company: string | null): Result<AppData, StorageError> => {
  const legacyProducts = z.array(productSchema).parse(products ? JSON.parse(products) as unknown : fallback.products)
  const legacyMovementSchema = movementSchema.extend({ costAtTime: z.number().optional() })
  const legacyMovements = z.array(legacyMovementSchema).parse(movements ? JSON.parse(movements) as unknown : fallback.movements)
  const data: unknown = {
    products: legacyProducts,
    movements: legacyMovements.map((item) => ({ ...item, costAtTime: item.costAtTime ?? legacyProducts.find((product) => product.id === item.productId)?.cost ?? 0 })),
    suppliers: z.array(supplierSchema).parse(suppliers ? JSON.parse(suppliers) as unknown : fallback.suppliers),
    company: companySchema.parse(company ? JSON.parse(company) as unknown : fallback.company),
  }
  return storeMigratedData(data)
}

const storeMigratedData = (data: unknown): Result<AppData, StorageError> => {
  const migrated = validateAppData(data)
  if (!migrated.success) return failure(new StorageError('Les anciennes données sont incomplètes. Exportez-les depuis l’ancienne version avant de continuer.'))
  const saved = writeAppData(migrated.data)
  return saved.ok ? success(migrated.data) : failure(saved.error)
}

export const writeAppData = (data: AppData): Result<void, StorageError> => {
  try {
    const validated = validateAppData(data)
    if (!validated.success) return failure(new StorageError('Les données ne peuvent pas être enregistrées car elles sont invalides.'))
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(validated.data))
    return success(undefined)
  } catch (error) {
    logger.error('Unable to write application data')
    return failure(new StorageError('Espace de stockage indisponible. Téléchargez une sauvegarde et libérez de la place.', { cause: error }))
  }
}

export const exportBackup = (data: AppData): void => {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'sauvegarde-g-stock.json'
  link.click()
  URL.revokeObjectURL(url)
}

export const restoreBackup = async (file: File): Promise<Result<AppData, StorageError>> => {
  try {
    const parsed: unknown = JSON.parse(await file.text())
    const validated = validateAppData(parsed)
    if (!validated.success) return failure(new StorageError('Ce fichier ne contient pas une sauvegarde G-stock valide.'))
    return success(validated.data)
  } catch (error) {
    logger.error('Unable to restore backup')
    return failure(new StorageError('Le fichier est illisible. Choisissez une sauvegarde JSON G-stock.', { cause: error }))
  }
}
