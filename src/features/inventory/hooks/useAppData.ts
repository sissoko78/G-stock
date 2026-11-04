import { useEffect, useState } from 'react'
import type { AppData } from '../../../shared/types/domain'
import { DEMO_DATA } from '../services/demoData'
import { readAppData, writeAppData } from '../../../shared/services/localStorageService'
import { useToast } from '../../../shared/hooks/useToast'
import { useCompanyActions, useMovementActions, useProductActions, useSupplierActions } from './useInventoryActions'
import { APP_STORAGE_KEY } from '../../../shared/utils/constants'

function emptyCompanyData(companyName: string): AppData {
  return { products: [], suppliers: [], movements: [], company: { name: companyName, phone: '', currency: 'FCFA' } }
}

function hydrateData(tenantId?: string, companyName?: string): { data: AppData; canPersist: boolean; error?: string } {
  const storageKey = tenantId ? `${APP_STORAGE_KEY}:${tenantId}` : APP_STORAGE_KEY
  const fallback = tenantId ? emptyCompanyData(companyName ?? 'Mon entreprise') : DEMO_DATA
  const loaded = readAppData(fallback, storageKey, !tenantId)
  return loaded.ok ? { data: loaded.value, canPersist: true } : { data: fallback, canPersist: false, error: loaded.error.message }
}

export function useAppData(tenantId?: string, companyName?: string) {
  const storageKey = tenantId ? `${APP_STORAGE_KEY}:${tenantId}` : APP_STORAGE_KEY
  const [initialData] = useState(() => hydrateData(tenantId, companyName))
  const [data, setData] = useState<AppData>(initialData.data)
  const [canPersist, setCanPersist] = useState(initialData.canPersist)
  const { messages, notify, dismiss } = useToast()
  useEffect(() => persistData(data, canPersist, initialData.error, notify, storageKey), [data, canPersist, initialData.error, notify, storageKey])
  const productActions = useProductActions(setData, notify)
  const movementActions = useMovementActions(data.products, setData, notify)
  const supplierActions = useSupplierActions(setData, notify)
  const companyActions = useCompanyActions(setData, notify)
  const restoreData = (nextData: AppData) => restoreAppData(nextData, setData, setCanPersist, notify)
  return { data, messages, notify, dismiss, ...productActions, ...movementActions, ...supplierActions, ...companyActions, restoreData }
}

function persistData(data: AppData, canPersist: boolean, error: string | undefined, notify: ReturnType<typeof useToast>['notify'], storageKey: string): void {
  if (!canPersist) { if (error) notify('error', error); return }
  const result = writeAppData(data, storageKey)
  if (!result.ok) notify('error', result.error.message)
}

function restoreAppData(data: AppData, setData: (data: AppData) => void, setCanPersist: (value: boolean) => void, notify: ReturnType<typeof useToast>['notify']): void {
  setCanPersist(true)
  setData(data)
  notify('success', 'Sauvegarde restaurée. Vos données sont à jour.')
}
