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
import { FilesService } from './files/files.service';
import { EmailsModule } from './emails/emails.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    UserModule,
    AuthModule,
    EventsModule,
    EventUsersModule,
    EmailsModule,
    TicketsModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    EventUsersService,
    FilesService,
  ],
})
export class AppModule {}
