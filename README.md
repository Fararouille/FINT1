# FINT1 - Gestion des notes de frais

Application web pour que les employes de SUP Herman declarent leurs frais professionnels. Un manager valide ou refuse les notes, le comptable traite celles qui sont validees.

## Fonctionnalites

- Connexion avec JWT, 3 roles : employe, manager, comptable
- Creation d'une note de frais avec justificatifs (image ou PDF)
- Validation / refus par le manager
- Traitement des notes validees par le comptable
- Creation de comptes par le manager
- Statuts : creee, validee, refusee, traitee
- Filtre des notes par statut et par email

## Technologies

- Backend : Node.js, Express, Mongoose
- Frontend : React 18, React Router, Axios
- Base de donnees : MongoDB
- Securite : JWT, bcryptjs

## Installation

Il faut Node.js et MongoDB (local ou Atlas).

```bash
cd backend
npm install
cd ../frontend
npm install
```

Creer le fichier `backend/.env` :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fint1-expenses
JWT_SECRET=changez-cette-valeur-en-local
```

Initialiser les comptes de demo puis lancer :

```bash
cd backend
npm run seed
npm start
```

Dans un autre terminal :

```bash
cd frontend
npm start
```

L'app est sur http://localhost:3000 et l'API sur http://localhost:5000.

## Comptes de demonstration

| Role | Email | Mot de passe |
| --- | --- | --- |
| Manager | manager@supherman.com | Suph3rm4n! |
| Comptable | comptable@supherman.com | Suph3rm4n! |
| Employe | employe@supherman.com | Suph3rm4n! |

## API

Base : `http://localhost:5000/api`, token dans l'en-tete `Authorization: Bearer <token>`.

### Authentification

| Methode | Route | Description |
| --- | --- | --- |
| POST | /auth/login | Connexion, retourne un token |
| POST | /auth/first-login | Definir le mot de passe initial |
| GET | /auth/me | Profil de l'utilisateur connecte |

### Notes de frais

| Methode | Route | Description |
| --- | --- | --- |
| GET | /expenses | Employe : ses notes. Manager : toutes. Comptable : notes validees |
| GET | /expenses/:id | Detail d'une note |
| POST | /expenses | Creer une note (titre, montant, description, fichiers) |
| PUT | /expenses/:id/validate | Manager : valider |
| PUT | /expenses/:id/refuse | Manager : refuser (commentaire obligatoire) |
| PUT | /expenses/:id/process | Comptable : marquer traitee |
| DELETE | /expenses/:id | Supprimer une note encore creee |

### Utilisateurs

| Methode | Route | Description |
| --- | --- | --- |
| GET | /users | Liste |
| POST | /users | Creer un compte |
| PUT | /users/:id | Modifier |
| DELETE | /users/:id | Supprimer |

Les erreurs sont renvoyees au format `{"message":"..."}`.

## Manuel utilisateur

### Connexion

- Aller sur http://localhost:3000
- Entrer son email et son mot de passe
- A la premiere connexion, un ecran demande de choisir un nouveau mot de passe

### Employe

- **Creer une note** : menu "Nouvelle note", remplir le titre, le montant, la description et joindre les justificatifs (JPG, PNG ou PDF, 5 Mo max, jusqu'a 5 fichiers)
- **Voir ses notes** : le tableau de bord liste les notes avec leur statut (code couleur) et le montant. Cliquer sur une note ouvre le detail avec les justificatifs et le commentaire du manager
- **Supprimer** : uniquement si la note est encore au statut "creee"

### Manager

- **Toutes les notes** : le menu "Toutes les notes" affiche les notes de tous les employes avec leur email
- **Valider** : bouton Valider a cote des notes "creee"
- **Refuser** : bouton Refuser, il faut saisir un commentaire (obligatoire)
- **Creer un compte** : menu "Creation de comptes", entrer l'email, un mot de passe et choisir le role

### Comptable

- **Traiter** : seul les notes "validee" sont visibles, le bouton Traiter passe la note au statut "traitee"

## GitHub

Code source : https://github.com/Fararouille/FINT1

Projet de 4e annee - SUP Herman.