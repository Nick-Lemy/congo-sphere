import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventUsersDto } from './dto/create-event-users.dto';

@Injectable()
export class EventUsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventUsersDto: CreateEventUsersDto) {
    const { eventId, userId, ...rest } = createEventUsersDto;
    try {
      const existingAttendee = await this.prisma.eventUser.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });
      if (existingAttendee)
        throw new ConflictException(
          'You are already a Participant of this event',
        );
      const attendee = await this.prisma.eventUser.create({
        data: {
          ...rest,
          joinedAt: new Date(),
          event: { connect: { id: eventId } },
          user: { connect: { id: userId } },
        },
      });
      return attendee;
    } catch (error) {
      console.warn('Error while creating an attendee: ', error);
      throw new InternalServerErrorException(
        'Error while creating an attendee',
      );
    }
  }
}
