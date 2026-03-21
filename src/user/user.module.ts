import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, FilesService],
  exports: [UserService],
})
export class UserModule {}
