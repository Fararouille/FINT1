
## Prerequis

- Node.js 16 ou plus recent
- MongoDB demarre localement sur `mongodb://localhost:27017`

## Installation initiale


```powershell
cd "FINT1\backend"
npm install
cd "..\frontend"
npm install
```

## Initialiser les donnees de test

Dans un terminal PowerShell :

```powershell
cd "FINT1\backend"
npm run seed
```

### Terminal 1 - API backend

```powershell
cd "FINT1\backend"
npm start
```

API : `http://localhost:5000`

Verification : `http://localhost:5000/api/health`

### Terminal 2 - interface React

```powershell
cd "FINT1\frontend"
npm start
```

Interface : `http://localhost:3000`

## Comptes de test

| Role | Email | Mot de passe |
| --- | --- | --- |
| Manager | manager@supherman.com | Suph3rm4n! |
| Comptable | comptable@supherman.com | Suph3rm4n! |
| Employe | employe@supherman.com | Suph3rm4n! |


