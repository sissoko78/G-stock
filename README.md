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

### Préparer Firebase Web

1. Dans [Firebase Console](https://console.firebase.google.com/), créez un projet, puis ajoutez une application Web depuis la page d’accueil du projet (icône `</>`). Le surnom est libre.
2. Ouvrez **Paramètres du projet > Général > Vos applications > application Web > Configuration** et copiez les valeurs de l’objet `firebaseConfig`.
3. Copiez `.env.example` vers `.env.local`, puis collez les valeurs correspondantes après `=`. Gardez les noms `VITE_FIREBASE_*` tels quels. Vite expose au navigateur toute variable préfixée `VITE_` : n’y mettez jamais de clé de compte de service, mot de passe, ou secret serveur.
4. À la racine du dépôt, installez le SDK puis relancez Vite :

   ```sh
   npm install firebase
   npm run dev
   ```

   Le module `src/shared/services/firebase.ts` initialise l’application, Authentication et Firestore lorsque la configuration est complète. Sans `.env.local`, ces exports valent `null` et l’application locale continue de fonctionner.
5. Dans la console, activez les produits nécessaires sous **Authentication > Commencer** et **Firestore Database > Créer une base de données**. Choisissez la région adaptée aux utilisateurs. Avant toute donnée réelle, définissez des règles Firestore qui imposent l’authentification et les droits par rôle ; ne laissez pas les règles de test ouvertes.

La configuration Web (dont `apiKey`) identifie le projet et est destinée au client ; elle ne protège pas les données. La sécurité vient des règles Firestore et des contrôles d’accès. La configuration est ignorée par Git via `.env*`, à l’exception du modèle `.env.example`. La configuration Firebase seule ne migre pas encore les données locales vers le cloud : le service actuel reste `localStorage` jusqu’à l’implémentation de la synchronisation et des règles métier en transactions. Consultez le [guide officiel d’installation Firebase Web](https://firebase.google.com/docs/web/setup) et la [documentation sur les clés API Firebase](https://firebase.google.com/docs/projects/api-keys).

Pour une mise en production multi-utilisateur, provisionnez l’administrateur et remplacez le service local par des transactions Firestore. Les règles serveur doivent vérifier le rôle et protéger le stock, les mouvements et les cumuls statistiques dans une transaction. Ne faites jamais confiance à un rôle transmis par le navigateur.

Le modèle de collections et la suite des étapes de configuration restent dans le cahier des charges de `public/cahier-des-charges-gestion-stock.md`. L’offre gratuite Spark doit être vérifiée pour les services Firebase choisis avant déploiement.
