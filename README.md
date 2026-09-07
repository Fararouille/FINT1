# FINT1 - Gestion des notes de frais

FINT1 est une application web qui aide les employes de SUP Herman a declarer leurs frais professionnels. Les managers valident les demandes et les comptables suivent leur traitement.

## Fonctionnalites

- Connexion par JWT et gestion des roles.
- Creation d'une note avec titre, montant, description et justificatifs.
- Validation ou refus par un manager.
- Traitement des notes validees par un comptable.
- Gestion des utilisateurs par un manager.
- Suivi des statuts `creee`, `validee`, `refusee` et `traitee`.

## Technologies

- Backend : Node.js, Express et Mongoose.
- Frontend : React 18, React Router et Axios.
- Base de donnees : MongoDB.
- Securite : JWT et bcryptjs.

## Installation et lancement

### Prerequis

- Node.js 16 ou plus recent.
- MongoDB local demarre sur `mongodb://localhost:27017`, ou MongoDB Atlas.
- npm.

Depuis le dossier `FINT1` :

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

Le fichier `backend/.env` doit contenir une configuration adaptee a votre environnement. Ne publiez jamais un vrai secret JWT :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fint1-expenses
JWT_SECRET=changez-cette-valeur-en-local
```

Initialiser les comptes de demonstration :

```powershell
cd backend
npm run seed
```

Lancer le backend dans un premier terminal :

```powershell
cd backend
npm start
```

Lancer le frontend dans un second terminal :

```powershell
cd frontend
npm start
```

L'interface est disponible sur [http://localhost:3000](http://localhost:3000) et l'API sur [http://localhost:5000](http://localhost:5000). Le guide detaille se trouve dans [RUN.md](RUN.md).

Verification de l'API : [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Comptes de demonstration

| Role | Email | Mot de passe |
| --- | --- | --- |
| Manager | `manager@supherman.com` | `Suph3rm4n!` |
| Comptable | `comptable@supherman.com` | `Suph3rm4n!` |
| Employe | `employe@supherman.com` | `Suph3rm4n!` |

Ces comptes sont prevus uniquement pour le developpement local.

## Documentation de l'API

Base URL : `http://localhost:5000/api`.

Toutes les routes protegees utilisent l'en-tete suivant :

```http
Authorization: Bearer <token>
```

### Authentification

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Public | Retourne un token JWT. |
| `POST` | `/auth/first-login` | Authentifie | Definit le mot de passe initial. |
| `GET` | `/auth/me` | Authentifie | Retourne l'utilisateur connecte. |

Exemple de connexion :

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employe@supherman.com","password":"Suph3rm4n!"}'
```

### Notes de frais

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `GET` | `/expenses` | Authentifie | Un employe voit ses notes ; manager et comptable voient toutes les notes. |
| `GET` | `/expenses/:id` | Authentifie | Retourne le detail d'une note. |
| `POST` | `/expenses` | Authentifie | Cree une note avec `title`, `amount`, `description` et `receipts`. |
| `PUT` | `/expenses/:id/validate` | Manager | Valide une note. `comment` est optionnel. |
| `PUT` | `/expenses/:id/refuse` | Manager | Refuse une note. `comment` est obligatoire. |
| `PUT` | `/expenses/:id/process` | Comptable | Marque une note comme traitee. |
| `DELETE` | `/expenses/:id` | Proprietaire | Supprime uniquement une note encore `creee`. |

La creation accepte `multipart/form-data`, jusqu'a 5 fichiers de 5 Mo maximum, en JPG, PNG ou PDF :

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer <jwt>" \
  -F "title=Deplacement client" -F "amount=42.50" \
  -F "description=Billet de train" -F "receipts=@justificatif.pdf"
```

### Utilisateurs

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `GET` | `/users` | Manager | Liste les utilisateurs. |
| `POST` | `/users` | Manager | Cree un utilisateur. |
| `PUT` | `/users/:id` | Manager | Modifie un utilisateur. |
| `DELETE` | `/users/:id` | Manager | Supprime un utilisateur. |

Les erreurs sont retournees au format `{"message":"..."}` avec un code HTTP `400`, `401`, `403`, `404` ou `500`.

## Organisation du projet

```text
FINT1/
├── backend/       API Express, modeles MongoDB et authentification
├── frontend/      Interface React
├── README.md      Documentation principale
└── RUN.md         Guide de lancement local
```

## GitHub

Le code source est disponible sur [github.com/Fararouille/FINT1](https://github.com/Fararouille/FINT1).

Pour associer un depot local au depot distant :

```bash
git remote add origin https://github.com/Fararouille/FINT1.git
git branch -M main
git push -u origin main
```

Projet de 4e annee - SUP Herman.
