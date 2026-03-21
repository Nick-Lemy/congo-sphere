import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
@Injectable()
export class FileService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File) {
    const tmpPath = `./tmp/${randomUUID()}-${file.originalname}`;
    try {
      await mkdir('./tmp', { recursive: true });
      await writeFile(tmpPath, file.buffer);

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
}
