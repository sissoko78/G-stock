import { Button } from './Button'

interface PaginationProps { page: number; pageCount: number; onChange: (page: number) => void }
export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount < 2) return null
  return <div className="pagination"><span>Page {page} sur {pageCount}</span>
    <div><Button variant="secondary" disabled={page === 1} onClick={() => onChange(page - 1)}>Précédent</Button>
      <Button variant="secondary" disabled={page === pageCount} onClick={() => onChange(page + 1)}>Suivant</Button></div>
  </div>
}
