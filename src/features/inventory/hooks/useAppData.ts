import { useEffect, useRef, useState } from 'react'
import type { AppData } from '../../../shared/types/domain'
import { readAppData, writeAppData } from '../../../shared/services/localStorageService'
import { saveCompanyInventory, subscribeToCompanyInventory } from '../../../shared/services/cloudInventoryService'
import { useToast } from '../../../shared/hooks/useToast'
import { useCompanyActions, useMovementActions, useProductActions, useSupplierActions } from './useInventoryActions'
import { APP_STORAGE_KEY } from '../../../shared/utils/constants'

export type CloudSyncStatus = 'loading' | 'synced' | 'saving' | 'error'

function emptyCompanyData(companyName: string): AppData {
  return { products: [], suppliers: [], movements: [], company: { name: companyName, phone: '', currency: 'FCFA' } }
}

function hydrateData(tenantId: string, companyName: string): AppData {
  const storageKey = `${APP_STORAGE_KEY}:${tenantId}`
  const loaded = readAppData(emptyCompanyData(companyName), storageKey, false)
  return loaded.ok ? loaded.value : emptyCompanyData(companyName)
}

function hasLocalInventory(data: AppData): boolean {
  return data.products.length > 0 || data.movements.length > 0 || data.suppliers.length > 0
}

function isEmptyInventory(data: AppData): boolean {
  return !hasLocalInventory(data)
}

export function useAppData(tenantId: string, companyName: string) {
  const storageKey = `${APP_STORAGE_KEY}:${tenantId}`
  const [data, setData] = useState<AppData>(() => hydrateData(tenantId, companyName))
  const [canPersist, setCanPersist] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('loading')
  const cloudReady = useRef(false)
  const lastCloudData = useRef('')
  const { messages, notify, dismiss } = useToast()

  useEffect(() => {
    let active = true
    let serverResponded = false
    const offlineFallback = window.setTimeout(() => {
      if (!active || serverResponded) return
      setIsLoading(false)
      setSyncStatus('error')
    }, 10_000)

    const unsubscribe = subscribeToCompanyInventory(tenantId, (cloudData) => {
      if (!active) return
      serverResponded = true
      window.clearTimeout(offlineFallback)
      const localResult = readAppData(emptyCompanyData(companyName), storageKey, false)
      const localData = localResult.ok ? localResult.value : emptyCompanyData(companyName)
      // Recover stock created by an older, local-only app if another device
      // created an empty cloud record first.
      const nextData = isEmptyInventory(cloudData) && hasLocalInventory(localData) ? localData : cloudData
      lastCloudData.current = JSON.stringify(cloudData)
      cloudReady.current = true
      setData(nextData)
      setCanPersist(true)
      setIsLoading(false)
      setSyncStatus(JSON.stringify(nextData) === lastCloudData.current ? 'synced' : 'saving')
    }, () => {
      if (!active) return
      serverResponded = true
      window.clearTimeout(offlineFallback)
      const localResult = readAppData(emptyCompanyData(companyName), storageKey, false)
      const localData = localResult.ok ? localResult.value : emptyCompanyData(companyName)
      lastCloudData.current = ''
      cloudReady.current = true
      setData(localData)
      setCanPersist(true)
      setIsLoading(false)
      setSyncStatus('saving')
    }, () => {
      if (!active) return
      serverResponded = true
      window.clearTimeout(offlineFallback)
      setIsLoading(false)
      setSyncStatus('error')
    })

    return () => {
      active = false
      window.clearTimeout(offlineFallback)
      unsubscribe()
    }
  }, [tenantId, companyName, storageKey])

  useEffect(() => {
    if (!canPersist) return
    const localResult = writeAppData(data, storageKey)
    if (!localResult.ok) notify('error', localResult.error.message)
    if (!cloudReady.current) return

    const serialized = JSON.stringify(data)
    if (serialized === lastCloudData.current) return
    lastCloudData.current = serialized
    setSyncStatus('saving')
    void saveCompanyInventory(tenantId, data).then(() => {
      setSyncStatus('synced')
    }).catch(() => {
      if (lastCloudData.current === serialized) lastCloudData.current = ''
      setSyncStatus('error')
    })
  }, [canPersist, data, notify, storageKey, tenantId])

  const productActions = useProductActions(setData, notify)
  const movementActions = useMovementActions(data.products, setData, notify)
  const supplierActions = useSupplierActions(setData, notify)
  const companyActions = useCompanyActions(setData, notify)
  const restoreData = (nextData: AppData) => {
    setCanPersist(true)
    setData(nextData)
    notify('success', 'Sauvegarde restaurée. Vos données sont à jour.')
  }
  return { data, isLoading, syncStatus, messages, notify, dismiss, ...productActions, ...movementActions, ...supplierActions, ...companyActions, restoreData }
}
