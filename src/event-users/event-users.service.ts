import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventUsersDto } from './dto/create-event-users.dto';

@Injectable()
export class EventUsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEventUsers: CreateEventUsersDto) {
    const { eventId, userId, ...rest } = createEventUsers;
    return this.prisma.eventUser.create({
      data: {
        ...rest,
        joinedAt: new Date(),
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
      },
    });
  }
}
