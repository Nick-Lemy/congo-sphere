import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtPayload } from '../common/types/jtw.type';
import { EventUsersService } from '../event-users/event-users.service';
import { EventRole } from '../generated/prisma/enums';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventUsersService: EventUsersService,
  ) {}

  async create(currentUser: JwtPayload, createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: { ...createEventDto },
    });
    await this.eventUsersService.create({
      eventId: event.id,
      userId: currentUser.sub,
      role: EventRole.HOST,
    });
    return event;
  }

  findAll() {
    return this.prisma.event.findMany({
      include: { participants: { where: { role: EventRole.HOST } } },
    });
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { participants: true },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({ where: { id }, data: updateEventDto });
  }
}
