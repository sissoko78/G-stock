# Guide de l’espace entreprise G-stock

Ce guide présente les écrans disponibles après la connexion à un compte d’entreprise et explique les commandes visibles dans chaque écran.

## Se connecter

Saisissez l’adresse e-mail et le mot de passe fournis par l’administrateur de G-stock, puis cliquez sur **Se connecter**. Le bouton œil du champ Mot de passe affiche ou masque temporairement la saisie. Il ne modifie pas le mot de passe.

## Repères dans l’application

### Navigation

La barre latérale permet d’ouvrir les espaces suivants :

| Élément | Action |
| --- | --- |
| Logo G-stock | Revient au tableau de bord. |
| Tableau de bord | Ouvre la vue d’ensemble de l’activité. |
| Produits | Ouvre le catalogue. Le nombre affiché signale les produits au seuil ou sous le seuil d’alerte. |
| Mouvements | Ouvre le journal et les commandes d’entrée, de sortie et d’inventaire. |
| Rapports | Ouvre les indicateurs, les exports et les sauvegardes. |
| Fournisseurs | Ouvre le répertoire des fournisseurs. |
| Utilisateurs | Affiche l’état de la gestion des membres et les rôles prévus. |
| Paramètres | Ouvre les informations de la boutique et les outils de sauvegarde. |
| Besoin d’aide ? | Ouvre le guide de démarrage rapide. |
| Bouton de déconnexion | Ferme la session du compte. |

Sur petit écran, le bouton de menu ouvre la barre latérale; le bouton de fermeture ou l’arrière-plan la referme. Dans les listes qui proposent une recherche, **Ctrl+K** (ou **⌘K** sur Mac) place le curseur dans le champ de recherche.

### Barre supérieure et messages

Le bouton d’alerte de la barre supérieure ouvre **Produits** afin de consulter les stocks faibles. Les messages de confirmation ou d’erreur disparaissent automatiquement; leur bouton **Fermer le message** les retire immédiatement.

## Tableau de bord

Le tableau de bord résume les mouvements du mois en cours et la valeur du stock actif.

| Élément ou bouton | Action ou information |
| --- | --- |
| Chiffre d’affaires | Total des ventes enregistrées ce mois-ci. |
| Bénéfice brut | Estimation calculée à partir des prix de vente et des coûts conservés dans les mouvements. |
| Dépenses d’achat | Total des achats fournisseurs enregistrés ce mois-ci. |
| Valeur du stock | Valeur des produits actifs selon leur quantité et leur coût d’achat. |
| Enregistrer une vente | Ouvre le formulaire d’une sortie avec le motif Vente. |
| Nouvelle entrée | Ouvre le formulaire d’une entrée de stock. |
| Consulter les produits | Ouvre le catalogue pour examiner les produits sous le seuil ou en rupture. |
| Voir le journal | Ouvre la liste des mouvements. |
| Carte « Vos données vous appartiennent » | Ouvre Rapports, où se trouvent les exports et sauvegardes. |

La section **Alertes de stock** liste les produits dont le stock est inférieur ou égal au seuil défini. La section **Mouvements récents** montre les dernières opérations; elle sert de résumé et ne comporte pas d’action par ligne.

## Produits

Le catalogue permet de rechercher, filtrer et gérer les produits actifs. Les lignes affichent notamment la catégorie, le coût d’achat, le stock, le seuil et la valeur en stock.

| Commande | Action |
| --- | --- |
| Champ de recherche | Filtre par nom, référence (SKU) ou catégorie. |
| Filtre Tous | Affiche tous les produits actifs. |
| Filtre Stock faible | Affiche les produits qui ont encore du stock, mais ont atteint leur seuil. |
| Filtre En rupture | Affiche les produits dont le stock est à zéro. |
| Exporter le stock | Télécharge un fichier CSV contenant les produits, quantités, seuils, coûts et valeurs. |
| Ajouter un produit / Créer un produit | Ouvre le formulaire de création. |
| Modifier | Ouvre le produit sélectionné pour modifier ses informations. |
| Bouton à trois points d’une ligne | Demande confirmation, puis archive le produit. Son historique de mouvements est conservé. |
| Précédent / Suivant | Parcourt les pages de résultats. |

Dans le formulaire, renseignez le nom, la référence, la catégorie, l’unité, le coût d’achat unitaire et le seuil d’alerte. **Créer le produit** ou **Enregistrer le produit** valide la saisie; **Annuler**, la croix ou un clic sur l’arrière-plan ferme la fenêtre sans enregistrer. Une référence déjà utilisée est refusée. Un nouveau produit commence avec un stock de zéro : enregistrez ensuite une entrée dans **Mouvements** pour ajouter sa quantité initiale.

## Mouvements et inventaire

Le journal répertorie les entrées, les sorties, les motifs, les quantités, montants, dates et utilisateurs.

| Commande | Action |
| --- | --- |
| Faire un inventaire | Ouvre le comptage physique de tous les produits actifs. |
| Enregistrer une sortie | Ouvre une sortie de stock. Une vente est proposée depuis le tableau de bord. |
| Enregistrer une entrée | Ouvre une entrée de stock. |
| Champ de recherche | Filtre par produit, motif ou fournisseur. |
| Filtre Tous / Entrée / Sortie | Filtre le journal selon le type d’opération. |
| Précédent / Suivant | Parcourt les pages du journal. |

### Enregistrer une entrée ou une sortie

Choisissez le produit, le motif, la quantité et le prix unitaire. Pour une entrée de type **Achat fournisseur**, sélectionnez aussi le fournisseur. Une note est facultative. Le formulaire affiche le montant calculé et le stock prévu après l’opération. **Enregistrer le mouvement** valide l’opération; **Annuler**, la croix ou l’arrière-plan ferme le formulaire. Une sortie ne peut pas dépasser le stock disponible.

### Faire un inventaire physique

1. Saisissez la quantité réellement comptée pour chaque produit. Les nombres négatifs et les valeurs non entières sont refusés.
2. **Vérifier les écarts** compare le comptage avec le stock connu. Si aucun écart n’existe, la fenêtre se ferme.
3. En présence d’écarts, **Revoir le comptage** permet de revenir aux quantités saisies; **Enregistrer les ajustements** crée les mouvements positifs ou négatifs correspondants.
4. **Annuler**, la croix ou l’arrière-plan ferme l’inventaire sans enregistrer les écarts.

## Rapports et sauvegardes

Les indicateurs de cette page couvrent les périodes enregistrées : chiffre d’affaires, achats, bénéfice brut estimé et valeur du stock.

| Commande | Action |
| --- | --- |
| Imprimer ou enregistrer en PDF | Ouvre la boîte d’impression du navigateur. Choisissez ensuite l’option d’enregistrement en PDF si elle est disponible. |
| État du stock | Télécharge le catalogue et sa valorisation au format CSV. |
| Journal des mouvements | Télécharge les opérations au format CSV. |
| Résumé des ventes | Télécharge les ventes et le bénéfice estimé au format CSV. |
| Achats par fournisseur | Télécharge les achats regroupés par fournisseur au format CSV. |
| Télécharger | Crée une sauvegarde JSON complète de l’espace. |
| Restaurer une copie | Sélectionne un fichier de sauvegarde JSON G-stock, le valide puis restaure ses données. |

La sauvegarde complète comprend les produits, fournisseurs, mouvements et paramètres de boutique. Conservez une copie à jour avant de changer d’appareil ou de navigateur.

## Fournisseurs

La liste affiche les coordonnées, le nombre d’achats enregistrés et leur total.

| Commande | Action |
| --- | --- |
| Champ de recherche | Filtre par nom, téléphone ou e-mail. |
| Ajouter un fournisseur / Créer un fournisseur | Ouvre le formulaire avec nom, téléphone, e-mail et adresse. |
| Bouton à trois points d’une ligne | Demande confirmation, puis retire le contact du répertoire. Les mouvements historiques restent conservés. |

Dans le formulaire, **Créer le fournisseur** enregistre les informations valides; **Annuler**, la croix ou l’arrière-plan ferme la fenêtre sans les enregistrer.

## Utilisateurs

Cette page indique que la gestion des collaborateurs n’est pas encore activée. Elle présente les rôles envisagés : Administrateur, Gestionnaire, Vendeur et Lecture seule.

| Commande | Action |
| --- | --- |
| Pourquoi cette étape ? | Explique que la gestion des membres sera activée après la synchronisation du stock avec Firestore. |

Les rôles présentés ici sont informatifs : l’ajout d’utilisateurs et l’application de permissions détaillées ne sont pas encore disponibles dans l’espace entreprise.

## Paramètres

| Commande ou champ | Action |
| --- | --- |
| Nom de la boutique | Modifie le nom affiché dans l’espace. |
| Téléphone | Enregistre le téléphone de la boutique. |
| Devise | Choisit FCFA, EUR ou USD pour l’affichage des montants. |
| Enregistrer les paramètres | Valide les informations de la boutique. |
| Télécharger une sauvegarde | Télécharge les données de l’espace en JSON. |
| Restaurer une sauvegarde JSON | Sélectionne et restaure un fichier de sauvegarde valide. |

Le panneau **Stockage local** signale que les données métier restent enregistrées dans le navigateur.

## Aide de démarrage

La carte **Besoin d’aide ?** ouvre une fenêtre qui rappelle le parcours conseillé : créer les produits, enregistrer les achats, saisir les ventes, puis sauvegarder les données.

| Commande | Action |
| --- | --- |
| Sauvegardes | Ferme l’aide et ouvre Rapports. |
| Voir les produits | Ferme l’aide et ouvre le catalogue. |
| Croix de fermeture | Ferme l’aide sans changer de page. |

## À retenir sur les données

La connexion est gérée par Firebase, mais le stock, les mouvements, les fournisseurs et les paramètres ne sont pas encore synchronisés avec Firestore. Ils restent dans le stockage local du navigateur et de l’appareil utilisé. Pour éviter une perte en changeant d’appareil ou de navigateur, téléchargez régulièrement une sauvegarde JSON et conservez-la en lieu sûr.
