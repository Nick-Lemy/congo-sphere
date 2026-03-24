import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { EmailsModule } from '../emails/emails.module';
import { EmailsService } from '../emails/emails.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, FilesService, EmailsService],
  exports: [UserService],
  imports: [EmailsModule],
})
export class UserModule {}
