import { useState } from 'react'
import type { Movement, Product, Supplier } from '../../../shared/types/domain'
import type { MovementFormData } from '../../../shared/services/appDataSchema'
import { formatDate, formatMoney, formatTime } from '../../../shared/utils/format'
import { Button } from '../../../shared/components/ui/Button'
import { Icon } from '../../../shared/components/ui/Icon'
import { SearchBox } from '../../../shared/components/ui/SearchBox'
import { MovementFormDialog } from './MovementFormDialog'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Modal } from '../../../shared/components/ui/Modal'
import { LIST_PAGE_SIZE } from '../../../shared/utils/constants'

interface Props { movements: Movement[]; products: Product[]; suppliers: Supplier[]; onSave: (data: MovementFormData) => boolean; initialType?: 'Entrée' | 'Sortie' | null; onInitialTypeHandled: () => void }
export function MovementPage({ movements, products, suppliers, onSave, initialType, onInitialTypeHandled }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [movementType, setMovementType] = useState<'Entrée' | 'Sortie' | null>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [page, setPage] = useState(1)
  const activeMovementType = movementType ?? initialType
  const handleCloseDialog = () => { setMovementType(null); onInitialTypeHandled() }
  const term = query.toLocaleLowerCase('fr')
  const filtered = movements.filter((item) => matchesMovement(item, products, term, filter))
  const pageCount = Math.ceil(filtered.length / LIST_PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * LIST_PAGE_SIZE, page * LIST_PAGE_SIZE)
  const handleSearch = (value: string) => { setQuery(value); setPage(1) }
  return <><MovementPageHeading onInventory={() => setIsInventoryOpen(true)} onEntry={() => setMovementType('Entrée')} onExit={() => setMovementType('Sortie')}/>
    <section className="panel data-panel"><div className="toolbar"><SearchBox value={query} onChange={handleSearch} placeholder="Produit, motif, fournisseur…"/><select className="select-control" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1) }}><option>Tous</option><option>Entrée</option><option>Sortie</option></select></div>
    {paginated.length ? <MovementTable movements={paginated} products={products} /> : <div className="empty-notice"><span><Icon name="swap" /></span><b>Aucun mouvement trouvé</b><p>Enregistrez une entrée ou modifiez votre recherche.</p><Button onClick={() => setMovementType('Entrée')}>Enregistrer une entrée</Button></div>}
    <div className="table-footer"><span>{filtered.length} mouvement(s)</span><span>Les opérations sont horodatées et historisées.</span></div><Pagination page={page} pageCount={pageCount} onChange={setPage}/></section>
    {activeMovementType && <MovementFormDialog type={activeMovementType} products={products} suppliers={suppliers} onClose={handleCloseDialog} onSave={onSave} />}
    {isInventoryOpen && <InventoryDialog products={products} onClose={() => setIsInventoryOpen(false)} onSave={onSave}/>}</>
}

function MovementPageHeading({ onInventory, onEntry, onExit }: { onInventory: () => void; onEntry: () => void; onExit: () => void }) {
  return <div className="page-heading"><div><div className="eyebrow">TRAÇABILITÉ</div><h1>Mouvements</h1><p>Retrouvez les entrées, ventes et ajustements de stock.</p></div>
    <div className="heading-actions"><Button variant="secondary" onClick={onInventory}>Faire un inventaire</Button><Button variant="secondary" icon="swap" onClick={onExit}>Enregistrer une sortie</Button><Button icon="plus" onClick={onEntry}>Enregistrer une entrée</Button></div></div>
}

function matchesMovement(item: Movement, products: Product[], term: string, filter: string): boolean {
  const name = products.find((product) => product.id === item.productId)?.name ?? ''
  return (filter === 'Tous' || item.type === filter) && `${name} ${item.reason} ${item.supplier}`.toLocaleLowerCase('fr').includes(term)
}

function MovementTable({ movements, products }: { movements: Movement[]; products: Product[] }) {
  return <div className="table-scroll"><table><thead><tr><th>OPÉRATION</th><th>PRODUIT</th><th>QUANTITÉ</th><th>PRIX UNITAIRE</th><th>MONTANT</th><th>DATE & HEURE</th><th>UTILISATEUR</th></tr></thead><tbody>
    {movements.map((item) => <MovementRow key={item.id} movement={item} products={products} />)}</tbody></table></div>
}

function MovementRow({ movement, products }: { movement: Movement; products: Product[] }) {
  const product = products.find((item) => item.id === movement.productId)
  return <tr><td><span className={`movement-tag ${movement.type === 'Entrée' ? 'entry' : 'exit'}`}><i />{movement.reason}</span></td>
    <td className="bold">{product?.name ?? 'Produit archivé'}</td><td><span className={`qty-label ${movement.type === 'Entrée' ? 'positive' : 'negative'}`}>{movement.type === 'Entrée' ? '+' : '−'}{movement.quantity}</span></td>
    <td>{formatMoney(movement.unitPrice)}</td><td className="numeric bold">{formatMoney(movement.quantity * movement.unitPrice)}</td>
    <td>{formatDate(movement.date)}<small className="subcell">{formatTime(movement.date)}</small></td><td><span className="user-inline"><i>AT</i>{movement.user}</span></td></tr>
}

function InventoryDialog({ products, onClose, onSave }: { products: Product[]; onClose: () => void; onSave: (data: MovementFormData) => boolean }) {
  const [counts, setCounts] = useState(() => Object.fromEntries(products.map((product) => [product.id, String(product.stock)])))
  const [isConfirming, setIsConfirming] = useState(false)
  const differences = products.map((product) => ({ product, quantity: Number(counts[product.id] ?? product.stock) - product.stock })).filter((item) => item.quantity !== 0)
  const hasInvalidCount = products.some((product) => isInvalidCount(counts[product.id] ?? String(product.stock)))
  const handleValidate = () => {
    differences.forEach(({ product, quantity }) => onSave({ productId: product.id, type: quantity > 0 ? 'Entrée' : 'Sortie', reason: quantity > 0 ? 'Ajustement positif' : 'Ajustement négatif', quantity: Math.abs(quantity), unitPrice: product.cost, supplier: '' }))
    onClose()
  }
  return <Modal title={isConfirming ? 'Confirmer les écarts' : 'Inventaire physique'} onClose={onClose} wide>
    {isConfirming ? <InventoryConfirmation differences={differences.length} onBack={() => setIsConfirming(false)} onConfirm={handleValidate}/> : <InventoryCounts products={products} counts={counts} onChange={setCounts} hasInvalidCount={hasInvalidCount} onContinue={() => { if (hasInvalidCount) return; if (differences.length) setIsConfirming(true); else onClose() }} onClose={onClose}/>}
  </Modal>
}

function InventoryCounts({ products, counts, onChange, hasInvalidCount, onContinue, onClose }: { products: Product[]; counts: Record<string, string>; onChange: (counts: Record<string, string>) => void; hasInvalidCount: boolean; onContinue: () => void; onClose: () => void }) {
  return <><p className="inventory-intro">Comptez vos produits et saisissez les quantités réelles. Les différences seront ajoutées au journal.</p><div className="inventory-list"><div className="inventory-head"><span>PRODUIT</span><span>STOCK</span><span>COMPTÉ</span><span>ÉCART</span></div>
    {products.map((product) => <div className="inventory-row" key={product.id}><span><b>{product.name}</b><small>{product.sku}</small></span><span>{product.stock} {product.unit}</span><span><input aria-label={`Quantité comptée pour ${product.name}`} type="number" min="0" step="1" value={counts[product.id]} onChange={(event) => onChange({ ...counts, [product.id]: event.target.value })}/></span><b>{Number(counts[product.id] ?? product.stock) - product.stock || '—'}</b></div>)}</div>
    {hasInvalidCount && <p className="form-error" role="alert">Saisissez un nombre entier égal ou supérieur à zéro pour chaque produit.</p>}<div className="modal-actions"><Button variant="secondary" onClick={onClose}>Annuler</Button><Button disabled={hasInvalidCount} onClick={onContinue}>Vérifier les écarts</Button></div></>
}

function InventoryConfirmation({ differences, onBack, onConfirm }: { differences: number; onBack: () => void; onConfirm: () => void }) {
  return <><p className="inventory-confirm-copy">{differences} produit(s) présentent un écart. Chaque correction sera inscrite au journal des mouvements.</p><div className="modal-actions"><Button variant="secondary" onClick={onBack}>Revoir le comptage</Button><Button onClick={onConfirm}>Enregistrer les ajustements</Button></div></>
}

function isInvalidCount(value: string): boolean {
  return value.trim() === '' || !Number.isInteger(Number(value)) || Number(value) < 0
}
