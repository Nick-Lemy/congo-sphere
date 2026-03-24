import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import Stream from 'stream';

@Injectable()
export class FilesService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    fileBuffer:
      | string
      | NodeJS.ArrayBufferView
      | Iterable<string | NodeJS.ArrayBufferView>
      | AsyncIterable<string | NodeJS.ArrayBufferView>
      | Stream,
    fileName: string,
  ) {
    const tmpPath = `./tmp/${randomUUID()}-${fileName}`;
    try {
      await mkdir('./tmp', { recursive: true });
      await writeFile(tmpPath, fileBuffer);

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
