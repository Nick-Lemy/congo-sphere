import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { EmailsModule } from '../emails/emails.module';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, UserService, PrismaService, FilesService],
  controllers: [AuthController],
  imports: [
    EmailsModule,
    UserModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService], // Inject the generic config service
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
})
export class AuthModule {}
