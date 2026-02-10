export default () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'minio',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    useSSL: process.env.MINIO_USE_SSL === 'true',
    bucket: process.env.MINIO_BUCKET || 'uploads',
    presignExpires: parseInt(process.env.MINIO_PRESIGN_EXPIRES || '900', 10),
  },
});
