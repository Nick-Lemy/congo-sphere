import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve) => {
      resolve('File Name: ' + file.originalname);
    });
  }
}
