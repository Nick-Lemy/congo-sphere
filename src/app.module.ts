import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { EventUsersService } from './event-users/event-users.service';
import { EventUsersModule } from './event-users/event-users.module';
import { FileService } from './file/file.service';

@Module({
  imports: [UserModule, AuthModule, EventsModule, EventUsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, EventUsersService, FileService],
})
export class AppModule {}
