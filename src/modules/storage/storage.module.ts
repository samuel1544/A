import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const minioConfig = configService.get('minio');
        return new S3Client({
          region: 'us-east-1',
          endpoint: `http${minioConfig.useSSL ? 's' : ''}://${minioConfig.endpoint}:${minioConfig.port}`,
          credentials: {
            accessKeyId: minioConfig.accessKey,
            secretAccessKey: minioConfig.secretKey,
          },
          forcePathStyle: true,
        });
      },
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
