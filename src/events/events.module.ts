import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EventUsersModule } from '../event-users/event-users.module';
import { EventUsersService } from '../event-users/event-users.service';

@Module({
  providers: [EventsService, PrismaService, EventUsersService],
  controllers: [EventsController],
  imports: [EventUsersModule],
})
export class EventsModule {}
