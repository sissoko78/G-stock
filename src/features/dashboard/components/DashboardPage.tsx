import type { Movement, Product } from '../../../shared/types/domain'
import { formatDate, formatMoney, formatTime } from '../../../shared/utils/format'
import { Button } from '../../../shared/components/ui/Button'
import { Icon } from '../../../shared/components/ui/Icon'
import { DASHBOARD_ALERT_LIMIT } from '../../../shared/utils/constants'

interface Props { companyName: string; products: Product[]; movements: Movement[]; onNavigate: (page: 'products' | 'movements' | 'reports') => void; onCreateMovement: (type: 'Entrée' | 'Sortie') => void }
export function DashboardPage({ companyName, products, movements, onNavigate, onCreateMovement }: Props) {
  const monthMovements = movements.filter(isCurrentMonth)
  const sales = monthMovements.filter((item) => item.reason === 'Vente')
  const purchases = monthMovements.filter((item) => item.reason === 'Achat fournisseur')
  const revenue = sumAmounts(sales)
  const expenses = sumAmounts(purchases)
  const profit = sales.reduce((total, item) => total + item.quantity * (item.unitPrice - item.costAtTime), 0)
  const stockValue = products.reduce((total, product) => total + product.stock * product.cost, 0)
  const lowStock = products.filter((product) => product.stock <= product.threshold)
  return <><div className="page-heading"><div><div className="eyebrow">VUE D'ENSEMBLE</div><h1>Bonjour, Aminata 👋</h1><p>Voici la situation de {companyName} ce mois-ci.</p></div>
    <div className="heading-actions"><Button variant="secondary" onClick={() => onCreateMovement('Sortie')}>Enregistrer une vente</Button><Button icon="plus" onClick={() => onCreateMovement('Entrée')}>Nouvelle entrée</Button></div></div>
    <div className="stats-grid"><Metric icon="chart" tone="green" label="Chiffre d'affaires" value={formatMoney(revenue)} note="ventes ce mois-ci"/><Metric icon="swap" tone="violet" label="Bénéfice brut" value={formatMoney(profit)} note="ventes moins coût d'achat"/><Metric icon="box" tone="orange" label="Dépenses d'achat" value={formatMoney(expenses)} note="achats ce mois-ci"/><Metric icon="grid" tone="blue" label="Valeur du stock" value={formatMoney(stockValue)} note={`${products.length} produits actifs`}/></div>
    <div className="dashboard-grid"><section className="panel alerts-panel"><div className="panel-head"><div><h2>Alertes de stock</h2><p>Produits à réapprovisionner</p></div><span className="alert-count">{lowStock.length}</span></div>
      {lowStock.length ? lowStock.slice(0, DASHBOARD_ALERT_LIMIT).map((product) => <div className="alert-row" key={product.id}><span className="alert-product-icon"><Icon name="box" size={17}/></span><span className="alert-product"><b>{product.name}</b><small>Seuil : {product.threshold} {product.unit}</small></span><span className={`stock-pill ${product.stock ? '' : 'out'}`}>{product.stock || 'Rupture'}</span></div>) : <p className="empty-state">Tous les produits sont au-dessus du seuil.</p>}
      <button className="text-link" onClick={() => onNavigate('products')}>Consulter les produits <Icon name="arrow" size={15}/></button></section>
      <RecentMovements movements={movements.slice(0, 6)} products={products} onSeeAll={() => onNavigate('movements')}/></div>
    <button className="quick-tip" onClick={() => onNavigate('reports')}><span className="tip-icon">✦</span><span><b>Vos données vous appartiennent.</b><p>Retrouvez les exports et sauvegardes dans Rapports.</p></span><Icon name="arrow" size={16}/></button>
  </>
}

function isCurrentMonth(movement: Movement): boolean {
  const date = new Date(movement.date)
  const today = new Date()
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

function sumAmounts(movements: Movement[]): number {
  return movements.reduce((total, movement) => total + movement.quantity * movement.unitPrice, 0)
}

function Metric({ icon, tone, label, value, note }: { icon: 'chart' | 'swap' | 'box' | 'grid'; tone: string; label: string; value: string; note: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon name={icon}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>
}

function RecentMovements({ movements, products, onSeeAll }: { movements: Movement[]; products: Product[]; onSeeAll: () => void }) {
  return <section className="panel activity-panel"><div className="panel-head"><div><h2>Mouvements récents</h2><p>Dernières opérations enregistrées</p></div><button className="text-link" onClick={onSeeAll}>Voir le journal <Icon name="arrow" size={15}/></button></div>
    {movements.length ? movements.map((movement) => <div className="recent-row" key={movement.id}><span className={`recent-mark ${movement.type === 'Sortie' ? 'exit' : ''}`}>{movement.type === 'Entrée' ? '+' : '−'}</span><span><b>{products.find((product) => product.id === movement.productId)?.name ?? 'Produit archivé'}</b><small>{movement.reason} · {formatDate(movement.date)}</small></span><strong>{movement.type === 'Entrée' ? '+' : '−'}{movement.quantity}</strong><small>{formatTime(movement.date)}</small></div>) : <p className="empty-state">Vos opérations apparaîtront ici.</p>}</section>
}
