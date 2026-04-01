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
    await sharp(imagePath)
      .resize(320, 240)
      .toFile(imagePath + '.webp');
    return imagePath + '.webp';
  }

  private async saveFileToCloudinary(tmpPath: string) {
    try {
      const { secure_url } = await cloudinary.uploader.upload(tmpPath);
      return secure_url;
    } catch (error) {
      console.error('Upload failed:', error);

      throw new InternalServerErrorException();
    } finally {
      await unlink(tmpPath).catch((err: Error) => {
        console.warn('Failed to delete temp file:', err.message);
      });
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
}
