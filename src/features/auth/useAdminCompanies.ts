import { useCallback, useEffect, useState } from 'react'
import { adminRequest, type CompanySummary } from './adminApi'
import { useAuthSession } from './useAuthSession'

export function useAdminCompanies() {
  const { session } = useAuthSession()
  const [companies, setCompanies] = useState<CompanySummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateCompanies = useCallback(async () => (await adminRequest(session, 'GET')).companies ?? [], [session])
  const refresh = useCompanyRefresh(updateCompanies, setCompanies, setIsLoading, setError)
  return { companies, isLoading, error, setError, refresh }
}

function useCompanyRefresh(updateCompanies: () => Promise<CompanySummary[]>, setCompanies: (items: CompanySummary[]) => void, setIsLoading: (loading: boolean) => void, setError: (message: string | null) => void) {
  const refresh = useCallback(async () => refreshCompanyList(updateCompanies, setCompanies, setIsLoading, setError), [updateCompanies, setCompanies, setIsLoading, setError])
  useEffect(() => {
    let active = true
    void updateCompanies().then((nextCompanies) => {
      if (active) setCompanies(nextCompanies)
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les entreprises.')
    }).finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [updateCompanies, setCompanies, setIsLoading, setError])
  return refresh
}

async function refreshCompanyList(updateCompanies: () => Promise<CompanySummary[]>, setCompanies: (items: CompanySummary[]) => void, setIsLoading: (loading: boolean) => void, setError: (message: string | null) => void) {
  setIsLoading(true)
  setError(null)
  try { setCompanies(await updateCompanies()) }
  catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les entreprises.') }
  finally { setIsLoading(false) }
}
