# G-stock

Application React de gestion de stock, conçue pour une petite boutique. L'interface est en français et la devise initiale est le FCFA.

## Démarrage local

Pré-requis : Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev
```

Vite affiche l’adresse à ouvrir dans le navigateur. Les scripts de contrôle sont `npm run typecheck`, `npm run lint` et `npm run build`. `npm run preview` sert le résultat compilé depuis `dist/`.

## Organisation du code

Le projet utilise React, TypeScript strict, Zod pour valider les entrées et une architecture par fonctionnalité. Les règles d’équipe sont détaillées dans [CONVENTIONS.md](CONVENTIONS.md) et l’évaluation UX dans [UX-RESEARCH.md](UX-RESEARCH.md).

```text
src/
├── features/       # tableaux de bord, inventaire, produits, mouvements, rapports…
├── shared/         # composants UI, hooks, services, types et utilitaires communs
├── styles/         # styles de base, application et adaptations UX
├── App.tsx
└── main.tsx
```

## Fonctions présentes

- Tableau de bord avec alertes de stock, ventes, achats, bénéfice brut et valeur immobilisée.
- Catalogue avec validation des références, recherche, filtres, seuils, archivage et export CSV.
- Entrées, ventes et sorties avec vérification du stock disponible.
- Inventaire physique avec confirmation et génération de mouvements d’ajustement.
- Journal horodaté, fournisseurs, rapports CSV, impression navigateur vers PDF et sauvegarde/restauration JSON validée.
- Interface responsive, commandes clavier de recherche, messages de retour accessibles et pagination de 20 lignes.
- Manifeste installable ; la mise en cache du shell ne fournit pas une synchronisation hors ligne des données.

Les données sont enregistrées dans le `localStorage` du navigateur. Les anciennes données de démonstration réparties dans plusieurs clés sont migrées vers le nouveau format et validées avant utilisation. Téléchargez une sauvegarde avant de changer d’appareil ou de navigateur.

## Limites et branchement Firebase

Firebase n’est pas configuré dans le dépôt. Les comptes, rôles sécurisés, synchronisation cloud, pièces jointes, ventes multi-lignes et reçus PDF ne sont donc pas actifs. Les exports CSV s’ouvrent dans un tableur ; l’impression PDF utilise la boîte de dialogue du navigateur.

Pour une mise en production multi-utilisateur, créez le projet Firebase (Authentication, Firestore, Storage et Hosting), provisionnez l’administrateur, ajoutez la configuration à l’environnement et remplacez le service local par des transactions Firestore. Les règles serveur doivent vérifier le rôle et protéger le stock, les mouvements et les cumuls statistiques dans une transaction. Ne faites jamais confiance à un rôle transmis par le navigateur.

Le modèle de collections et la suite des étapes de configuration restent dans le cahier des charges de `public/cahier-des-charges-gestion-stock.md`. L’offre gratuite Spark doit être vérifiée pour les services Firebase choisis avant déploiement.
