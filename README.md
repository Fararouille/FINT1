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
| `GET` | `/expenses` | Authentifie | Un employe voit ses notes ; manager voit toutes les notes ; comptable voit uniquement les notes validees. |
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

## Manuel utilisateur

### Connexion

1. Ouvrir l'application sur `http://localhost:3000`.
2. Saisir votre adresse email et votre mot de passe.
3. Cliquer sur **Se connecter**.

> **Premiere connexion** : si c'est la premiere fois que vous vous connectez, un ecran vous demandera de definir un nouveau mot de passe (minimum 6 caracteres). Saisissez-le deux fois, puis cliquez sur **Definir le mot de passe**.

### En tant qu'employe

#### Consulter mes notes de frais

- Apres la connexion, vous arrivez sur le **Tableau de bord** qui liste toutes vos notes de frais.
- Chaque ligne affiche le titre, le statut (avec un code couleur), la date de soumission et le montant.
- **Cliquez sur une note** pour ouvrir une modale avec les details complets : description, justificatifs joints, commentaire du manager ou du comptable.

#### Creer une note de frais

1. Cliquez sur **Nouvelle note** dans le menu lateral.
2. Remplissez le formulaire :
   - **Titre** (obligatoire) : decrivez brievement la depense.
   - **Montant** (obligatoire) : montant en euros.
   - **Description** : details optionnels.
3. Joignez vos justificatifs en cliquant sur **Choisir un fichier** (JPG, PNG ou PDF, 5 Mo max, jusqu'a 5 fichiers).
4. Cliquez sur **Creer la note**.

> Une fois creee, la note a le statut **Creee**. Vous ne pouvez la supprimer que si elle n'a pas encore ete validee ou refusee.

#### Supprimer une note

- Dans le tableau de bord, ouvrez la note puis cliquez sur **Supprimer** (uniquement si le statut est "Creee").

### En tant que manager

#### Consulter toutes les notes de frais

1. Cliquez sur **Toutes les notes** dans le menu lateral.
2. Le tableau affiche les notes de tous les employes avec leur email.
3. Utilisez les **filtres** en haut pour rechercher par statut ou par email d'employe.

#### Valider ou refuser une note

- A cote de chaque note avec le statut **Creee**, deux boutons s'affichent :
  - **Valider** : la note passe au statut **Validee**. Un commentaire est optionnel.
  - **Refuser** : une modale vous demande de saisir un **commentaire obligatoire** expliquant le refus. La note passe au statut **Refusee**.

> Apres validation, la note est visible par le comptable pour traitement.

#### Creer un compte utilisateur

1. Cliquez sur **Creation de comptes** dans le menu lateral.
2. Saisissez l'adresse email du nouvel employe.
3. Choisissez un mot de passe (minimum 6 caracteres).
4. Selectionnez le role : **Employe**, **Manager** ou **Comptable**.
5. Cliquez sur **Creer le compte**.

> L'employe devra definir son propre mot de passe lors de sa premiere connexion.

### En tant que comptable

#### Consulter les notes a traiter

1. Cliquez sur **Toutes les notes** dans le menu lateral.
2. Seules les notes avec le statut **Validee** sont affichees (filtre serveur).

#### Traiter une note

- A cote de chaque note validee, un bouton **Traiter** s'affiche.
- Cliquez dessus et confirmez : la note passe au statut **Traitee**.
- Le traitement indique que la note a ete prise en charge par le service comptabilite.

### Mon profil

- Cliquez sur **Mon profil** dans le menu lateral pour voir votre email et votre role.

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
