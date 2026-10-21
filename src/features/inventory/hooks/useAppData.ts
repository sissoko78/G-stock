import { useEffect, useState } from 'react'
import type { AppData } from '../../../shared/types/domain'
import { DEMO_DATA } from '../services/demoData'
import { readAppData, writeAppData } from '../../../shared/services/localStorageService'
import { useToast } from '../../../shared/hooks/useToast'
import { useCompanyActions, useMovementActions, useProductActions, useSupplierActions } from './useInventoryActions'

function hydrateData(): { data: AppData; canPersist: boolean; error?: string } {
  const loaded = readAppData(DEMO_DATA)
  return loaded.ok ? { data: loaded.value, canPersist: true } : { data: DEMO_DATA, canPersist: false, error: loaded.error.message }
}

export function useAppData() {
  const [initialData] = useState(hydrateData)
  const [data, setData] = useState<AppData>(initialData.data)
  const [canPersist, setCanPersist] = useState(initialData.canPersist)
  const { messages, notify, dismiss } = useToast()
  useEffect(() => persistData(data, canPersist, initialData.error, notify), [data, canPersist, initialData.error, notify])
  const productActions = useProductActions(setData, notify)
  const movementActions = useMovementActions(data.products, setData, notify)
  const supplierActions = useSupplierActions(setData, notify)
  const companyActions = useCompanyActions(setData, notify)
  const restoreData = (nextData: AppData) => restoreAppData(nextData, setData, setCanPersist, notify)
  return { data, messages, notify, dismiss, ...productActions, ...movementActions, ...supplierActions, ...companyActions, restoreData }
}

function persistData(data: AppData, canPersist: boolean, error: string | undefined, notify: ReturnType<typeof useToast>['notify']): void {
  if (!canPersist) { if (error) notify('error', error); return }
  const result = writeAppData(data)
  if (!result.ok) notify('error', result.error.message)
}

function restoreAppData(data: AppData, setData: (data: AppData) => void, setCanPersist: (value: boolean) => void, notify: ReturnType<typeof useToast>['notify']): void {
  setCanPersist(true)
  setData(data)
  notify('success', 'Sauvegarde restaurée. Vos données sont à jour.')
}
