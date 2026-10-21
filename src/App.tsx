import { lazy, Suspense, useEffect, useState } from 'react'
import type { PageId } from './shared/types/domain'
import { DashboardPage } from './features/dashboard/components/DashboardPage'
import { MovementPage } from './features/movements/components/MovementPage'
import { ProductPage } from './features/products/components/ProductPage'
import { SettingsPage } from './features/settings/components/SettingsPage'
import { SupplierPage } from './features/suppliers/components/SupplierPage'
import { UsersPage } from './features/users/components/UsersPage'
import { useAppData } from './features/inventory/hooks/useAppData'
import { downloadCsv } from './shared/services/exportService'
import { ToastRegion } from './shared/components/ui/ToastRegion'
import { HelpDialog } from './shared/components/ui/HelpDialog'
import { Icon, type IconName } from './shared/components/ui/Icon'
import { formatDate } from './shared/utils/format'

const navigation: Array<{ title: string; section: string; icon: IconName }> = [
  { title: 'Tableau de bord', section: 'dashboard', icon: 'grid' },
  { title: 'Produits', section: 'products', icon: 'box' },
  { title: 'Mouvements', section: 'movements', icon: 'swap' },
  { title: 'Rapports', section: 'reports', icon: 'chart' },
  { title: 'Fournisseurs', section: 'suppliers', icon: 'users' },
  { title: 'Utilisateurs', section: 'users', icon: 'users' },
  { title: 'Paramètres', section: 'settings', icon: 'gear' },
]
const ReportsPage = lazy(() => import('./features/reports').then((feature) => ({ default: feature.ReportsPage })))

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [movementIntent, setMovementIntent] = useState<'Entrée' | 'Sortie' | null>(null)
  const inventory = useAppData()
  const activeProducts = inventory.data.products.filter((product) => !product.archived)
  useKeyboardShortcuts()
  const handleNavigate = (nextPage: PageId) => { setPage(nextPage); setMobileNav(false) }
  return <div className="app-shell"><Sidebar page={page} mobileNav={mobileNav} onNavigate={handleNavigate} onClose={() => setMobileNav(false)} onHelp={() => setIsHelpOpen(true)} products={activeProducts}/>
    <main className="main-area"><Topbar page={page} onMenu={() => setMobileNav((open) => !open)} onAlerts={() => handleNavigate('products')}/>
      <div className="page-content"><PageContent page={page} setPage={handleNavigate} inventory={inventory} products={activeProducts} movementIntent={movementIntent} onMovementIntentHandled={() => setMovementIntent(null)} onCreateMovement={(type) => { setMovementIntent(type); handleNavigate('movements') }}/></div>
      <footer className="page-footer"><span>© {new Date().getFullYear()} {inventory.data.company.name} · G-stock</span><span>Gestion simple, stock maîtrisé.</span></footer>
    </main>{isHelpOpen && <HelpDialog onClose={() => setIsHelpOpen(false)} onNavigate={handleNavigate}/>}<ToastRegion messages={inventory.messages} onDismiss={inventory.dismiss}/>
  </div>
}

function useKeyboardShortcuts(): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); document.querySelector<HTMLInputElement>('.search-box input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

function Sidebar({ page, mobileNav, onNavigate, onClose, onHelp, products }: { page: PageId; mobileNav: boolean; onNavigate: (page: PageId) => void; onClose: () => void; onHelp: () => void; products: ReturnType<typeof useAppData>['data']['products'] }) {
  const lowStockCount = products.filter((product) => product.stock <= product.threshold).length
  return <><aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}><button className="brand" onClick={() => onNavigate('dashboard')}><span className="brand-mark"><Icon name="box" size={21}/></span><span className="brand-name">g<span>stock</span><small>GESTION DE STOCK</small></span></button>
    <div className="store-card"><span className="store-icon">G</span><span className="store-details"><b>Point de vente</b><small>Votre boutique</small></span></div>
    <nav className="nav-list" aria-label="Navigation principale"><NavGroup title="PRINCIPAL" links={navigation.slice(0, 4)} page={page} onNavigate={onNavigate} alertCount={lowStockCount}/><NavGroup title="GESTION" links={navigation.slice(4)} page={page} onNavigate={onNavigate}/></nav>
    <div className="sidebar-bottom"><button className="help-card" onClick={onHelp}><span className="help-icon">?</span><span><b>Besoin d'aide ?</b><small>Ouvrir le guide rapide</small></span><Icon name="arrow" size={16}/></button><div className="user-card"><div className="avatar">AT</div><div className="user-info"><b>Aminata Traoré</b><small>Profil local de démonstration</small></div></div></div></aside>
    {mobileNav && <button className="nav-backdrop" aria-label="Fermer le menu" onClick={onClose}/>}</>
}

function NavGroup({ title, links, page, onNavigate, alertCount = 0 }: { title: string; links: typeof navigation; page: PageId; onNavigate: (page: PageId) => void; alertCount?: number }) {
  return <div className="nav-group"><div className="nav-section">{title}</div>{links.map((item) => <button key={item.section} className={`nav-link ${page === item.section ? 'active' : ''}`} aria-current={page === item.section ? 'page' : undefined} onClick={() => onNavigate(item.section as PageId)}><Icon name={item.icon}/><span>{item.title}</span>{item.section === 'products' && alertCount > 0 && <i className="nav-count">{alertCount}</i>}</button>)}</div>
}

function Topbar({ page, onMenu, onAlerts }: { page: PageId; onMenu: () => void; onAlerts: () => void }) {
  const title = navigation.find((item) => item.section === page)?.title ?? 'Tableau de bord'
  return <header className="topbar"><button className="mobile-menu" aria-label="Ouvrir le menu" onClick={onMenu}>☰</button><div className="breadcrumb">Pages <span>/</span> <b>{title}</b></div>
    <div className="top-actions"><span className="today-label">{formatDate(new Date().toISOString())}</span><button className="icon-button notification" aria-label="Voir les alertes de stock" onClick={onAlerts}><Icon name="alert"/></button><div className="top-avatar">AT</div></div></header>
}

function PageContent({ page, setPage, inventory, products, movementIntent, onMovementIntentHandled, onCreateMovement }: { page: PageId; setPage: (page: PageId) => void; inventory: ReturnType<typeof useAppData>; products: ReturnType<typeof useAppData>['data']['products']; movementIntent: 'Entrée' | 'Sortie' | null; onMovementIntentHandled: () => void; onCreateMovement: (type: 'Entrée' | 'Sortie') => void }) {
  if (page === 'dashboard') return <DashboardPage companyName={inventory.data.company.name} products={products} movements={inventory.data.movements} onNavigate={setPage} onCreateMovement={onCreateMovement}/>
  if (page === 'products') return <ProductPage products={products} onSave={inventory.addProduct} onArchive={inventory.archiveProduct} onExport={() => { downloadCsv([['Produit', 'Référence', 'Catégorie', 'Unité', 'Stock', 'Seuil', 'Coût unitaire', 'Valeur'], ...products.map((product) => [product.name, product.sku, product.category, product.unit, product.stock, product.threshold, product.cost, product.stock * product.cost])], 'etat-du-stock.csv'); inventory.notify('success', 'État du stock exporté au format CSV.') }}/>
  if (page === 'movements') return <MovementPage movements={inventory.data.movements} products={products} suppliers={inventory.data.suppliers} onSave={inventory.recordMovement} initialType={movementIntent} onInitialTypeHandled={onMovementIntentHandled}/>
  if (page === 'reports') return <Suspense fallback={<ReportSkeleton/>}><ReportsPage data={inventory.data} onRestore={inventory.restoreData} onError={(message) => inventory.notify('error', message)} onNotice={(message) => inventory.notify('success', message)}/></Suspense>
  if (page === 'suppliers') return <SupplierPage suppliers={inventory.data.suppliers} movements={inventory.data.movements} onAdd={inventory.addSupplier} onRemove={inventory.removeSupplier}/>
  if (page === 'users') return <UsersPage onInfo={(message) => inventory.notify('info', message)}/>
  return <SettingsPage key={JSON.stringify(inventory.data.company)} data={inventory.data} onUpdate={inventory.updateCompany} onRestore={inventory.restoreData} onError={(message) => inventory.notify('error', message)}/>
}

function ReportSkeleton() {
  return <div className="report-skeleton" aria-label="Chargement des rapports"><span/><span/><span/><div/></div>
}
