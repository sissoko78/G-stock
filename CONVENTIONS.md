# Conventions de développement G-stock

## Organisation

Le code est organisé par fonctionnalité. Une fonctionnalité possède ses composants, hooks et services ; les composants partagés résident dans `src/shared`, et les styles communs dans `src/styles`.

```text
src/
├── features/[feature]/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/              # si les types ne sont pas partagés
│   └── index.ts            # API publique de la feature
├── shared/
│   ├── components/ui/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── styles/
└── App.tsx
```

Les imports internes d’une fonctionnalité restent dans cette fonctionnalité. Une autre fonctionnalité importe son API depuis `features/[feature]/index.ts`, pas ses fichiers internes.

## Nommage et TypeScript

- Composants et types : `PascalCase` (`ProductPage`, `MovementFormData`).
- Hooks et fonctions : `camelCase` (`useAppData`, `createMovement`).
- Constantes immuables : `UPPER_SNAKE_CASE` (`PAGE_SIZE`, `DEMO_DATA`).
- Booléens : préfixes `is`, `has` ou `can` (`isCreating`, `hasError`).
- Gestionnaires d’événement : préfixe `handle` (`handleSubmit`).
- Les interfaces sont ciblées et nommées par leur rôle ; les types de domaine sont dans `shared/types` lorsqu’ils sont utilisés par plusieurs features.
- `strict`, `noUnusedLocals` et `noUnusedParameters` sont activés. Les données externes passent par un schéma Zod avant d’entrer dans l’application. Ne pas introduire `any` ni contourner la validation avec une assertion de type.

## Responsabilités et taille

- Les composants décrivent l’interface, les hooks orchestrent l’état, les services portent les règles métier et les utils restent sans état.
- Garder les fonctions sous 20 lignes quand cela améliore leur lisibilité. Extraire les étapes nommées lorsque le découpage réduit le nombre de responsabilités, pas seulement pour réduire le compteur de lignes.
- Utiliser des retours anticipés pour les validations et erreurs. Éviter les niveaux d’imbrication qui cachent le chemin nominal.
- Faire dépendre les composants de fonctions typées et d’interfaces étroites, pas de détails de stockage.
- Commenter la raison d’une décision non évidente, pas la syntaxe visible dans le code.

## Erreurs et données

- Les erreurs métier spécialisent `AppError`. Les erreurs attendues retournent `Result<T, E>` plutôt que d’utiliser des exceptions pour le contrôle de flux.
- Les échecs inattendus sont consignés par `logger` avec contexte structuré ; aucun `console.log` et aucun `catch` vide.
- Les messages utilisateur indiquent le problème et l’action corrective en termes simples. Ne pas exposer de trace technique dans l’interface.
- Les mouvements sont ajoutés au journal ; ne pas supprimer ni modifier silencieusement une opération.
- Toute opération qui modifie une quantité doit passer par le service métier d’inventaire. Si un backend est ajouté, stock, mouvement et cumul financier devront être modifiés atomiquement dans une transaction.

## UX et accessibilité

- Un bouton nomme son résultat avec un verbe précis. Les actions destructrices demandent confirmation et précisent ce qui est conservé.
- Chaque opération donne un retour visible. Les erreurs sont annoncées, les champs ont un libellé et les actions clavier restent accessibles.
- Les listes longues sont paginées par 20 éléments. Les filtres doivent remettre la page à 1 après modification.
- Ajouter un état vide avec une prochaine action utile. Ne pas afficher de skeleton pour une lecture locale synchrone ; en ajouter un seulement lorsqu’un vrai chargement asynchrone est perceptible.
- Garder les tailles de cible tactile à au moins 36 px (42 px pour la navigation), avec un focus clavier visible.

## Vérifications locales

- `npm run typecheck` vérifie le contrat TypeScript strict.
- `npm run build` compile les ressources de production.
- `npm run lint` contrôle les règles ESLint configurées.
