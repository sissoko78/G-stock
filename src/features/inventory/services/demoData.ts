import type { AppData } from '../../../shared/types/domain'

const daysAgo = (days: number): string => new Date(Date.now() - days * 86_400_000).toISOString()

export const DEMO_DATA: AppData = {
  products: [
    { id: 'p1', name: 'Riz parfumé', sku: 'AL-001', category: 'Épicerie', unit: 'sac', cost: 18_000, stock: 24, threshold: 8, archived: false },
    { id: 'p2', name: 'Huile végétale', sku: 'AL-002', category: 'Épicerie', unit: 'bidon', cost: 6_500, stock: 7, threshold: 10, archived: false },
    { id: 'p3', name: 'Savon doux', sku: 'HY-001', category: 'Hygiène', unit: 'pièce', cost: 500, stock: 42, threshold: 12, archived: false },
    { id: 'p4', name: 'Lait en poudre', sku: 'AL-003', category: 'Épicerie', unit: 'boîte', cost: 3_200, stock: 0, threshold: 6, archived: false },
    { id: 'p5', name: 'Eau minérale 1,5 L', sku: 'BO-001', category: 'Boissons', unit: 'bouteille', cost: 350, stock: 36, threshold: 12, archived: false },
    { id: 'p6', name: 'Sucre blanc', sku: 'AL-004', category: 'Épicerie', unit: 'kg', cost: 700, stock: 18, threshold: 8, archived: false },
  ],
  suppliers: [
    { id: 's1', name: 'Distribution Bamako', phone: '+223 70 12 34 56', email: 'contact@distribution.ml', address: 'Hamdallaye, Bamako' },
    { id: 's2', name: 'Agro Sahel', phone: '+223 76 45 67 89', email: 'ventes@agrosahel.ml', address: 'Sogoniko, Bamako' },
  ],
  movements: [
    { id: 'm1', productId: 'p1', type: 'Entrée', reason: 'Achat fournisseur', quantity: 30, unitPrice: 18_000, costAtTime: 18_000, date: daysAgo(5), supplier: 'Distribution Bamako', user: 'Aminata Traoré' },
    { id: 'm2', productId: 'p3', type: 'Sortie', reason: 'Vente', quantity: 8, unitPrice: 750, costAtTime: 500, date: daysAgo(2), supplier: '', user: 'Aminata Traoré' },
    { id: 'm3', productId: 'p2', type: 'Entrée', reason: 'Achat fournisseur', quantity: 12, unitPrice: 6_500, costAtTime: 6_500, date: daysAgo(1), supplier: 'Agro Sahel', user: 'Aminata Traoré' },
    { id: 'm4', productId: 'p5', type: 'Sortie', reason: 'Vente', quantity: 4, unitPrice: 500, costAtTime: 350, date: new Date().toISOString(), supplier: '', user: 'Aminata Traoré' },
  ],
  company: { name: 'Ma Boutique', phone: '+223 70 00 00 00', currency: 'FCFA' },
}
