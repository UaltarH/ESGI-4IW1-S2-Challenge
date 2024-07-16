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
- Adminer : [TODO](https://youtu.be/dQw4w9WgXcQ?si=-KctTd90xUR--kht)

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


## Auteurs

- [Mathieu PANNETRAT](https://github.com/mathieuPvss)
- [Nicola BAELE](https://github.com/NicolasBAELE)
- [Jan PARACHA](https://github.com/janparacha)
- [Gauthier LO](https://github.com/UaltarH)