import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import { FilesService } from './files.service';
import { PresignDto } from './dto/presign.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('key') key?: string,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    return this.filesService.uploadFile(file, key);
  }

  @Put(':key')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateFile(
    @Param('key') key: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    return this.filesService.updateFile(key, file);
  }

  @Get(':key')
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    const { stream, contentType, contentLength } =
      await this.filesService.getFileStream(key);

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    if (contentLength) {
      res.setHeader('Content-Length', contentLength.toString());
    }

    stream.pipe(res);
  }

  @Get(':key/url')
  async getPresignedUrl(@Param('key') key: string, @Query() dto: PresignDto) {
    const url = await this.filesService.getPresignedUrl(key, dto.expiresIn);
    return { url };
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.filesService.deleteFile(key);
    return { deleted: true };
  }
}
