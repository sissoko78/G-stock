import { useEffect, useMemo, useState } from 'react'
import './App.css'

const initialProducts = [
  { id: 'p1', name: 'Riz parfumé', sku: 'AL-001', category: 'Épicerie', unit: 'sac', cost: 18000, stock: 24, threshold: 8, archived: false },
  { id: 'p2', name: 'Huile végétale', sku: 'AL-002', category: 'Épicerie', unit: 'bidon', cost: 6500, stock: 7, threshold: 10, archived: false },
  { id: 'p3', name: 'Savon doux', sku: 'HY-001', category: 'Hygiène', unit: 'pièce', cost: 500, stock: 42, threshold: 12, archived: false },
  { id: 'p4', name: 'Lait en poudre', sku: 'AL-003', category: 'Épicerie', unit: 'boîte', cost: 3200, stock: 0, threshold: 6, archived: false },
  { id: 'p5', name: 'Eau minérale 1,5 L', sku: 'BO-001', category: 'Boissons', unit: 'bouteille', cost: 350, stock: 36, threshold: 12, archived: false },
  { id: 'p6', name: 'Sucre blanc', sku: 'AL-004', category: 'Épicerie', unit: 'kg', cost: 700, stock: 18, threshold: 8, archived: false },
]
const initialSuppliers = [
  { id: 's1', name: 'Distribution Bamako', phone: '+223 70 12 34 56', email: 'contact@distribution.ml', address: 'Hamdallaye, Bamako' },
  { id: 's2', name: 'Agro Sahel', phone: '+223 76 45 67 89', email: 'ventes@agrosahel.ml', address: 'Sogoniko, Bamako' },
]
const initialMovements = [
  { id: 'm1', productId: 'p1', type: 'Entrée', reason: 'Achat fournisseur', quantity: 30, unitPrice: 18000, date: new Date(Date.now() - 86400000 * 5).toISOString(), supplier: 'Distribution Bamako', user: 'Aminata Traoré' },
  { id: 'm2', productId: 'p3', type: 'Sortie', reason: 'Vente', quantity: 8, unitPrice: 750, date: new Date(Date.now() - 86400000 * 2).toISOString(), supplier: '', user: 'Aminata Traoré' },
  { id: 'm3', productId: 'p2', type: 'Entrée', reason: 'Achat fournisseur', quantity: 12, unitPrice: 6500, date: new Date(Date.now() - 86400000).toISOString(), supplier: 'Agro Sahel', user: 'Aminata Traoré' },
  { id: 'm4', productId: 'p5', type: 'Sortie', reason: 'Vente', quantity: 4, unitPrice: 500, date: new Date().toISOString(), supplier: '', user: 'Aminata Traoré' },
]
const money = (n) => `${new Intl.NumberFormat('fr-FR').format(Math.round(Number(n) || 0))} F`
const dateLabel = (value) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
const timeLabel = (value) => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

function load(key, fallback) {
  try { const stored = localStorage.getItem(`gstock-${key}`); return stored ? JSON.parse(stored) : fallback } catch { return fallback }
}
function Icon({ name, size = 19 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9"/></>,
    swap: <><path d="M7 7h14l-3-3M17 17H3l3 3"/><path d="M18 4v6M6 14v6"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1L15.8 21h-2.8l-.3-1.9a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.5-1.2a7 7 0 0 1 0-2l-1.5-1.2 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1L13 5h2.8l.3 1.9a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.5 1.2a7 7 0 0 1 0 2Z" transform="translate(-1 -1)"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    alert: <><path d="m10.3 3.8-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const nav = [
  { section: 'PRINCIPAL', items: [['dashboard', 'grid', 'Tableau de bord'], ['products', 'box', 'Produits'], ['movements', 'swap', 'Mouvements'], ['reports', 'chart', 'Rapports']] },
  { section: 'GESTION', items: [['suppliers', 'users', 'Fournisseurs'], ['users', 'users', 'Utilisateurs'], ['settings', 'gear', 'Paramètres']] },
]

function App() {
  const [products, setProducts] = useState(() => load('products', initialProducts))
  const [suppliers, setSuppliers] = useState(() => load('suppliers', initialSuppliers))
  const [movements, setMovements] = useState(() => load('movements', initialMovements))
  const [page, setPage] = useState('dashboard')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState('')
  const [dateRange, setDateRange] = useState('7 jours')
  const [company, setCompany] = useState(() => load('company', { name: 'Ma Boutique', phone: '+223 70 00 00 00', currency: 'FCFA' }))
  const [mobileNav, setMobileNav] = useState(false)
  useEffect(() => localStorage.setItem('gstock-products', JSON.stringify(products)), [products])
  useEffect(() => localStorage.setItem('gstock-suppliers', JSON.stringify(suppliers)), [suppliers])
  useEffect(() => localStorage.setItem('gstock-movements', JSON.stringify(movements)), [movements])
  useEffect(() => localStorage.setItem('gstock-company', JSON.stringify(company)), [company])
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer) } }, [toast])

  const activeProducts = products.filter((p) => !p.archived)
  const lowStock = activeProducts.filter((p) => p.stock <= p.threshold)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonth = movements.filter((m) => { const d = new Date(m.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear })
  const sales = thisMonth.filter((m) => m.type === 'Sortie' && m.reason === 'Vente')
  const purchases = thisMonth.filter((m) => m.type === 'Entrée' && m.reason === 'Achat fournisseur')
  const revenue = sales.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0)
  const expenses = purchases.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0)
  const cogs = sales.reduce((sum, m) => sum + m.quantity * (m.costAtTime ?? products.find((p) => p.id === m.productId)?.cost ?? 0), 0)
  const grossProfit = revenue - cogs
  const inventoryValue = activeProducts.reduce((sum, p) => sum + p.stock * p.cost, 0)
  const productName = (id) => products.find((p) => p.id === id)?.name || 'Produit archivé'

  const addMovement = (data) => {
    const product = products.find((p) => p.id === data.productId)
    if (!product || !data.quantity || data.quantity < 1) { setToast('Vérifiez le produit et la quantité.'); return false }
    const incoming = data.type === 'Entrée'
    if (!incoming && product.stock < Number(data.quantity)) { setToast(`Stock insuffisant : ${product.stock} ${product.unit} disponible(s).`); return false }
    const movement = { ...data, id: uid(), quantity: Number(data.quantity), unitPrice: Number(data.unitPrice || 0), costAtTime: Number(product.cost || 0), date: data.date || new Date().toISOString(), user: 'Aminata Traoré' }
    setProducts((items) => items.map((p) => p.id === product.id ? { ...p, stock: p.stock + (incoming ? movement.quantity : -movement.quantity), cost: incoming && movement.reason === 'Achat fournisseur' ? movement.unitPrice : p.cost } : p))
    setMovements((items) => [movement, ...items])
    setDialog(null)
    setToast(incoming ? 'Entrée de stock enregistrée.' : 'Sortie de stock enregistrée.')
    return true
  }
  const exportCsv = (rows, filename) => {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(';')).join('\r\n')
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); URL.revokeObjectURL(link.href)
  }
  const exportProducts = () => exportCsv([['Produit', 'Référence', 'Catégorie', 'Unité', 'Stock', 'Seuil', 'Coût unitaire', 'Valeur'], ...activeProducts.map((p) => [p.name, p.sku, p.category, p.unit, p.stock, p.threshold, p.cost, p.stock * p.cost])], 'etat-du-stock.csv')
  const exportMovements = () => exportCsv([['Date', 'Produit', 'Type', 'Motif', 'Quantité', 'Prix unitaire', 'Montant', 'Utilisateur'], ...movements.map((m) => [new Date(m.date).toLocaleString('fr-FR'), productName(m.productId), m.type, m.reason, m.quantity, m.unitPrice, m.quantity * m.unitPrice, m.user])], 'journal-des-mouvements.csv')
  const exportBackup = () => {
    const blob = new Blob([JSON.stringify({ version: 1, products, suppliers, movements, company }, null, 2)], { type: 'application/json' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'sauvegarde-g-stock.json'; link.click(); URL.revokeObjectURL(link.href)
  }
  const restoreBackup = (file) => {
    if (!file) return
    const reader = new FileReader(); reader.onload = () => { try { const backup = JSON.parse(reader.result); if (!backup.products || !backup.movements || !backup.suppliers) throw new Error(); setProducts(backup.products); setMovements(backup.movements); setSuppliers(backup.suppliers); if (backup.company) setCompany(backup.company); setToast('Sauvegarde restaurée.') } catch { setToast('Fichier de sauvegarde invalide.') } }; reader.readAsText(file)
  }

  const openProductForm = (product = null) => setDialog({ type: 'product', product })
  const saveProduct = (form) => {
    if (form.id) { setProducts((items) => items.map((p) => p.id === form.id ? { ...p, ...form, cost: Number(form.cost), threshold: Number(form.threshold) } : p)); setToast('Produit modifié.') }
    else { setProducts((items) => [{ ...form, id: uid(), stock: 0, archived: false, cost: Number(form.cost), threshold: Number(form.threshold) }, ...items]); setToast('Produit ajouté.') }
    setDialog(null)
  }
  const archiveProduct = (product) => { if (window.confirm(`Archiver « ${product.name} » ?`)) { setProducts((items) => items.map((p) => p.id === product.id ? { ...p, archived: true } : p)); setToast('Produit archivé.') } }
  const filteredProducts = useMemo(() => activeProducts.filter((p) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'Tous' || (filter === 'Stock faible' ? p.stock > 0 && p.stock <= p.threshold : filter === 'En rupture' ? p.stock === 0 : p.category === filter))), [activeProducts, query, filter])
  const filteredMovements = movements.filter((m) => `${productName(m.productId)} ${m.reason} ${m.supplier}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'Tous' || m.type === filter))

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <button className="brand" onClick={() => { setPage('dashboard'); setMobileNav(false) }}><span className="brand-mark"><Icon name="box" size={21} /></span><span className="brand-name">g<span>stock</span><small>GESTION DE STOCK</small></span></button>
      <div className="store-card"><span className="store-icon">{company.name.slice(0, 1).toUpperCase()}</span><span className="store-details"><b>{company.name}</b><small>Point de vente principal</small></span><Icon name="more" size={18} /></div>
      <nav className="nav-list">{nav.map((group) => <div className="nav-group" key={group.section}><div className="nav-section">{group.section}</div>{group.items.map(([key, icon, label]) => <button key={key} className={`nav-link ${page === key ? 'active' : ''}`} onClick={() => { setPage(key); setMobileNav(false) }}><Icon name={icon} /><span>{label}</span>{key === 'products' && lowStock.length > 0 && <i className="nav-count">{lowStock.length}</i>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="help-card" onClick={() => setDialog({ type: 'help' })}><span className="help-icon">?</span><span><b>Besoin d'aide ?</b><small>Consulter le guide rapide</small></span><Icon name="arrow" size={16} /></button><div className="user-card"><div className="avatar">AT</div><div className="user-info"><b>Aminata Traoré</b><small>Administratrice</small></div><button aria-label="Paramètres utilisateur" onClick={() => setPage('settings')}><Icon name="more" /></button></div></div>
    </aside>
    {mobileNav && <button className="nav-backdrop" aria-label="Fermer le menu" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Ouvrir le menu">☰</button><div className="breadcrumb">Pages <span>/</span> <b>{nav.flatMap((g) => g.items).find((i) => i[0] === page)?.[2] || 'Tableau de bord'}</b></div><div className="top-actions"><span className="today-label">{new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</span><button className="icon-button notification" aria-label="Alertes de stock" onClick={() => { setPage('products'); setFilter('Stock faible') }}><Icon name="alert" /><i>{lowStock.length}</i></button><div className="top-avatar">AT</div></div></header>
      <div className="page-content">
        {page === 'dashboard' && <Dashboard {...{ company, activeProducts, lowStock, revenue, expenses, grossProfit, inventoryValue, sales, movements, productName, dateRange, setDateRange, setPage, setDialog, money, dateLabel, timeLabel, exportProducts }} />}
        {page === 'products' && <ProductsPage {...{ products: filteredProducts, query, setQuery, filter, setFilter, categories: [...new Set(activeProducts.map((p) => p.category))], money, setDialog: openProductForm, archiveProduct, exportProducts, allProducts: products }} />}
        {page === 'movements' && <MovementsPage {...{ movements: filteredMovements, query, setQuery, filter, setFilter, productName, money, dateLabel, timeLabel, setDialog, addMovement, suppliers, products: activeProducts, exportMovements }} />}
        {page === 'reports' && <ReportsPage {...{ activeProducts, movements, suppliers, money, productName, exportProducts, exportMovements, exportBackup, restoreBackup, dateRange, setDateRange }} />}
        {page === 'suppliers' && <SuppliersPage {...{ suppliers, setSuppliers, movements, money, setToast, setDialog }} />}
        {page === 'users' && <UsersPage />}
        {page === 'settings' && <SettingsPage {...{ company, setCompany, exportBackup, restoreBackup, setToast }} />}
      </div>
      <footer className="page-footer"><span>© {new Date().getFullYear()} {company.name} · G-stock</span><span>Gestion simple, stock maîtrisé.</span></footer>
    </main>
    {dialog?.type === 'product' && <ProductDialog product={dialog.product} products={products} onClose={() => setDialog(null)} onSave={saveProduct} />}
    {dialog?.type === 'movement' && <MovementDialog mode={dialog.mode} products={activeProducts} suppliers={suppliers} onClose={() => setDialog(null)} onSave={addMovement} />}
    {dialog?.type === 'supplier' && <SupplierDialog onClose={() => setDialog(null)} onSave={(supplier) => { setSuppliers((items) => [{ ...supplier, id: uid() }, ...items]); setDialog(null); setToast('Fournisseur ajouté.') }} />}
    {dialog?.type === 'inventory' && <InventoryDialog products={activeProducts} onClose={() => setDialog(null)} onSave={addMovement} />}
    {dialog?.type === 'help' && <Modal title="Guide de démarrage" onClose={() => setDialog(null)}><p className="help-copy">Ajoutez vos produits, enregistrez vos achats comme entrées, puis saisissez chaque vente pour garder votre stock et vos indicateurs à jour.</p><ul className="help-list"><li>Les ventes et sorties ne peuvent pas dépasser le stock disponible.</li><li>Le coût d'achat est actualisé par les entrées fournisseur.</li><li>Exportez vos rapports au format CSV depuis la page Rapports.</li><li>La sauvegarde JSON se trouve dans Paramètres.</li></ul><button className="btn-primary full-btn" onClick={() => { setDialog(null); setPage('products') }}>Ajouter un produit <Icon name="arrow" size={16} /></button></Modal>}
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>
}

function PageTitle({ eyebrow, title, description, actions }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div> }
function Button({ children, variant = 'primary', onClick, icon, ...props }) { return <button className={`btn-${variant}`} onClick={onClick} {...props}>{icon && <Icon name={icon} size={17} />}{children}</button> }
function StatCard({ label, value, note, icon, tone, trend }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon name={icon} size={20} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{trend && <em>{trend}</em>}{note}</small></div></div> }
function Dashboard({ company, activeProducts, lowStock, revenue, expenses, grossProfit, inventoryValue, sales, movements, productName, dateRange, setDateRange, setPage, setDialog, money, dateLabel, timeLabel, exportProducts }) {
  const recent = movements.slice(0, 5)
  const chartDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d })
  const values = chartDays.map((d) => movements.filter((m) => new Date(m.date).toDateString() === d.toDateString() && m.type === 'Sortie' && m.reason === 'Vente').reduce((s, m) => s + m.quantity * m.unitPrice, 0))
  const maxVal = Math.max(...values, 1)
  return <>
    <PageTitle eyebrow="VUE D'ENSEMBLE" title={`Bonjour, Aminata 👋`} description={`Voici ce qui se passe dans ${company.name} aujourd'hui.`} actions={<><select className="select-control date-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}><option>7 jours</option><option>Ce mois</option><option>Cette année</option></select><Button variant="secondary" icon="download" onClick={exportProducts}>Exporter</Button><Button icon="plus" onClick={() => setDialog({ type: 'movement', mode: 'Entrée' })}>Nouvelle entrée</Button></>} />
    <div className="stats-grid"><StatCard label="Chiffre d'affaires" value={money(revenue)} note="ce mois-ci" icon="chart" tone="green" trend="↗ " /><StatCard label="Bénéfice brut" value={money(grossProfit)} note="ce mois-ci" icon="swap" tone="violet" /><StatCard label="Dépenses d'achat" value={money(expenses)} note="ce mois-ci" icon="box" tone="orange" /><StatCard label="Valeur du stock" value={money(inventoryValue)} note={`${activeProducts.length} produits actifs`} icon="grid" tone="blue" /></div>
    <div className="dashboard-grid"><section className="panel sales-panel"><div className="panel-head"><div><h2>Activité des ventes</h2><p>Chiffre d'affaires sur les 7 derniers jours</p></div><span className="live-tag"><i /> EN DIRECT</span></div><div className="chart-legend"><i /> Ventes <b>{money(revenue)}</b></div><div className="chart-area"><div className="chart-y-labels"><span>{money(maxVal)}</span><span>{money(maxVal * .66)}</span><span>{money(maxVal * .33)}</span><span>0 F</span></div><div className="chart-main"><div className="chart-gridlines"><i /><i /><i /><i /></div><div className="bars">{values.map((v, i) => <div className="bar-wrap" key={i}><div className={`bar ${i === values.length - 1 ? 'bar-current' : ''}`} style={{ height: `${Math.max(v / maxVal * 100, v > 0 ? 5 : 2)}%` }} title={money(v)} /><span>{new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(chartDays[i])}</span></div>)}</div></div></div></section>
    <section className="panel alerts-panel"><div className="panel-head"><div><h2>Alertes de stock</h2><p>Produits à réapprovisionner</p></div><span className="alert-count">{lowStock.length}</span></div>{lowStock.length ? <div className="alert-list">{lowStock.slice(0, 4).map((p) => <div className="alert-row" key={p.id}><span className={`alert-product-icon ${p.stock === 0 ? 'empty' : ''}`}><Icon name="box" size={17} /></span><span className="alert-product"><b>{p.name}</b><small>Seuil minimum : {p.threshold} {p.unit}</small></span><span className={`stock-pill ${p.stock === 0 ? 'out' : ''}`}>{p.stock === 0 ? 'Rupture' : `${p.stock} ${p.unit}`}</span></div>)}</div> : <div className="empty-state">Tous les produits sont au-dessus du seuil.</div>}<button className="text-link" onClick={() => setPage('products')}>Voir tous les produits <Icon name="arrow" size={15} /></button></section></div>
    <section className="panel activity-panel"><div className="panel-head"><div><h2>Mouvements récents</h2><p>Dernières opérations enregistrées</p></div><button className="text-link" onClick={() => setPage('movements')}>Voir le journal <Icon name="arrow" size={15} /></button></div><MovementTable movements={recent} productName={productName} money={money} dateLabel={dateLabel} timeLabel={timeLabel} compact /></section>
    <div className="dashboard-bottom"><div className="quick-tip"><div className="tip-icon">✦</div><div><b>Un inventaire à jour, c'est moins de surprises.</b><p>Comptez vos produits et ajustez votre stock physique.</p></div><button onClick={() => setDialog({ type: 'inventory' })}>Faire un inventaire <Icon name="arrow" size={15} /></button></div><span className="dashboard-meta">{sales.length} vente(s) enregistrée(s) ce mois</span></div>
  </>
}

function SearchBox({ query, setQuery, placeholder }) { return <label className="search-box"><Icon name="search" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder || 'Rechercher…'} /><kbd>⌘ K</kbd></label> }
function ProductsPage({ products, query, setQuery, filter, setFilter, categories, money, setDialog, archiveProduct, exportProducts, allProducts }) {
  return <><PageTitle eyebrow="CATALOGUE" title="Produits" description="Gérez votre catalogue et suivez les niveaux de stock." actions={<><Button variant="secondary" icon="download" onClick={exportProducts}>Exporter</Button><Button icon="plus" onClick={() => setDialog(null)}>Ajouter un produit</Button></>} />
    <section className="panel data-panel"><div className="toolbar"><SearchBox query={query} setQuery={setQuery} placeholder="Nom, référence, catégorie…" /><div className="toolbar-right"><select className="select-control" value={filter} onChange={(e) => setFilter(e.target.value)}><option>Tous</option><option>Stock faible</option><option>En rupture</option>{categories.map((c) => <option key={c}>{c}</option>)}</select><span className="item-count">{products.length} produit{products.length === 1 ? '' : 's'}</span></div></div>
      {products.length ? <div className="table-scroll"><table><thead><tr><th>PRODUIT</th><th>CATÉGORIE</th><th>COÛT D'ACHAT</th><th>STOCK DISPONIBLE</th><th>SEUIL D'ALERTE</th><th>VALEUR DU STOCK</th><th /></tr></thead><tbody>{products.map((p, i) => <tr key={p.id}><td><div className="product-cell"><span className={`product-thumb thumb-${i % 5}`}>{p.name.slice(0, 1).toUpperCase()}</span><span><b>{p.name}</b><small>{p.sku}</small></span></div></td><td><span className="category-label">{p.category}</span></td><td className="numeric">{money(p.cost)}</td><td><div className="stock-cell"><b className={p.stock <= p.threshold ? 'low-value' : ''}>{p.stock}</b><small>{p.unit}</small>{p.stock <= p.threshold && <span className={`mini-status ${p.stock === 0 ? 'out' : ''}`}>{p.stock === 0 ? 'Rupture' : 'Stock faible'}</span>}</div></td><td>{p.threshold} <span className="muted">{p.unit}</span></td><td className="numeric bold">{money(p.stock * p.cost)}</td><td><div className="row-actions"><button title="Modifier le produit" onClick={() => setDialog(p)}>Modifier</button><button title="Archiver le produit" onClick={() => archiveProduct(p)}><Icon name="more" /></button></div></td></tr>)}</tbody></table></div> : <EmptyNotice title="Aucun produit trouvé" message="Modifiez vos filtres ou ajoutez un nouveau produit." />}<div className="table-footer"><span>Affichage de {products.length} sur {allProducts.filter((p) => !p.archived).length} produits actifs</span><span>Valeur totale : <b>{money(products.reduce((s, p) => s + p.stock * p.cost, 0))}</b></span></div></section></>
}
function EmptyNotice({ title, message }) { return <div className="empty-notice"><span><Icon name="box" size={22} /></span><b>{title}</b><p>{message}</p></div> }
function MovementsPage({ movements, query, setQuery, filter, setFilter, productName, money, dateLabel, timeLabel, setDialog, addMovement, suppliers, products, exportMovements }) {
  return <><PageTitle eyebrow="TRAÇABILITÉ" title="Mouvements" description="Le journal des entrées, ventes et ajustements de stock." actions={<><Button variant="secondary" icon="download" onClick={exportMovements}>Exporter</Button><Button variant="secondary" icon="swap" onClick={() => setDialog({ type: 'movement', mode: 'Sortie' })}>Nouvelle sortie</Button><Button icon="plus" onClick={() => setDialog({ type: 'movement', mode: 'Entrée' })}>Nouvelle entrée</Button></>} />
    <section className="panel data-panel"><div className="toolbar"><SearchBox query={query} setQuery={setQuery} placeholder="Produit, motif, fournisseur…" /><div className="toolbar-right"><select className="select-control" value={filter} onChange={(e) => setFilter(e.target.value)}><option>Tous</option><option>Entrée</option><option>Sortie</option></select><Button variant="secondary" icon="file" onClick={() => setDialog({ type: 'inventory' })}>Inventaire</Button></div></div><MovementTable movements={movements} productName={productName} money={money} dateLabel={dateLabel} timeLabel={timeLabel} /><div className="table-footer"><span>{movements.length} mouvement{movements.length === 1 ? '' : 's'}</span><span>Journal des opérations du stock</span></div></section><div className="note-banner"><Icon name="alert" /><span>Les mouvements déjà enregistrés constituent votre journal de stock. Les ajustements d'inventaire sont ajoutés au journal pour assurer leur traçabilité.</span></div>
  </>
}
function MovementTable({ movements, productName, money, dateLabel, timeLabel, compact = false }) { return movements.length ? <div className="table-scroll"><table><thead><tr><th>OPÉRATION</th><th>PRODUIT</th><th>QUANTITÉ</th><th>PRIX UNITAIRE</th><th>MONTANT</th><th>DATE & HEURE</th><th>UTILISATEUR</th></tr></thead><tbody>{movements.map((m) => <tr key={m.id}><td><span className={`movement-tag ${m.type === 'Entrée' ? 'entry' : 'exit'}`}><i />{m.reason}</span></td><td className="bold">{productName(m.productId)}</td><td><span className={`qty-label ${m.type === 'Entrée' ? 'positive' : 'negative'}`}>{m.type === 'Entrée' ? '+' : '−'}{m.quantity}</span></td><td>{money(m.unitPrice)}</td><td className="numeric bold">{money(m.quantity * m.unitPrice)}</td><td><span>{dateLabel(m.date)}</span><small className="subcell">{timeLabel(m.date)}</small></td><td><span className="user-inline"><i>AT</i>{m.user}</span></td></tr>)}</tbody></table></div> : <EmptyNotice title="Aucun mouvement" message="Les entrées et sorties apparaîtront ici." /> }

function ReportsPage({ activeProducts, movements, suppliers, money, productName, exportProducts, exportMovements, exportBackup, restoreBackup, dateRange, setDateRange }) {
  const sales = movements.filter((m) => m.reason === 'Vente')
  const purchases = movements.filter((m) => m.reason === 'Achat fournisseur')
  const revenue = sales.reduce((s, m) => s + m.quantity * m.unitPrice, 0)
  const expense = purchases.reduce((s, m) => s + m.quantity * m.unitPrice, 0)
  const profit = sales.reduce((s, m) => s + m.quantity * (m.unitPrice - (m.costAtTime || 0)), 0)
  return <><PageTitle eyebrow="ANALYSE & EXPORT" title="Rapports" description="Consultez vos indicateurs et téléchargez vos données." actions={<select className="select-control date-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}><option>7 jours</option><option>Ce mois</option><option>Cette année</option></select>} />
    <div className="stats-grid report-stats"><StatCard label="Chiffre d'affaires" value={money(revenue)} note="sur la période sélectionnée" icon="chart" tone="green" /><StatCard label="Achats enregistrés" value={money(expense)} note="sur la période sélectionnée" icon="box" tone="orange" /><StatCard label="Bénéfice brut estimé" value={money(profit)} note="ventes moins coût des articles" icon="swap" tone="violet" /><StatCard label="Valeur du stock actuel" value={money(activeProducts.reduce((s, p) => s + p.cost * p.stock, 0))} note={`${activeProducts.length} produits actifs`} icon="grid" tone="blue" /></div>
    <section className="panel report-section"><div className="panel-head"><div><h2>Exports disponibles</h2><p>Téléchargez un rapport pour l'ouvrir dans votre tableur.</p></div></div><div className="export-grid"><ExportCard icon="box" title="État du stock" detail="Produits, niveaux, coûts et valorisation" onClick={exportProducts} /><ExportCard icon="swap" title="Journal des mouvements" detail="Entrées, sorties, ventes et achats" onClick={exportMovements} /><ExportCard icon="chart" title="Résumé des ventes" detail="Indicateurs de vente au format CSV" onClick={() => exportCsv([['Date', 'Produit', 'Quantité', 'Prix unitaire', 'Chiffre d’affaires', 'Coût unitaire', 'Bénéfice estimé'], ...sales.map((m) => [new Date(m.date).toLocaleDateString('fr-FR'), productName(m.productId), m.quantity, m.unitPrice, m.quantity * m.unitPrice, m.costAtTime, m.quantity * (m.unitPrice - (m.costAtTime || 0))])], 'rapport-des-ventes.csv')} /><ExportCard icon="users" title="Achats par fournisseur" detail="Dépenses ventilées par fournisseur" onClick={() => exportCsv([['Fournisseur', 'Nombre d’achats', 'Total'], ...suppliers.map((s) => { const rows = purchases.filter((m) => m.supplier === s.name); return [s.name, rows.length, rows.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0)] })], 'achats-par-fournisseur.csv')} /></div></section>
    <section className="panel report-section backup-section"><div className="panel-head"><div><h2>Sauvegarde des données</h2><p>Créez une copie de vos données ou restaurez une sauvegarde précédente.</p></div></div><div className="backup-row"><div className="backup-icon"><Icon name="file" /></div><div><b>Sauvegarde complète</b><p>Produits, fournisseurs, mouvements et paramètres au format JSON.</p></div><Button variant="secondary" icon="download" onClick={exportBackup}>Télécharger</Button><label className="btn-secondary upload-button">Restaurer<input type="file" accept="application/json,.json" onChange={(e) => restoreBackup(e.target.files?.[0])} /></label></div></section>
  </>
}
function ExportCard({ icon, title, detail, onClick }) { return <button className="export-card" onClick={onClick}><span className="export-icon"><Icon name={icon} /></span><span><b>{title}</b><small>{detail}</small></span><Icon name="download" size={17} /></button> }
function exportCsv(rows, filename) { const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(';')).join('\r\n'); const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); URL.revokeObjectURL(link.href) }

function SuppliersPage({ suppliers, setSuppliers, movements, money, setToast, setDialog }) {
  const [query, setQuery] = useState('')
  const visible = suppliers.filter((s) => `${s.name} ${s.phone} ${s.email}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageTitle eyebrow="PARTENAIRES" title="Fournisseurs" description="Retrouvez vos contacts et l'historique de leurs achats." actions={<Button icon="plus" onClick={() => setDialog({ type: 'supplier' })}>Ajouter un fournisseur</Button>} /><section className="panel data-panel"><div className="toolbar"><SearchBox query={query} setQuery={setQuery} placeholder="Nom, téléphone, e-mail…" /><span className="item-count">{visible.length} fournisseur{visible.length === 1 ? '' : 's'}</span></div>{visible.length ? <div className="table-scroll"><table><thead><tr><th>FOURNISSEUR</th><th>TÉLÉPHONE</th><th>E-MAIL</th><th>ADRESSE</th><th>ACHATS ENREGISTRÉS</th><th>TOTAL DES ACHATS</th><th /></tr></thead><tbody>{visible.map((s, i) => { const buys = movements.filter((m) => m.supplier === s.name && m.reason === 'Achat fournisseur'); return <tr key={s.id}><td><div className="product-cell"><span className={`product-thumb thumb-${i % 5}`}>{s.name.slice(0, 1)}</span><b>{s.name}</b></div></td><td>{s.phone || '—'}</td><td>{s.email || '—'}</td><td>{s.address || '—'}</td><td>{buys.length}</td><td className="numeric bold">{money(buys.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0))}</td><td><button className="icon-button" aria-label="Supprimer fournisseur" onClick={() => { if (window.confirm(`Retirer ${s.name} de la liste ?`)) { setSuppliers((items) => items.filter((v) => v.id !== s.id)); setToast('Fournisseur retiré.') } }}><Icon name="more" /></button></td></tr> })}</tbody></table></div> : <EmptyNotice title="Aucun fournisseur" message="Ajoutez vos partenaires pour retrouver leur historique d'achat." />}<div className="table-footer"><span>Les achats sont associés au fournisseur au moment de l'entrée.</span></div></section></>
}

function UsersPage() { return <><PageTitle eyebrow="ACCÈS & ÉQUIPE" title="Utilisateurs" description="Gérez les accès des personnes qui utilisent votre boutique." actions={<Button icon="plus" onClick={() => alert('La création de comptes nécessite la configuration de Firebase Authentication.')}>Inviter un utilisateur</Button>} /><section className="panel users-intro"><div className="users-illustration"><Icon name="users" size={32} /></div><div><h2>Comptes utilisateurs Firebase</h2><p>La connexion sécurisée, les invitations et les permissions par rôle seront activées après le branchement à votre projet Firebase. L'application actuelle conserve les données sur cet appareil et n'authentifie pas les utilisateurs.</p><span className="status-chip"><i /> Configuration en attente</span></div></section><section className="panel data-panel"><div className="panel-head"><div><h2>Rôles prévus</h2><p>Profils d'accès définis dans le cahier des charges.</p></div></div><div className="role-list">{[['Administrateur', 'Accès complet aux paramètres, aux utilisateurs et aux rapports financiers.'], ['Gestionnaire', 'Gestion des produits, mouvements et inventaires.'], ['Vendeur', 'Enregistrement des ventes, sans accès aux coûts d’achat.'], ['Lecture seule', 'Consultation des stocks et rapports autorisés.']].map(([role, text]) => <div className="role-row" key={role}><span className="role-mark">{role.slice(0, 1)}</span><span><b>{role}</b><small>{text}</small></span><span className="role-future">À configurer</span></div>)}</div></section></> }

function SettingsPage({ company, setCompany, exportBackup, restoreBackup, setToast }) {
  const [form, setForm] = useState(company)
  useEffect(() => setForm(company), [company])
  return <><PageTitle eyebrow="CONFIGURATION" title="Paramètres" description="Personnalisez votre boutique et gérez vos sauvegardes." /><div className="settings-grid"><section className="panel settings-panel"><div className="panel-head"><div><h2>Informations de la boutique</h2><p>Ces informations sont affichées dans votre espace.</p></div></div><form onSubmit={(e) => { e.preventDefault(); setCompany(form); setToast('Informations enregistrées.') }} className="settings-form"><Field label="Nom de la boutique"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field><Field label="Téléphone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><Field label="Devise"><select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>FCFA</option><option>EUR</option><option>USD</option></select></Field><div className="form-actions"><Button type="submit">Enregistrer les modifications</Button></div></form></section><section className="panel settings-panel"><div className="panel-head"><div><h2>Données et sauvegarde</h2><p>Vos données sont actuellement enregistrées dans ce navigateur.</p></div></div><div className="storage-notice"><Icon name="alert" /><p>Effacer les données de navigation peut supprimer les informations stockées localement. Téléchargez régulièrement une sauvegarde JSON.</p></div><Button variant="secondary" icon="download" onClick={exportBackup}>Télécharger une sauvegarde</Button><label className="btn-secondary restore-label">Restaurer une sauvegarde JSON<input type="file" accept="application/json,.json" onChange={(e) => restoreBackup(e.target.files?.[0])} /></label></section></div><section className="panel settings-panel firebase-panel"><div><span className="firebase-badge">FIREBASE</span><h2>Synchronisation cloud</h2><p>Le projet Firebase n'est pas encore configuré. L'application peut être reliée à Authentication et Firestore après création du projet et ajout des clés de configuration dans les variables d'environnement.</p></div><span className="status-chip"><i /> Non configuré</span></section></>
}

function Field({ label, children, hint }) { return <label className="form-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label> }
function Modal({ title, onClose, children, wide = false }) { return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fermer"><Icon name="close" /></button></div>{children}</section></div> }
function ProductDialog({ product, products, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: '', sku: '', category: '', unit: 'pièce', cost: '', threshold: 5, description: '' })
  const [error, setError] = useState('')
  const submit = (e) => { e.preventDefault(); const duplicate = products.some((p) => p.sku.toLowerCase() === form.sku.trim().toLowerCase() && p.id !== form.id); if (duplicate) { setError('Cette référence est déjà utilisée.'); return } if (!form.name.trim() || !form.sku.trim()) { setError('Le nom et la référence sont obligatoires.'); return } onSave({ ...form, name: form.name.trim(), sku: form.sku.trim(), category: form.category || 'Sans catégorie' }) }
  return <Modal title={product ? 'Modifier le produit' : 'Ajouter un produit'} onClose={onClose}><form onSubmit={submit} className="dialog-form"><div className="form-grid"><Field label="Nom du produit"><input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. Riz parfumé" /></Field><Field label="Référence / SKU"><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Ex. AL-005" /></Field><Field label="Catégorie"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex. Épicerie" /></Field><Field label="Unité"><select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>{['pièce', 'kg', 'g', 'litre', 'carton', 'sac', 'bidon', 'boîte', 'bouteille', 'paquet'].map((u) => <option key={u}>{u}</option>)}</select></Field><Field label="Coût d'achat unitaire (FCFA)"><input type="number" min="0" step="1" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="0" /></Field><Field label="Seuil d'alerte"><input type="number" min="0" step="1" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} /></Field></div>{product && <p className="form-hint">Stock actuel : <b>{product.stock} {product.unit}</b>. Le stock est mis à jour par les mouvements.</p>}{error && <p className="form-error">{error}</p>}<div className="modal-actions"><Button variant="secondary" onClick={onClose} type="button">Annuler</Button><Button type="submit">{product ? 'Enregistrer' : 'Ajouter le produit'}</Button></div></form></Modal>
}
function MovementDialog({ mode, products, suppliers, onClose, onSave }) {
  const outgoing = mode === 'Sortie'
  const [form, setForm] = useState({ productId: '', type: mode, reason: outgoing ? 'Vente' : 'Achat fournisseur', quantity: 1, unitPrice: '', supplier: '', note: '' })
  const product = products.find((p) => p.id === form.productId)
  const reasons = outgoing ? ['Vente', 'Perte', 'Casse', 'Vol', 'Péremption', 'Consommation interne', 'Ajustement négatif', 'Transfert sortant'] : ['Achat fournisseur', 'Retour client', 'Ajustement positif', 'Transfert entrant']
  const submit = (e) => { e.preventDefault(); onSave({ ...form, type: outgoing ? 'Sortie' : 'Entrée', quantity: Number(form.quantity), unitPrice: Number(form.unitPrice) }) }
  return <Modal title={outgoing ? 'Nouvelle sortie de stock' : 'Nouvelle entrée de stock'} onClose={onClose}><form onSubmit={submit} className="dialog-form"><Field label="Produit"><select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value, unitPrice: e.target.value === form.productId ? form.unitPrice : '' })}><option value="">Choisir un produit…</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} · stock : {p.stock} {p.unit}</option>)}</select></Field><div className="form-grid"><Field label="Motif"><select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value, supplier: '' })}>{reasons.map((r) => <option key={r}>{r}</option>)}</select></Field><Field label="Quantité"><input type="number" required min="1" step="1" max={outgoing ? product?.stock : undefined} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Field>{!outgoing && form.reason === 'Achat fournisseur' && <Field label="Fournisseur"><select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}><option value="">Sélectionner…</option>{suppliers.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>}<Field label={outgoing ? 'Prix de vente unitaire (FCFA)' : 'Coût unitaire (FCFA)'}><input type="number" required min="0" step="1" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} placeholder="0" /></Field></div>{product && <div className="movement-preview"><span>Stock après opération</span><b>{Math.max(0, product.stock + (outgoing ? -Number(form.quantity || 0) : Number(form.quantity || 0)))} {product.unit}</b></div>}<Field label="Note (facultatif)"><textarea rows="2" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Référence du document, détail…" /></Field><div className="modal-actions"><Button variant="secondary" onClick={onClose} type="button">Annuler</Button><Button type="submit">Enregistrer le mouvement</Button></div></form></Modal>
}
function InventoryDialog({ products, onClose, onSave }) {
  const [counts, setCounts] = useState(() => Object.fromEntries(products.map((p) => [p.id, String(p.stock)])))
  const [step, setStep] = useState(0)
  const submit = () => { const differences = products.map((p) => ({ p, difference: Number(counts[p.id] ?? p.stock) - p.stock })).filter((x) => x.difference !== 0); if (!differences.length) { onClose(); return } setStep(1) }
  const validate = () => { const differences = products.map((p) => ({ p, difference: Number(counts[p.id] ?? p.stock) - p.stock })).filter((x) => x.difference !== 0); differences.forEach(({ p, difference }) => onSave({ productId: p.id, type: difference > 0 ? 'Entrée' : 'Sortie', reason: difference > 0 ? 'Ajustement positif' : 'Ajustement négatif', quantity: Math.abs(difference), unitPrice: p.cost, note: 'Ajustement après inventaire physique' })); onClose() }
  return <Modal title={step ? 'Confirmer les ajustements' : 'Inventaire physique'} onClose={onClose} wide><div className="inventory-intro">Saisissez la quantité réellement comptée pour chaque produit. Les écarts seront ajoutés au journal des mouvements.</div>{!step ? <><div className="inventory-list"><div className="inventory-head"><span>PRODUIT</span><span>STOCK THÉORIQUE</span><span>QUANTITÉ COMPTÉE</span><span>ÉCART</span></div>{products.map((p) => { const delta = Number(counts[p.id] ?? p.stock) - p.stock; return <div className="inventory-row" key={p.id}><span><b>{p.name}</b><small>{p.sku}</small></span><span>{p.stock} {p.unit}</span><span><input type="number" min="0" step="1" value={counts[p.id]} onChange={(e) => setCounts({ ...counts, [p.id]: e.target.value })} /></span><span className={delta ? delta > 0 ? 'positive' : 'negative' : 'muted'}>{delta > 0 ? `+${delta}` : delta || '—'}</span></div>})}</div><div className="modal-actions"><Button variant="secondary" onClick={onClose}>Annuler</Button><Button onClick={submit}>Vérifier les écarts <Icon name="arrow" size={16} /></Button></div></> : <><p className="inventory-confirm-copy">Les écarts seront enregistrés comme mouvements d'ajustement. Confirmer l'inventaire ?</p><div className="modal-actions"><Button variant="secondary" onClick={() => setStep(0)}>Retour</Button><Button onClick={validate}>Valider les ajustements</Button></div></>}</Modal>
}
function SupplierDialog({ onClose, onSave }) { const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' }); return <Modal title="Ajouter un fournisseur" onClose={onClose}><form className="dialog-form" onSubmit={(e) => { e.preventDefault(); onSave(form) }}><Field label="Nom du fournisseur"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></Field><Field label="Téléphone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><Field label="E-mail"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Adresse"><textarea rows="2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field><div className="modal-actions"><Button variant="secondary" type="button" onClick={onClose}>Annuler</Button><Button type="submit">Ajouter</Button></div></form></Modal> }

export default App
