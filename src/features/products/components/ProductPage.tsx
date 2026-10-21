import { useMemo, useState } from 'react'
import type { Product } from '../../../shared/types/domain'
import type { ProductFormData } from '../../../shared/services/appDataSchema'
import { formatMoney } from '../../../shared/utils/format'
import { Button } from '../../../shared/components/ui/Button'
import { Icon } from '../../../shared/components/ui/Icon'
import { SearchBox } from '../../../shared/components/ui/SearchBox'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { ProductFormDialog } from './ProductFormDialog'
import { LIST_PAGE_SIZE } from '../../../shared/utils/constants'

interface Props { products: Product[]; onSave: (input: ProductFormData) => void; onArchive: (product: Product) => void; onExport: () => void }
type ProductFilter = 'Tous' | 'Stock faible' | 'En rupture'

export function ProductPage({ products, onSave, onArchive, onExport }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ProductFilter>('Tous')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const visible = useMemo(() => filterProducts(products, search, filter), [products, search, filter])
  const pageCount = Math.ceil(visible.length / LIST_PAGE_SIZE)
  const pageProducts = visible.slice((page - 1) * LIST_PAGE_SIZE, page * LIST_PAGE_SIZE)
  const handleSearch = (value: string) => { setSearch(value); setPage(1) }
  const closeDialog = () => { setEditing(null); setIsCreating(false) }
  const saveProduct = (input: ProductFormData) => { onSave(input); closeDialog() }
  return <><PageTitle onCreate={() => setIsCreating(true)} onExport={onExport}/><section className="panel data-panel">
    <div className="toolbar"><SearchBox value={search} onChange={handleSearch} placeholder="Nom, référence, catégorie…" />
      <div className="toolbar-right"><select className="select-control" value={filter} onChange={(event) => { setFilter(event.target.value as ProductFilter); setPage(1) }}><option>Tous</option><option>Stock faible</option><option>En rupture</option></select><span className="item-count">{visible.length} produit(s)</span></div>
    </div>{pageProducts.length ? <ProductTable products={pageProducts} onEdit={setEditing} onArchive={onArchive} /> : <EmptyProducts onCreate={() => setIsCreating(true)} />}
    <div className="table-footer"><span>{visible.length} produit(s) trouvé(s)</span><span>Valeur totale : <b>{formatMoney(visible.reduce((sum, item) => sum + item.stock * item.cost, 0))}</b></span></div>
    <Pagination page={page} pageCount={pageCount} onChange={setPage} />
  </section>{(editing || isCreating) && <ProductFormDialog product={editing} products={products} onClose={closeDialog} onSave={saveProduct} />}</>
}

function filterProducts(products: Product[], search: string, filter: ProductFilter): Product[] {
  const term = search.trim().toLocaleLowerCase('fr')
  return products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku} ${product.category}`.toLocaleLowerCase('fr').includes(term)
    const matchesFilter = filter === 'Tous' || (filter === 'En rupture' ? product.stock === 0 : product.stock > 0 && product.stock <= product.threshold)
    return matchesSearch && matchesFilter
  })
}

function PageTitle({ onCreate, onExport }: { onCreate: () => void; onExport: () => void }) {
  return <div className="page-heading"><div><div className="eyebrow">CATALOGUE</div><h1>Produits</h1><p>Gérez votre catalogue et les niveaux de stock.</p></div>
    <div className="heading-actions"><Button variant="secondary" icon="download" onClick={onExport}>Exporter le stock</Button><Button icon="plus" onClick={onCreate}>Ajouter un produit</Button></div></div>
}

function EmptyProducts({ onCreate }: { onCreate: () => void }) {
  return <div className="empty-notice"><span><Icon name="box" size={22} /></span><b>Aucun produit à afficher</b><p>Essayez un autre filtre ou ajoutez un produit au catalogue.</p><Button onClick={onCreate}>Créer un produit</Button></div>
}

function ProductTable({ products, onEdit, onArchive }: { products: Product[]; onEdit: (product: Product) => void; onArchive: (product: Product) => void }) {
  return <div className="table-scroll"><table><thead><tr><th>PRODUIT</th><th>CATÉGORIE</th><th>COÛT D'ACHAT</th><th>STOCK DISPONIBLE</th><th>SEUIL</th><th>VALEUR DU STOCK</th><th /></tr></thead>
    <tbody>{products.map((product, index) => <ProductRow key={product.id} product={product} index={index} onEdit={onEdit} onArchive={onArchive} />)}</tbody></table></div>
}

function ProductRow({ product, index, onEdit, onArchive }: { product: Product; index: number; onEdit: (product: Product) => void; onArchive: (product: Product) => void }) {
  const isLow = product.stock <= product.threshold
  const handleArchive = () => { if (window.confirm(`Archiver « ${product.name} » ? Son historique sera conservé.`)) onArchive(product) }
  return <tr><td><div className="product-cell"><span className={`product-thumb thumb-${index % 5}`}>{product.name.slice(0, 1)}</span><span><b>{product.name}</b><small>{product.sku}</small></span></div></td>
    <td><span className="category-label">{product.category}</span></td><td>{formatMoney(product.cost)}</td>
    <td><div className="stock-cell"><b className={isLow ? 'low-value' : ''}>{product.stock}</b><small>{product.unit}</small>{isLow && <span className={`mini-status ${product.stock === 0 ? 'out' : ''}`}>{product.stock ? 'Stock faible' : 'Rupture'}</span>}</div></td>
    <td>{product.threshold} <span className="muted">{product.unit}</span></td><td className="numeric bold">{formatMoney(product.stock * product.cost)}</td>
    <td><div className="row-actions"><button onClick={() => onEdit(product)}>Modifier</button><button aria-label={`Archiver ${product.name}`} onClick={handleArchive}><Icon name="more" /></button></div></td></tr>
}
