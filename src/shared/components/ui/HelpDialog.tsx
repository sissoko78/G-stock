import { Button } from './Button'
import { Modal } from './Modal'

export function HelpDialog({ onClose, onNavigate }: { onClose: () => void; onNavigate: (page: 'products' | 'movements' | 'reports') => void }) {
  const openPage = (page: 'products' | 'movements' | 'reports') => { onClose(); onNavigate(page) }
  return <Modal title="Guide de démarrage" onClose={onClose}>
    <p className="help-copy">Commencez par ajouter vos produits, puis enregistrez chaque achat et chaque vente pour garder le stock à jour.</p>
    <ol className="help-list"><li>Créez votre catalogue et vos seuils d’alerte.</li><li>Ajoutez un achat depuis la page Mouvements.</li><li>Saisissez la vente : le stock disponible est vérifié avant l’enregistrement.</li><li>Téléchargez une sauvegarde depuis Rapports.</li></ol>
    <div className="help-actions"><Button variant="secondary" onClick={() => openPage('reports')}>Sauvegardes</Button><Button onClick={() => openPage('products')}>Voir les produits</Button></div>
  </Modal>
}
