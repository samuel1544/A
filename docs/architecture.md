# Architecture NestJS + MinIO

## Structure des modules

- `AppModule` : point d'entrée, charge la configuration globale.
- `StorageModule` : encapsule le client S3/MinIO (SDK AWS v3), gère le bucket et les URLs pré-signées.
- `FilesModule` : couche métier (upload, update, download, delete) exposée par l'API REST.

## Flow recommandé

1. `FilesController` reçoit la requête HTTP.
2. `FilesService` orchestre la logique métier.
3. `StorageService` effectue les opérations S3/MinIO.

## Bonnes pratiques intégrées

- Validation des variables d'environnement (Joi).
- Validation des inputs HTTP (class-validator).
- Découplage clair entre stockage et logique métier.
- URL pré-signées pour exposer un accès sécurisé.
