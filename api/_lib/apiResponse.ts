export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function errorResponse(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : message
  if (code === '7' || code === 'permission-denied') {
    console.error('[api/admin/companies] Firestore permission denied')
    return jsonResponse({ error: 'Le compte de service Firebase n’a pas les droits nécessaires sur Firestore.' }, 503)
  }
  if (code === '5' || code === 'not-found') {
    console.error('[api/admin/companies] Firebase resource not found')
    return jsonResponse({ error: 'La base Firestore configurée est introuvable dans le projet Firebase.' }, 503)
  }
  if (code !== 'auth/email-already-exists' && !code.startsWith('auth/') && message !== 'AUTH_REQUIRED' && message !== 'SUPER_ADMIN_REQUIRED' && message !== 'INVALID_REQUEST') {
    console.error('[api/admin/companies] Unexpected server error', { code })
  }
  if (code === 'auth/email-already-exists') {
    return jsonResponse({ error: 'Un compte existe déjà avec cette adresse e-mail.' }, 409)
  }
  if (message === 'AUTH_REQUIRED' || message === 'SUPER_ADMIN_REQUIRED' || code.startsWith('auth/')) {
    return jsonResponse({ error: 'Accès refusé. Connectez-vous avec un compte super administrateur.' }, 403)
  }
  if (message === 'FIREBASE_ADMIN_NOT_CONFIGURED' || message === 'FIREBASE_ADMIN_CONFIGURATION_INVALID') {
    return jsonResponse({ error: 'Le service serveur Firebase doit être configuré avant la gestion des entreprises.' }, 503)
  }
  if (message === 'INVALID_REQUEST') return jsonResponse({ error: 'Vérifiez les informations saisies.' }, 400)
  return jsonResponse({ error: 'Une erreur serveur est survenue. Réessayez dans quelques instants.' }, 500)
}
