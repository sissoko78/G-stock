import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const email = process.argv[2]?.trim().toLowerCase()
if (!email) throw new Error('Usage: npm run bootstrap:super-admin -- admin@example.com')

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

const auth = getAuth()
const user = await auth.getUserByEmail(email)
const claims = { ...user.customClaims }
delete claims.tenantId
delete claims.tenantRole
delete claims.companyName
claims.superAdmin = true
await auth.setCustomUserClaims(user.uid, claims)

process.stdout.write(`Super administrateur configuré : ${email}\n`)
