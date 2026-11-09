import { doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore'
import type { AppData } from '../types/domain'
import { validateAppData } from './appDataSchema'
import { firestore } from './firebase'

export function subscribeToCompanyInventory(
  tenantId: string,
  onData: (data: AppData) => void,
  onMissing: () => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  if (!firestore) throw new Error('Firebase Firestore n’est pas configuré.')
  const inventoryRef = doc(firestore, 'companies', tenantId, 'appData', 'current')
  let initializedMissingDocument = false
  return onSnapshot(inventoryRef, { includeMetadataChanges: true }, (snapshot) => {
    if (snapshot.metadata.fromCache) return
    if (!snapshot.exists()) {
      if (initializedMissingDocument) return
      initializedMissingDocument = true
      onMissing()
      return
    }
    const result = validateAppData(snapshot.data())
    if (!result.success) {
      onError(new Error('Les données cloud de cette entreprise sont illisibles.'))
      return
    }
    onData(result.data)
  }, onError)
}

export async function saveCompanyInventory(tenantId: string, data: AppData): Promise<void> {
  if (!firestore) throw new Error('Firebase Firestore n’est pas configuré.')
  const inventoryRef = doc(firestore, 'companies', tenantId, 'appData', 'current')
  await setDoc(inventoryRef, data)
}
