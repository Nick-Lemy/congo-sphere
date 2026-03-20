import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { unlink, writeFile } from 'fs/promises';
@Injectable()
export class FileService {
  async uploadImage(file: Express.Multer.File) {
    const tmpPath = `./tmp/${file.originalname}`;
    try {
      await writeFile(tmpPath, file.buffer);
      const imageUrl = await cloudinary.uploader.upload(tmpPath);
      await unlink(tmpPath);
      return imageUrl.url;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
