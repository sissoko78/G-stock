import { Icon } from '../../../shared/components/ui/Icon'

const roles = [
  { name: 'Administrateur', detail: 'Gère la boutique, les utilisateurs et les rapports financiers.' },
  { name: 'Gestionnaire', detail: 'Gère les produits, mouvements et inventaires.' },
  { name: 'Vendeur', detail: 'Enregistre les ventes. Les coûts d’achat restent masqués.' },
  { name: 'Lecture seule', detail: 'Consulte les stocks et les rapports autorisés.' },
]

export function UsersPage({ onInfo }: { onInfo: (message: string) => void }) {
  return <><div className="page-heading"><div><div className="eyebrow">ACCÈS & ÉQUIPE</div><h1>Utilisateurs</h1><p>Les collaborateurs seront gérés par le responsable de l’entreprise.</p></div></div>
    <section className="panel users-intro"><div className="users-illustration"><Icon name="users" size={32}/></div><div><h2>Gestion d’équipe en préparation</h2><p>La connexion d’entreprise est active. L’ajout de collaborateurs et les permissions détaillées seront ouverts après le passage du stock dans Firestore.</p><span className="status-chip"><i/> Responsable d’entreprise</span></div></section>
    <section className="panel data-panel"><div className="panel-head"><div><h2>Rôles prévus</h2><p>Les rôles définitifs seront appliqués dans les règles de sécurité côté serveur.</p></div></div><div className="role-list">{roles.map((role) => <div className="role-row" key={role.name}><span className="role-mark">{role.name.slice(0, 1)}</span><span><b>{role.name}</b><small>{role.detail}</small></span><span className="role-future">À venir</span></div>)}</div><button className="btn-secondary" onClick={() => onInfo('La gestion des membres sera activée après la synchronisation du stock avec Firestore.')}>Pourquoi cette étape ?</button></section></>
}
