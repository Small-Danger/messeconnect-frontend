# MesseConnect — Frontend

Application web React (Vite) pour MesseConnect : espaces fidèle, paroisse et administration.

## Prérequis

- Node.js 20+
- API Laravel MesseConnect (dépôt backend séparé)

## Configuration

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l’API (ex. `https://api.example.com/api` ou `/api` en dev avec proxy) |
| `VITE_USE_MOCK` | `false` pour l’API réelle, `true` pour le mode démo sans backend |
| `VITE_GOOGLE_CLIENT_ID` | Optionnel — connexion Google fidèle |

## Développement

```bash
npm ci
npm run dev
```

Le proxy Vite redirige `/api` vers `http://127.0.0.1:8000` (voir `vite.config.ts`).

## Production

```bash
npm run build
```

Servir le dossier `dist/` (Railway, Nginx, etc.). Les variables `VITE_*` sont lues **au build**.

## Déploiement Railway

Voir `railway.toml` et `nixpacks.toml` à la racine de ce dépôt.

Backend associé : [messeconnect](https://github.com/Small-Danger/MesseConnect) (monorepo ou API déployée séparément).
