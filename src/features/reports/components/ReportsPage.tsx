import type { ChangeEvent } from 'react'
import type { AppData, Movement, Product, Supplier } from '../../../shared/types/domain'
import { downloadCsv, printReport } from '../../../shared/services/exportService'
import { exportBackup, restoreBackup } from '../../../shared/services/localStorageService'
import { formatMoney } from '../../../shared/utils/format'
import { Button } from '../../../shared/components/ui/Button'
import { Icon } from '../../../shared/components/ui/Icon'

interface Props { data: AppData; onRestore: (data: AppData) => void; onError: (message: string) => void; onNotice: (message: string) => void }
export function ReportsPage({ data, onRestore, onError, onNotice }: Props) {
  const sales = data.movements.filter((item) => item.reason === 'Vente')
  const purchases = data.movements.filter((item) => item.reason === 'Achat fournisseur')
  const revenue = total(sales)
  const cost = sales.reduce((sum, item) => sum + item.quantity * item.costAtTime, 0)
  const profit = revenue - cost
  const value = data.products.filter((item) => !item.archived).reduce((sum, item) => sum + item.stock * item.cost, 0)
  const stockExport = () => exportStock(data.products)
  const movementExport = () => exportMovements(data.movements, data.products)
  const supplierExport = () => exportSuppliers(data.suppliers, purchases)
  const handlePrint = () => { printReport(); onNotice('Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».') }
  return <><div className="page-heading"><div><div className="eyebrow">ANALYSE & EXPORT</div><h1>Rapports</h1><p>Consultez les indicateurs et exportez vos données.</p></div><Button variant="secondary" icon="file" onClick={handlePrint}>Imprimer ou enregistrer en PDF</Button></div>
    <div className="stats-grid report-stats"><ReportMetric label="Chiffre d'affaires" value={formatMoney(revenue)} tone="green"/><ReportMetric label="Achats enregistrés" value={formatMoney(total(purchases))} tone="orange"/><ReportMetric label="Bénéfice brut estimé" value={formatMoney(profit)} tone="violet"/><ReportMetric label="Valeur du stock" value={formatMoney(value)} tone="blue"/></div>
    <section className="panel report-section"><div className="panel-head"><div><h2>Exports disponibles</h2><p>Les fichiers CSV s'ouvrent dans les tableurs courants.</p></div></div><div className="export-grid">
      <ExportCard icon="box" title="État du stock" detail="Produits, seuils, coûts et valorisation" onClick={() => exportWithNotice(stockExport, 'État du stock', onNotice)}/><ExportCard icon="swap" title="Journal des mouvements" detail="Opérations, quantités, dates et auteurs" onClick={() => exportWithNotice(movementExport, 'Journal des mouvements', onNotice)}/>
      <ExportCard icon="chart" title="Résumé des ventes" detail="Chiffre d'affaires et bénéfice estimé" onClick={() => exportWithNotice(() => exportSales(sales, data.products), 'Résumé des ventes', onNotice)}/><ExportCard icon="users" title="Achats par fournisseur" detail="Dépenses regroupées par fournisseur" onClick={() => exportWithNotice(supplierExport, 'Achats par fournisseur', onNotice)}/>
    </div></section><BackupPanel data={data} onRestore={onRestore} onError={onError} onNotice={onNotice}/></>
}

function exportWithNotice(action: () => void, reportName: string, onNotice: (message: string) => void): void {
  action()
  onNotice(`${reportName} exporté au format CSV.`)
}

function total(movements: Movement[]): number { return movements.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) }
function exportStock(products: Product[]): void { downloadCsv([['Produit', 'Référence', 'Catégorie', 'Unité', 'Stock', 'Seuil', 'Coût unitaire', 'Valeur'], ...products.map((item) => [item.name, item.sku, item.category, item.unit, item.stock, item.threshold, item.cost, item.stock * item.cost])], 'etat-du-stock.csv') }
function exportMovements(movements: Movement[], products: Product[]): void { downloadCsv([['Date', 'Produit', 'Type', 'Motif', 'Quantité', 'Prix unitaire', 'Montant', 'Utilisateur'], ...movements.map((item) => [item.date, products.find((product) => product.id === item.productId)?.name ?? 'Produit archivé', item.type, item.reason, item.quantity, item.unitPrice, item.quantity * item.unitPrice, item.user])], 'journal-des-mouvements.csv') }
function exportSales(sales: Movement[], products: Product[]): void { downloadCsv([['Date', 'Produit', 'Quantité', 'Prix unitaire', 'Chiffre d’affaires', 'Coût unitaire', 'Bénéfice estimé'], ...sales.map((item) => [item.date, products.find((product) => product.id === item.productId)?.name ?? 'Produit archivé', item.quantity, item.unitPrice, item.quantity * item.unitPrice, item.costAtTime, item.quantity * (item.unitPrice - item.costAtTime)])], 'rapport-des-ventes.csv') }
function exportSuppliers(suppliers: Supplier[], purchases: Movement[]): void { downloadCsv([['Fournisseur', 'Nombre d’achats', 'Total'], ...suppliers.map((supplier) => { const items = purchases.filter((item) => item.supplier === supplier.name); return [supplier.name, items.length, total(items)] })], 'achats-par-fournisseur.csv') }

function ReportMetric({ label, value, tone }: { label: string; value: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon name="chart"/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>Toutes les périodes enregistrées</small></div></div> }
function ExportCard({ icon, title, detail, onClick }: { icon: 'box' | 'swap' | 'chart' | 'users'; title: string; detail: string; onClick: () => void }) { return <button className="export-card" onClick={onClick}><span className="export-icon"><Icon name={icon}/></span><span><b>{title}</b><small>{detail}</small></span><Icon name="download" size={17}/></button> }

function BackupPanel({ data, onRestore, onError, onNotice }: { data: AppData; onRestore: (data: AppData) => void; onError: (message: string) => void; onNotice: (message: string) => void }) {
  const handleRestore = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = await restoreBackup(file)
    if (!result.ok) { onError(result.error.message); return }
    onRestore(result.value)
  }
  const handleDownload = () => { exportBackup(data); onNotice('Sauvegarde téléchargée.') }
  return <section className="panel report-section backup-section"><div className="panel-head"><div><h2>Sauvegarde des données</h2><p>Créez une copie ou restaurez une sauvegarde G-stock.</p></div></div><div className="backup-row"><div className="backup-icon"><Icon name="file"/></div><div><b>Sauvegarde complète</b><p>Produits, fournisseurs, mouvements et paramètres.</p></div>
    <Button variant="secondary" icon="download" onClick={handleDownload}>Télécharger</Button><label className="btn-secondary upload-button">Restaurer une copie<input type="file" accept="application/json,.json" onChange={handleRestore}/></label></div></section>
}
