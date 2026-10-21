import { Button } from '../../../shared/components/ui/Button'
import { Icon } from '../../../shared/components/ui/Icon'

const roles = [
  { name: 'Administrateur', detail: 'Gère la boutique, les utilisateurs et les rapports financiers.' },
  { name: 'Gestionnaire', detail: 'Gère les produits, mouvements et inventaires.' },
  { name: 'Vendeur', detail: 'Enregistre les ventes. Les coûts d’achat restent masqués.' },
  { name: 'Lecture seule', detail: 'Consulte les stocks et les rapports autorisés.' },
]

export function UsersPage({ onInfo }: { onInfo: (message: string) => void }) {
  return <><div className="page-heading"><div><div className="eyebrow">ACCÈS & ÉQUIPE</div><h1>Utilisateurs</h1><p>Préparez les rôles d'accès de votre équipe.</p></div><Button icon="plus" onClick={() => onInfo('Configurez Firebase Authentication pour activer les invitations.')}>Inviter un utilisateur</Button></div>
    <section className="panel users-intro"><div className="users-illustration"><Icon name="users" size={32}/></div><div><h2>Authentification à configurer</h2><p>Les données restent locales sur cet appareil. Les comptes, invitations et permissions sécurisées nécessitent de relier un projet Firebase.</p><span className="status-chip"><i/> Configuration en attente</span></div></section>
    <section className="panel data-panel"><div className="panel-head"><div><h2>Rôles prévus</h2><p>Profils d'accès définis dans le cahier des charges.</p></div></div><div className="role-list">{roles.map((role) => <div className="role-row" key={role.name}><span className="role-mark">{role.name.slice(0, 1)}</span><span><b>{role.name}</b><small>{role.detail}</small></span><span className="role-future">À configurer</span></div>)}</div></section></>
}
