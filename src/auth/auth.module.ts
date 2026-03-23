import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
@Module({
  providers: [
    AuthService,
    UserService,
    PrismaService,
    FilesService,
    JwtService,
  ],
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
  ],
})
export class AuthModule {}
