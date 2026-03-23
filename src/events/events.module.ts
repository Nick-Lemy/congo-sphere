import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EventUsersModule } from '../event-users/event-users.module';
import { EventUsersService } from '../event-users/event-users.service';
import { FilesService } from '../files/files.service';
import { EmailsModule } from '../emails/emails.module';

@Module({
  providers: [EventsService, PrismaService, EventUsersService, FilesService],
  controllers: [EventsController],
  imports: [EventUsersModule, EmailsModule],
})
export class EventsModule {}
