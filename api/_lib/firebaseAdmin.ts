import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function readServiceAccount() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!rawServiceAccount) throw new Error('FIREBASE_ADMIN_NOT_CONFIGURED')

  let serviceAccount: { project_id?: string; client_email?: string; private_key?: string }
  try {
    serviceAccount = JSON.parse(rawServiceAccount) as typeof serviceAccount
  } catch {
    throw new Error('FIREBASE_ADMIN_CONFIGURATION_INVALID')
  }

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error('FIREBASE_ADMIN_CONFIGURATION_INVALID')
  }
  if (process.env.VITE_FIREBASE_PROJECT_ID && serviceAccount.project_id !== process.env.VITE_FIREBASE_PROJECT_ID) {
    throw new Error('FIREBASE_ADMIN_CONFIGURATION_INVALID')
  }

  return { projectId: serviceAccount.project_id, clientEmail: serviceAccount.client_email, privateKey: serviceAccount.private_key }
}

function getAdminApp() {
  const existingApp = getApps().find((app) => app.name === 'g-stock-admin')
  return existingApp ?? initializeApp({ credential: cert(readServiceAccount()) }, 'g-stock-admin')
}

export const getAdminAuth = () => getAuth(getAdminApp())
export const getAdminFirestore = () => getFirestore(getAdminApp())

export async function requireSuperAdmin(request: Request) {
  const authorization = request.headers.get('authorization')
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) throw new Error('AUTH_REQUIRED')

  const decodedToken = await getAdminAuth().verifyIdToken(token, true)
  if (decodedToken.superAdmin !== true) throw new Error('SUPER_ADMIN_REQUIRED')
  return decodedToken
}
