import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(file: Express.Multer.File, key?: string) {
    const objectKey = key || `${randomUUID()}-${file.originalname}`;
    return this.storageService.putObject({
      key: objectKey,
      body: file.buffer,
      contentType: file.mimetype,
    });
  }

  async updateFile(key: string, file: Express.Multer.File) {
    return this.storageService.putObject({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });
  }

  async getFileStream(key: string) {
    return this.storageService.getObjectStream(key);
  }

  async deleteFile(key: string) {
    await this.storageService.deleteObject(key);
  }

  async getPresignedUrl(key: string, expiresIn?: number) {
    return this.storageService.getPresignedUrl(key, expiresIn);
  }
}
