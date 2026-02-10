import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

interface PutObjectInput {
  key: string;
  body: Buffer;
  contentType?: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;
  private readonly presignExpires: number;

  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>('minio.bucket');
    this.presignExpires = this.configService.get<number>('minio.presignExpires');
  }

  async onModuleInit() {
    await this.ensureBucket();
  }

  async ensureBucket() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch (error) {
      this.logger.warn(`Bucket ${this.bucket} not found. Creating...`);
      await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async putObject(input: PutObjectInput) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );

    return {
      key: input.key,
      bucket: this.bucket,
    };
  }

  async getObjectStream(key: string) {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      stream: response.Body as Readable,
    };
  }

  async deleteObject(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getPresignedUrl(key: string, expiresIn?: number) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresIn ?? this.presignExpires,
    });
  }
}
