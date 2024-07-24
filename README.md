# ESGI-4IW1-S2-Challenge
Challenge Semestriel 4IW1 S2 (NodeJS, MongoDB, VueJS, RGPD)

## Installation

### Prérequis

- Docker
- Docker-compose
- NodeJS
- NPM

### Lancement du projet
```shell
docker compose up -d
```
- Front : [Localhost](http://localhost:5173)
- Back : [Localhost](http://localhost:8000)
- Adminer : [Localhost](http://localhost:8080/)

Prod:
- Front : [Site]([http://localhost:5173](https://boxtobe.mapa-server.org/))
- Back : https://boxtobe-back.mapa-server.org/
- Adminer : https://boxtobe-adminer.mapa-server.org/

### Migration
- lancer les migrations
```
docker compose exec node npm run migrate-up
```
- supprimer les migrations
```
docker compose exec node npm run migrate-down-all
```
- supprimer la derniere migration
```
docker compose exec node npm run migrate-down-last
```

### Seeds
- lancer les seeds
```
docker compose exec node npm run seed
```
- supprimer les seeds
```
docker compose exec node npm run seed-down
```

### Features
#### Mathieu Pannetrat
- mise en place de la bdd (models)
- Mise en place des migrations et des seeds 
- Mise en place des collections mongo (appHistory, dashboardConfig, notifications, orders, products)
- Mise en place des hooks sequilize pour la deserialization
- MMise en place de la lib vue Shadcn
- Protection faille xss (dompurify)
- Envoi de mail (nodemailer, gmail)
- Dashboard admin front et back (gridstack.js + shadcn charts + mongo collection)
- Page liste des produits avec pagination filtre dynamique 
- Page produit 
- Page accueil 
- Composent dernier produit ajouter 
- Composant tableau crud 
- Mise en place de stripe 
- Mise en place des pages pour effectuer une commande 
- Mise en place de l’infra pour une mise en prod 
- Mise en place de la collection mongo history avec anonymiser le user connecté 
- Composant timeline pour une commande 
- Mise en place d’un système pour supprimer un panier après 15 mins avec  redis et bull 
- Système de suppression d’un user si il est pas confirmer au bout de 30 mins 
- Toutes la partie notification pour un user + alerte admin pour les stocks (front et back)(+ envoi mail)
- Génération de pdf pour une facture de façon dynamique 
- Page gestion des stocks front(v1) et back 
- Composant modalForm pour créer une modal avec un formulaire de facon dynamique en donnant un schema zod et des données pour pre-remplir le form.

#### Gauthier Lo
##### Backend
- Auth : login, logout, register, delete, password change, reset (en cours)
- template emails (tré tré bô)
- middleware checkRole()
- search bar full text
- panier

##### Frontend :
- CustomForm
- ConfirmModal
- Cookie banner
- search bar
- Panier
- des composant comme :
- les menus
- input-number
- tab (onglets)
- wrapper avec spinner
- style de custom table
- notifications
- Pages :
- profile
- auth
- errors
- thème du site (que Karl approuve)
- dark mode
- Pinia store : panier, user, notifications
- Vue router

#### Nicolas Baele
##### FRONTEND:
- searchbar
- modale creation user
- modale creation product
- modale edit user
- modale edit product
- pages:
- user/orders
- admin/users
- admin/stock
- dmin/orders
- admin/products

##### BACKEND:
- searchbar
- fake api la poste
- tests controller
- tests services
- middleware checkRole
- controllers:
- categories
- products: update, create, delete, deleteMultiples
- users: delete, deleteMultiples, get
- schema: dashboard, widget

#### Jan Paracha
##### Architecture
- Initialisation du projet
- Ajout et update du docker compose avec les différents services
- Mise en place de la pipeline CI/CD
- Mise en place d'une base de donnée de test en développement dans la pipeline
- Mise en place et connexion à Sequelize
- Mise en place et connexion à Mongo
- Configuration des variables d'environnement utiles aux différents service
- Mise en place de la structure de fichier dans la backend

##### Backend
- Mise en place de l'application express avec les premières routes
- Ajout de middleware : validation Zod, vérification de role
- Config Sequelize
- Ajout des models Users, Cart
- Ajout du controller User (getuser, register, login, modify user, replace user)
- Ajout des routes User (get,post,put,patch,delete))
- Register de l'utilsateur
- Login de l'utilsateur
- Envoi de mail pour vérifier l'uilisateur
- Ajout d'un schéma de vérification pour le login
- Nettoyage des routes
- Test sécurité User

##### Frontend
- Utilisation de composable pour créer les formulaires login
- Ajout page mention légale, CGV et politique de confidentialité
- Bannière cookie
- Utilisation de composable pour définir et appeler les routes du backend
- Ajout de notifications en fonction de la vérification d'un utilisateur et sa redirection

##### RGPD
- Recherche d'antériorité de la marque
- Rédaction des mentions légales
- Rédaction des CGV
- Rédaction de la politique de confidentialité
- Rapport juridique du projet BoxToBe

## Auteurs
- [Mathieu PANNETRAT](https://github.com/mathieuPvss)
- [Nicola BAELE](https://github.com/NicolasBAELE)
- [Jan PARACHA](https://github.com/janparacha)
- [Gauthier LO](https://github.com/UaltarH)
