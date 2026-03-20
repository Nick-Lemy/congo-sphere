import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { unlink, writeFile } from 'fs/promises';
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
    const tmpPath = `./tmp/${file.originalname}`;
    try {
      await writeFile(tmpPath, file.buffer);
      const { secure_url: imageUrl } =
        await cloudinary.uploader.upload(tmpPath);
      return imageUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException();
    } finally {
      await unlink(tmpPath);
    }
  }
}
