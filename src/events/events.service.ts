import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtPayload } from '../common/types/jtw.type';
import { EventUsersService } from '../event-users/event-users.service';
import { EventRole } from '../generated/prisma/enums';
import { FilesService } from '../files/files.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventUsersService: EventUsersService,
    private readonly filesService: FilesService,
  ) {}

  async create(
    currentUser: JwtPayload,
    createEventDto: CreateEventDto,
    file: Express.Multer.File,
  ) {
    const imageUrl = await this.filesService.uploadImage(file);
    const event = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: { ...createEventDto, imageUrl },
      });
      await tx.eventUser.create({
        data: {
          eventId: event.id,
          userId: currentUser.sub,
          role: EventRole.HOST,
        },
      });
      return event;
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

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException();
    if (file) {
      const imageUrl = await this.filesService.uploadImage(file);
      updateEventDto.imageUrl = imageUrl;
    }
    return this.prisma.event.update({
      where: { id: event.id },
      data: updateEventDto,
    });
  }

  async delete(id: string) {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException();
    return this.prisma.event.delete({ where: { id: event.id } });
  }

  async registerToEvent(eventId: string, user: JwtPayload) {
    const event = await this.findOne(eventId);
    if (!event) {
      throw new NotFoundException('Event not found!');
    }

    const attendee = await this.eventUsersService.create({
      eventId,
      userId: user.sub,
      role: EventRole.ATTENDEE,
    });

    return attendee;
  }

  async cancelRegistration(eventId: string, user: JwtPayload) {
    const attendee = await this.prisma.eventUser.findFirst({
      where: { eventId, userId: user.sub },
    });

    if (!attendee) throw new NotFoundException('Attendee not found!');
    if (attendee.role === EventRole.HOST)
      throw new ConflictException("Admin Can't Cancell registration");

    return this.prisma.eventUser.delete({
      where: { userId_eventId: { userId: user.sub, eventId } },
    });
  }
}
