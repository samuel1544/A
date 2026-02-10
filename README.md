# NestJS + MinIO Backend

Backend NestJS prêt pour gérer l'upload, le download, la mise à jour et la suppression de fichiers via MinIO (compatible S3).

## Démarrage rapide

```bash
cp .env.example .env
npm install
npm run start:dev
```

L'API tourne sur `http://localhost:3000`.

## Docker / Docker Compose

```bash
docker compose up --build
```

- API: `http://localhost:3000`
- MinIO Console: `http://localhost:9001`

## Endpoints

- `POST /files/upload` (multipart/form-data: `file`, optionnel `key`)
- `PUT /files/:key` (multipart/form-data: `file`)
- `GET /files/:key`
- `GET /files/:key/url?expiresIn=900`
- `DELETE /files/:key`

## Variables d'environnement

Voir `.env.example`.
