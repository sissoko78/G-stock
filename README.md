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

## SaaS multi-entreprises

Le guide d’utilisation de l’espace entreprise se trouve dans [docs/guide-espace-entreprise.md](docs/guide-espace-entreprise.md).

L’application commence à passer d’un mode démonstration à un SaaS fermé : Firebase Authentication gère la connexion, une console réservée au super administrateur crée l’entreprise et son premier responsable, et `api/admin/companies.ts` exécute cette opération sur Vercel avec Firebase Admin. Les claims `superAdmin` et `tenantId` sont attribués côté serveur. `firestore.rules` refuse les accès entre entreprises ; le super administrateur ne peut lire que les métadonnées des entreprises.

**Le stock est encore enregistré dans le navigateur**, avec une clé locale distincte par entreprise. Il n’est pas encore synchronisé entre appareils ni entre les membres d’une entreprise. La gestion des rôles internes, les écritures de stock Firestore transactionnelles et la migration des sauvegardes locales restent à construire avant d’utiliser le SaaS pour des stocks réels.

### Préparer les comptes et le déploiement

1. Dans Firebase Console, activez **Authentication > E-mail/Mot de passe** et créez la base sous **Firestore Database**. Ne sélectionnez pas les règles de test pour des données réelles.
2. Dans **Paramètres du projet > Comptes de service**, créez une clé de compte de service réservée à l’application. Conservez le fichier JSON hors du dépôt ; il donne des droits privilégiés.
3. Dans Vercel, ajoutez les six variables `VITE_FIREBASE_*` de `.env.local` aux environnements **Production**, **Preview** et **Development**. Ajoutez aussi `FIREBASE_SERVICE_ACCOUNT_JSON` comme variable secrète, avec le JSON complet du compte de service. Cette dernière variable ne doit jamais commencer par `VITE_` ni être placée dans le code navigateur.
4. Dans **Authentication > Utilisateurs**, créez le compte qui servira de super administrateur. Configurez les modèles e-mail et ajoutez le domaine de production Vercel aux domaines autorisés.
5. Depuis une machine de confiance, définissez `GOOGLE_APPLICATION_CREDENTIALS` sur le chemin du fichier JSON téléchargé et `FIREBASE_PROJECT_ID` sur l’identifiant du projet, puis attribuez le claim super administrateur :

   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\chemin-sécurisé\compte-service.json'
   $env:FIREBASE_PROJECT_ID = 'identifiant-du-projet'
   npm run bootstrap:super-admin -- admin@example.com
   ```

6. Après avoir créé Firestore, déployez les règles avec Firebase CLI : `firebase deploy --only firestore:rules --project identifiant-du-projet`. Les futures modifications poussées sur le dépôt déclencheront ensuite les déploiements Vercel automatiques.

La configuration Web Firebase, y compris `apiKey`, est prévue pour le navigateur ; elle ne protège pas les données. La sécurité repose sur les règles Firestore, les claims définis par le serveur et la clé Admin gardée secrète. Consultez le [guide Firebase Web](https://firebase.google.com/docs/web/setup), les [règles Firestore](https://firebase.google.com/docs/firestore/security/rules-conditions) et la [référence Vercel Functions](https://vercel.com/docs/functions/runtimes/node-js).
