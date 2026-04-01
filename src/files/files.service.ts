import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(fileBuffer: Buffer, fileName: string): Promise<string> {
    const tmpPath = await this.saveFileTemporarily(fileBuffer, fileName);
    const webpPath = await this.convertImagetoWebp(tmpPath);
    const secureUrl = await this.saveFileToCloudinary(webpPath);
    return secureUrl;
  }

  async uploadPdf(fileBuffer: Buffer, fileName: string): Promise<string> {
    const tmpPath = await this.saveFileTemporarily(fileBuffer, fileName);
    const secureUrl = await this.saveFileToCloudinary(tmpPath);
    return secureUrl;
  }

  private async convertImagetoWebp(imagePath: string): Promise<string> {
    try {
      const webpPath = imagePath + '.webp';
      await sharp(imagePath).resize(320, 240).toFile(webpPath);
      return webpPath;
    } catch (error) {
      console.error('Image conversion failed:', error);
      throw new InternalServerErrorException('Failed to process image');
    } finally {
      await this.deleteFile(imagePath);
    }
  }

  private async saveFileToCloudinary(filePath: string) {
    try {
      const { secure_url } = await cloudinary.uploader.upload(filePath);
      return secure_url;
    } catch (error) {
      console.error('Upload failed:', error);

      throw new InternalServerErrorException('Failed to upload file');
    } finally {
      await this.deleteFile(filePath);
    }
  }

  private async saveFileTemporarily(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const tmpPath = `./tmp/${randomUUID()}-${fileName}`;
    await mkdir('./tmp', { recursive: true });
    await writeFile(tmpPath, fileBuffer);
    return tmpPath;
  }

  private async deleteFile(filePath: string) {
    return unlink(filePath).catch((err: Error) => {
      console.warn('Failed to delete file:', err.message);
    });
  }
}
