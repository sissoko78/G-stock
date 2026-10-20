# G-stock

Application React responsive de gestion de stock destinée à une boutique ou une petite entreprise. L'interface est en français et la devise initiale est le FCFA.

## Démarrage

Pré-requis : Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev
```

Vite affiche l'adresse locale à ouvrir. `npm run build` prépare les fichiers statiques dans `dist/`, et `npm run preview` permet de les consulter localement.

## Fonctionnalités de la version actuelle

- Tableau de bord avec chiffre d'affaires, bénéfice brut, achats, valeur du stock, activité récente et alertes.
- Catalogue produit avec catégories, coût d'achat, unité, seuil d'alerte, recherche, filtres, archivage et export CSV.
- Entrées fournisseur et sorties (vente, perte, casse, vol, péremption, consommation et ajustements), avec blocage d'une sortie supérieure au stock.
- Journal des mouvements, suivi des achats par fournisseur, inventaire physique avec contre-ajustements et rapports CSV.
- Paramètres de boutique et sauvegarde/restauration JSON.
- Manifeste et service worker pour l'installation de l'interface comme application web.

Les données de cette version sont enregistrées dans `localStorage` du navigateur. Les données d'exemple sont créées au premier lancement. Utilisez **Paramètres** ou **Rapports → Sauvegarde complète** pour exporter une copie avant de changer de navigateur ou d'effacer ses données.

## Branchement Firebase prévu

La connexion Firebase n'est pas activée : le dépôt ne contient pas de projet Firebase ni ses paramètres d'environnement. L'écran Utilisateurs décrit les rôles prévus, mais cette version ne fournit pas d'authentification réelle, de synchronisation cloud, de stockage de pièces jointes, de fonctions de contre-écriture des mouvements, ni de reçus PDF. Les données locales de démonstration ne doivent pas être considérées comme une base multi-utilisateur ou un système d'audit inviolable.

Pour activer cette partie :

1. Créez un projet Firebase avec Authentication (e-mail/mot de passe), Cloud Firestore et Hosting. Le cahier des charges requiert l'offre gratuite Spark.
2. Ajoutez une application Web Firebase et copiez ses paramètres dans un fichier `.env.local` (ne commitez pas de clés privées).
3. Intégrez Firebase Web SDK, migrez les opérations de mouvement vers des transactions Firestore, puis ajoutez la gestion de session et des rôles côté serveur via les règles.
4. Déployez les règles Firestore et les règles Storage après revue et test avec l'émulateur Firebase. N'autorisez jamais le client à attribuer son propre rôle d'administrateur.

### Modèle de données recommandé

| Collection | Document / champs essentiels |
|---|---|
| `users/{uid}` | nom, e-mail, rôle, statut. Provisionnement de l'admin initial dans la console. |
| `products/{productId}` | nom, référence, catégorie, unité, coût courant, seuil, quantité, archivage. |
| `categories/{categoryId}` | nom, parentId nullable. |
| `suppliers/{supplierId}` | nom, téléphone, e-mail, adresse. |
| `movements/{movementId}` | produit, type, motif, quantité, prix saisi, coût snapshot, avant/après, horodatage, utilisateur, fournisseur, référence. |
| `sales/{saleId}` | lignes, total, remise, règlement, horodatage et utilisateur. |
| `inventories/{inventoryId}` | date, auteur, statut et lignes comptées avec quantités théoriques/physiques/écarts. |
| `statistics/{periodId}` | cumuls journaliers/mensuels recalculés dans la même transaction que chaque mouvement. |

En production, chaque mouvement doit être ajouté sans supprimer son historique et sa création, la mise à jour du stock, le snapshot du coût et le cumul statistique doivent être atomiques. Une correction se fait par contre-écriture explicite. Les rôles et permissions doivent également être appliqués dans les règles Firestore, pas seulement masqués dans l'interface.

## Exports et limites

Les exports tabulaires sont des CSV UTF-8 compatibles avec les tableurs. Le cahier des charges demande aussi des fichiers Excel et PDF, une gestion de lots/péremption, des variantes, l'import CSV/Excel, des pièces jointes, des reçus, des filtres avancés, les permissions par rôle et une base Firestore transactionnelle ; ces éléments restent à implémenter après la configuration Firebase et la validation de la V1.
