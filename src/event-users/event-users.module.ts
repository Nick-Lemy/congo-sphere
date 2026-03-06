import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventUsersService } from './event-users.service';

@Module({
  providers: [PrismaService, EventUsersService],
  exports: [EventUsersService],
})
export class EventUsersModule {}
