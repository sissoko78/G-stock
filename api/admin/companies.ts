import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import { errorResponse, jsonResponse } from '../_lib/apiResponse.js'
import { getAdminAuth, getAdminFirestore, requireSuperAdmin } from '../_lib/firebaseAdmin.js'

const companyInput = z.object({
  companyName: z.string().trim().min(2).max(100),
  ownerName: z.string().trim().min(2).max(100),
  ownerEmail: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
})

export async function GET(request: Request): Promise<Response> {
  try {
    await requireSuperAdmin(request)
    const snapshot = await getAdminFirestore().collection('companies').orderBy('createdAt', 'desc').limit(100).get()
    return jsonResponse({ companies: snapshot.docs.map((doc) => {
      const data = doc.data()
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null
      return { id: doc.id, ...data, createdAt }
    }) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    await requireSuperAdmin(request)
    const parsed: unknown = await request.json().catch(() => null)
    const input = companyInput.safeParse(parsed)
    if (!input.success) throw new Error('INVALID_REQUEST')
    return jsonResponse(await provisionCompany(input.data), 201)
  } catch (error) {
    return errorResponse(error)
  }
}

async function provisionCompany(input: z.infer<typeof companyInput>) {
  const auth = getAdminAuth()
  const database = getAdminFirestore()
  const companyRef = database.collection('companies').doc()
  const owner = await auth.createUser({ email: input.ownerEmail, displayName: input.ownerName, password: input.password })
  try {
    await auth.setCustomUserClaims(owner.uid, { superAdmin: false, tenantId: companyRef.id, tenantRole: 'owner', companyName: input.companyName })
    await writeCompanyRecords(database, companyRef, owner.uid, input)
  } catch (error) {
    await auth.deleteUser(owner.uid).catch(() => undefined)
    throw error
  }
  return { companyId: companyRef.id, ownerEmail: input.ownerEmail }
}

async function writeCompanyRecords(database: ReturnType<typeof getAdminFirestore>, companyRef: FirebaseFirestore.DocumentReference, ownerUid: string, input: z.infer<typeof companyInput>) {
  const now = FieldValue.serverTimestamp()
  const batch = database.batch()
  batch.set(companyRef, { name: input.companyName, ownerUid, ownerEmail: input.ownerEmail, status: 'active', createdAt: now })
  batch.set(database.collection('users').doc(ownerUid), { email: input.ownerEmail, displayName: input.ownerName, tenantId: companyRef.id, role: 'owner', createdAt: now })
  await batch.commit()
}
