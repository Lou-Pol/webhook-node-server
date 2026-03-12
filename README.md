# webhook-node-server
##Présentation
Ce projet est un mini serveur Node.js permettant de recevoir et analyser un webhook GitHub.

L’objectif est pédagogique : comprendre comment une plateforme comme GitHub peut envoyer 
automatiquement une requête HTTP lorsqu’un événement se produit dans un dépôt (par exemple 
un push).

Le serveur reçoit le payload JSON du webhook et affiche dans le terminal les informations 
principales du commit.

Ce type de mécanisme est très utilisé dans les architectures DevOps et CI/CD pour déclencher 
automatiquement des actions comme :

- lancer des tests
- démarrer une compilation
- déployer une application
- envoyer des notification

## Technologies utilisées
Node.js
Express.js
cURL pour les tests HTTP