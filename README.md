![Logo](https://i.ibb.co/WKRkbzC/MEDISales-white-BGv2.png)



# Introduction

🇬🇧
The purpose of MEDISales is to offer a simplified management interface for the medical representatives of a laboratory. It allows them to consult the catalog of products sold by the laboratory, create contracts and subsequently manage their life cycle, but also consult various sales statistics accompanied by a weekly objective, all based on a team system to allow personalized management.

🇫🇷 
L'objectif de MEDISales est de proposer une interface de gestion simplifiée pour les visiteurs médicaux d'un laboratoire. Elle leur permet ainsi de consulter le catalogue des produits vendus par le laboratoire, de créer des contrats et par la suite gérer leur cycle de vie mais aussi de consulter des statistiques de ventes diverses accompagnées d'un objectif hebdomadaire, le tout se basant sur un système d'équipes pour permettre une gestion personnalisée.
## Tech Stack

**Client:** Twig, JQuery, SCSS

**Server:** Node, Express


## Run Locally

🇬🇧 Build the database using the provided sql script in `database_utils` folder  
🇫🇷 Créer la base de données en utilisant le script sql fourni dans le dossier `database_utils`

🇬🇧 Clone the project / 🇫🇷 Cloner le projet

```
  git clone https://github.com/FallconTXoC/Medisales
```

🇬🇧 Go to the project directory / 🇫🇷 Se rendre dans le répertoire du projet

```
  cd Medisales
```

🇬🇧 Install dependencies / 🇫🇷 Installer les dépendances

```
  npm install
```

🇬🇧 Start the server / 🇫🇷 Démarrer le serveur

```
  npm start
```

🇬🇧 Mandatory .env structure / 🇫🇷 Structure du fichier .env :

```
PORT
JWT_SECRET
DB_USER
DB_PASSWORD
HOST
ORIGIN
DEBUG    // boolean, if true database queries will be logged
```

## Connect to the app

🇬🇧 Either use `insert_users.sql` script in `database_utils` to quickly use accounts or make ones by yourself, beware that the password must be encrypted using BCrypt.  
Accounts in `insert_users.sql` have the same password : `pass123`.

🇫🇷 Il est possible d'utiliser `insert_users.sql` dans `database_utils` pour utiliser des comptes précréés ou d'insérer manuellement des comptes. Il est important de noter que les mots de passe doivent être chiffrés en utilisant BCrypt.  
Les comptes présents dans le script partagent le même mot de passe : `pass123`.

## Documentation

[🇫🇷 Documentation](https://docdro.id/NajOId5)


## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

