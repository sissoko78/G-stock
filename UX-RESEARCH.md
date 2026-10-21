# Audit UX heuristique — G-stock

Audit qualitatif de l’interface du 21 octobre 2026, fondé sur les écrans et interactions du dépôt. Les scores mesurent la facilité estimée sur 5 (5 = parcours direct, explicite et sans blocage). Ce ne sont pas des résultats d’entretiens ou de tests avec des utilisateurs.

## Principes vérifiés et changements

| Principe | Observation | Amélioration présente |
|---|---|---|
| Hick | Sept destinations pourraient former une longue liste. | Navigation répartie en deux groupes (« Principal », « Gestion ») et libellés courts. Le nombre de filtres produits est limité à trois. |
| Fitts | Les anciennes actions de ligne étaient petites sur téléphone. | Cibles de boutons et de navigation agrandies, menu mobile avec fermeture distincte, commandes de pagination accessibles. |
| Jakob | Les utilisateurs attendent que le logo ramène à l’accueil. | Le logo ouvre le tableau de bord ; les liens ressemblent à des commandes de navigation familières ; `Ctrl/⌘ K` donne accès à la recherche. |
| Miller | Une page trop dense augmente le temps de recherche. | Les données sont groupées en cartes, alertes limitées à six sur l’accueil, filtres séparés du tableau et listes de 20 lignes par page. |
| Tesler | Les seuils, quantités et doublons demandent des règles métier. | Zod valide les formulaires, les erreurs précisent quoi corriger et les ventes qui dépasseraient le stock sont refusées avec le disponible indiqué. |
| Aversion à la perte | Une restauration ou suppression peut surprendre. | Les sauvegardes sont vérifiées avant remplacement, l’archivage demande confirmation et l’historique produit est conservé. |
| Feedback | Les sauvegardes locales et actions pouvaient échouer silencieusement. | Toasts succès/erreur, région `aria-live`, messages automatiques après action et consigne explicite lorsque le stockage manque d’espace. |
| Empty states | Une liste vide peut laisser l’utilisateur sans prochaine étape. | Les pages produit, mouvement et fournisseur proposent une action de création depuis l’état vide. |

## Parcours critiques

| Parcours | Clics estimés | Facilité | Frictions restantes |
|---|---:|---:|---|
| Inscription et première connexion | Indisponible | 1/5 | L’authentification Firebase n’existe pas dans le dépôt ; l’application démarre en mode local de démonstration. Il faut configurer le projet, les règles et l’admin avant d’ouvrir ce parcours. |
| Enregistrer une vente depuis le tableau de bord | 2 clics de commande + saisie | 4/5 | Un clic ouvre la sortie, un autre enregistre après le choix du produit, de la quantité et du prix. La vente groupée avec plusieurs lignes et le reçu PDF restent à réaliser. |
| Modifier les paramètres de boutique | 2 clics + saisie | 4/5 | Ouvrir Paramètres, modifier les champs puis enregistrer. La sauvegarde reste liée au navigateur actuel. |
| Trouver de l’aide | 1 clic | 4/5 | Le guide court mène vers les produits ou les sauvegardes. Une aide contextuelle détaillée et le support de démarrage restent à ajouter. |
| Se déconnecter | Indisponible | 1/5 | Aucun compte n’est authentifié : aucun faux bouton de déconnexion n’est affiché. Ajouter cette action avec Firebase Authentication. |

## Priorités UX suivantes

1. Configurer Firebase Authentication avant de proposer inscription, invitation ou déconnexion.
2. Ajouter un formulaire de vente multi-produit, prix initialisé au coût courant, total visible et reçu imprimable.
3. Tester les libellés, tailles tactiles et parcours sur téléphone avec vendeurs et gestionnaires de stock.
4. Ajouter une alerte préventive lors de la sortie d’un article presque épuisé, avant confirmation de l’opération.
5. Charger les pages de rapports à la demande lorsque leur poids augmente ; l’interface actuelle et ses données sont petites et locales, donc les skeletons n’amélioreraient pas le temps perçu.

La preuve sociale et la récompense variable ne conviennent pas à une tâche de caisse ou d’inventaire : les notifications de succès restent sobres et prévisibles. Une progression gamifiée risquerait de détourner l’attention des quantités et des montants.
