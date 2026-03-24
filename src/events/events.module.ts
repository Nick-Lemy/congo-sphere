import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EventUsersModule } from '../event-users/event-users.module';
import { FilesService } from '../files/files.service';
import { EmailsModule } from '../emails/emails.module';
import { TicketsModule } from '../tickets/tickets.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [EventsService, PrismaService, FilesService],
  controllers: [EventsController],
  imports: [EventUsersModule, EmailsModule, TicketsModule, UserModule],
})
export class EventsModule {}
