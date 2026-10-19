# Cahier des charges – Application de gestion de stock

Version 1.1 – Décisions de cadrage intégrées – 19 octobre 2026

## 1. Présentation du projet

### 1.1 Contexte

Les petits commerces et PME gèrent souvent leur stock sur papier ou sur tableur, ce qui entraîne des erreurs de comptage, des ruptures imprévues, des pertes non détectées et une mauvaise visibilité sur la rentabilité réelle. L'application vise à centraliser le suivi du stock et à transformer les mouvements quotidiens en indicateurs financiers fiables.

### 1.2 Objectifs

- Suivre en temps réel les quantités en stock de chaque produit.
- Enregistrer et historiser tous les mouvements : entrées (achats, retours clients, ajustements positifs) et sorties (ventes, pertes, casse, ajustements négatifs).
- Calculer automatiquement les dépenses, le chiffre d'affaires et le bénéfice.
- Alerter l'utilisateur avant les ruptures de stock.
- Fournir des tableaux de bord et des rapports exportables.

### 1.3 Périmètre

**Inclus (V1) :** gestion des produits, des mouvements, des fournisseurs, des ventes, des alertes, des statistiques financières, des utilisateurs et rôles, exports.

**Exclus (V1) :** comptabilité complète, facturation légale détaillée, e-commerce, gestion de la paie, intégration bancaire. Ces éléments peuvent être envisagés en évolutions futures.

### 1.4 Utilisateurs cibles

| Profil | Besoins principaux |
|---|---|
| Propriétaire / gérant | Vision globale, statistiques, bénéfice, contrôle des utilisateurs |
| Gestionnaire de stock | Entrées, sorties, inventaires, alertes |
| Vendeur / caissier | Enregistrement rapide des ventes |
| Comptable (optionnel) | Consultation et export des rapports |

## 2. Besoins fonctionnels

### 2.1 Gestion des produits

- Créer, modifier, archiver un produit : nom, référence/SKU, code-barres, catégorie, unité (pièce, kg, litre, carton…), photo, description.
- Définir le prix d'achat et le seuil d'alerte (stock minimum) ; le prix de vente n'est pas figé sur la fiche, il est saisi à chaque vente.
- Gérer des catégories et sous-catégories.
- Option : gestion des variantes (taille, couleur) et des dates de péremption/lots.
- Import en masse via fichier CSV/Excel.

### 2.2 Gestion des entrées de stock

- Enregistrer une entrée : produit, quantité, prix d'achat unitaire, fournisseur, date, numéro de bon/facture, note.
- Types d'entrées : achat fournisseur, retour client, ajustement d'inventaire positif, transfert entrant.
- Mise à jour automatique de la quantité en stock et du coût d'achat.
- Possibilité de joindre une photo ou un document (facture, bon de livraison).
- Entrées multi-lignes (plusieurs produits dans un même bon).

### 2.3 Gestion des sorties de stock

- Enregistrer une sortie : produit, quantité, prix de vente unitaire, client (optionnel), date, motif.
- Types de sorties : vente, perte, casse, vol, péremption, consommation interne, ajustement négatif, transfert sortant.
- Blocage (ou avertissement) si la quantité demandée dépasse le stock disponible.
- Prix de vente saisi à chaque vente (remises incluses) ; pas de vente à crédit, chaque vente est réglée à l'enregistrement.
- Génération d'un reçu ou d'un bon de sortie (PDF).

### 2.4 Suivi des mouvements

- Journal complet et non modifiable des mouvements (qui, quoi, quand, quantité avant/après).
- Filtres : période, produit, catégorie, type de mouvement, utilisateur, fournisseur.
- Annulation d'un mouvement par contre-écriture (jamais par suppression silencieuse).
- Export du journal en PDF / Excel.

### 2.5 État des stocks

- Quantités en stock par produit en temps réel.
- Valorisation du stock au coût d'achat saisi à chaque entrée.
- Alertes : stock faible, rupture, produits proches de la péremption, produits sans mouvement depuis X jours.
- Inventaire physique : saisie des quantités comptées, calcul des écarts, validation et ajustement automatique.

### 2.6 Statistiques et tableaux de bord

**Indicateurs financiers :**

- **Dépenses** = total des achats (entrées avec coût d'achat).
- **Chiffre d'affaires** = somme des ventes (quantité × prix de vente, remises déduites).
- **Coût des marchandises vendues (CMV)** = quantité vendue × coût d'achat unitaire.
- **Bénéfice brut** = chiffre d'affaires − CMV.
- **Bénéfice net** = bénéfice brut − pertes (casse, vol, péremption).
- **Marge** (en % et en valeur) par produit, par catégorie et globale.

**Analyses :**

- Évolution par jour / semaine / mois / année, avec comparaison à la période précédente.
- Top produits (par volume, par chiffre d'affaires, par bénéfice) et produits les moins vendus.
- Rotation du stock et prévision de rupture.
- Répartition des dépenses par fournisseur et par catégorie.
- Valeur du stock immobilisé.
- Graphiques : courbes, histogrammes, camemberts.

### 2.7 Fournisseurs et clients

- Fiche fournisseur : coordonnées, historique des achats, montants dus.
- Fiche client (optionnelle) : historique des achats.

### 2.8 Utilisateurs et droits d'accès

- Authentification sécurisée (e-mail/téléphone + mot de passe).
- Rôles : administrateur, gestionnaire, vendeur, lecture seule.
- Droits par fonctionnalité (ex. le vendeur ne voit pas les prix d'achat ni le bénéfice).
- Traçabilité des actions par utilisateur.

### 2.9 Rapports et exports

- Rapports PDF et Excel : état du stock, mouvements, ventes, achats, bénéfices.
- Rapport de clôture journalière/mensuelle.
- Partage par e-mail ou WhatsApp.

### 2.10 Paramètres

- Informations de l'entreprise, devise (FCFA par défaut), format des dates.
- Unités, catégories, motifs de sortie personnalisables.
- Sauvegarde et restauration des données.
- Un seul point de vente en V1 (multi-boutiques envisageable plus tard).

## 3. Besoins non fonctionnels

- **Ergonomie :** interface simple, saisie rapide en peu de clics, utilisable par des personnes peu habituées au numérique.
- **Langue :** français ; architecture prête pour d'autres langues.
- **Mode hors ligne :** saisie possible sans connexion grâce à la persistance hors ligne de Firestore, avec synchronisation automatique au retour du réseau (reporté à une version ultérieure).
- **Performance :** affichage des écrans en moins de 2 secondes ; gestion de plusieurs dizaines de milliers de mouvements.
- **Sécurité :** chiffrement des échanges (HTTPS), contrôle d'accès par rôle, sauvegardes régulières.
- **Fiabilité :** aucune perte de données, cohérence des quantités garantie (transactions).
- **Compatibilité :** application web React responsive, utilisable sur ordinateur et sur mobile (PWA installable sur Android et iOS).
- **Évolutivité :** architecture modulaire permettant d'ajouter multi-dépôts, facturation, paiement mobile.

## 4. Règles de gestion

1. Une quantité en stock ne peut pas devenir négative sans autorisation explicite d'un administrateur.
2. Chaque mouvement est horodaté, associé à un utilisateur et ne peut être supprimé : seule une contre-écriture est possible.
3. Le coût d'achat unitaire de chaque produit est mis à jour à chaque entrée avec le prix d'achat saisi.
4. Le bénéfice d'une vente = (prix de vente saisi − coût d'achat en vigueur au moment de la vente) × quantité.
5. Une alerte est déclenchée lorsque la quantité passe sous le seuil minimum du produit.
6. Un produit ayant des mouvements ne peut qu'être archivé, pas supprimé.
7. Les montants sont stockés avec leur devise et arrondis selon les règles de la devise.

## 5. Modèle de données (aperçu Firestore)

| Collection | Contenu principal |
|---|---|
| produits | nom, référence, code-barres, catégorie, unité, coût d'achat courant, seuil d'alerte, quantité en stock, statut |
| categories | nom, catégorie parente |
| mouvements | produit, type (entrée/sortie), motif, quantité, prix unitaire saisi, coût unitaire au moment du mouvement, date, utilisateur, référence document |
| ventes | date, lignes (produit, quantité, prix de vente saisi), total, remise, utilisateur |
| fournisseurs | nom, contact, adresse |
| clients | nom, contact (optionnel) |
| inventaires | date, lignes (produit, quantité théorique, quantité comptée, écart), statut |
| utilisateurs | nom, rôle, statut |
| statistiques | cumuls par jour et par mois : dépenses, chiffre d'affaires, coût des marchandises vendues, bénéfice |

## 6. Architecture technique proposée

| Couche | Proposition |
|---|---|
| Interface web et mobile | React, application responsive installable sur mobile (PWA) |
| Authentification | Firebase Authentication |
| Base de données | Cloud Firestore |
| Contrôle des accès | Règles de sécurité Firestore par rôle |
| Fichiers (photos, documents) | Firebase Storage |
| Hébergement | Firebase Hosting |
| Statistiques | Cumuls par jour et par mois mis à jour côté application à chaque mouvement, sans Cloud Functions |
| Offre Firebase | Gratuite (Spark), sans plan payant |
| Mode hors ligne | Reporté à une version ultérieure (persistance hors ligne de Firestore) |

Firestore n'a pas de jointures : les quantités et les cumuls sont mis à jour par transaction à chaque mouvement. Les transactions exigent une connexion, donc le mode hors ligne demande des règles de synchronisation prudentes.

## 7. Interfaces principales (écrans)

1. Connexion.
2. Tableau de bord (stock, ventes du jour, bénéfice, alertes).
3. Liste des produits et fiche produit.
4. Nouvelle entrée / nouvelle sortie / nouvelle vente.
5. Journal des mouvements avec filtres.
6. État du stock et inventaire.
7. Statistiques et graphiques.
8. Fournisseurs et clients.
9. Rapports et exports.
10. Utilisateurs et paramètres.

## 8. Livrables

- Application web React responsive, utilisable sur mobile et sur ordinateur.
- Base de données documentée.
- Documentation utilisateur (guide PDF ou vidéos courtes).
- Documentation technique (installation, architecture, règles de sécurité Firestore).
- Jeu de données de démonstration.
- Formation des utilisateurs et support de démarrage.

## 9. Planning prévisionnel (indicatif)

| Phase | Contenu | Durée estimée |
|---|---|---|
| 1. Cadrage | Validation du cahier des charges, maquettes | 1 à 2 semaines |
| 2. Socle | Authentification Firebase, produits, catégories, collections Firestore | 2 semaines |
| 3. Mouvements | Entrées, sorties, ventes, journal, alertes | 3 semaines |
| 4. Statistiques | Tableaux de bord, rapports, exports | 2 à 3 semaines |
| 5. Inventaire | Inventaire physique, écarts et ajustements | 2 semaines |
| 6. Tests et recette | Tests, corrections, formation | 2 semaines |
| 7. Mise en production | Déploiement, suivi | 1 semaine |

Durée totale indicative : 13 à 15 semaines pour une V1, à ajuster selon l'équipe et le périmètre final.

## 10. Critères d'acceptation

- Toutes les entrées et sorties mettent à jour le stock instantanément et correctement.
- Le chiffre d'affaires, les dépenses et le bénéfice affichés correspondent aux calculs de référence sur un jeu de test.
- Les alertes de stock faible se déclenchent au bon seuil.
- Le mode hors ligne est hors périmètre de la V1 et sera traité dans une version ultérieure.
- Les droits par rôle sont respectés.
- Les exports PDF et Excel sont conformes aux données affichées.

## 11. Évolutions futures

- Multi-dépôts et transferts entre boutiques.
- Scan de code-barres avec la caméra.
- Paiement mobile (Orange Money, Wave, Moov Money).
- Facturation et devis.
- Prévisions de réapprovisionnement assistées par IA.
- Notifications WhatsApp / SMS (alertes, rapport quotidien).

## 12. Décisions de cadrage et prochaines étapes

| Sujet | Décision |
|---|---|
| Type de commerce | Boutique |
| Points de vente | Un seul |
| Prix de vente | Saisi au moment de la vente |
| Ventes à crédit | Non |
| Autres charges (loyer, salaires) | Non intégrées au bénéfice |
| Plateformes | Web et mobile, via une PWA React installable |
| Technologies | React et Firebase, offre gratuite uniquement |
| Cumuls statistiques | Calculés côté application, sans Cloud Functions |
| Mode hors ligne | Reporté à une version ultérieure |

**Prochaines étapes proposées :**

1. Maquettes des écrans principaux.
2. Structure détaillée des collections Firestore.
3. Règles de sécurité par rôle.
