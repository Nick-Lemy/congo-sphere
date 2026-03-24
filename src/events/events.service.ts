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
import { EmailsService } from '../emails/emails.service';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventUsersService: EventUsersService,
    private readonly filesService: FilesService,
    private readonly emailsService: EmailsService,
    private readonly ticketsService: TicketsService,
  ) {}

  async create(
    currentUser: JwtPayload,
    createEventDto: CreateEventDto,
    file: Express.Multer.File,
  ) {
    const imageUrl = await this.filesService.uploadImage(
      file.buffer,
      file.originalname,
    );
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

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!event) throw new NotFoundException('Event not found!');
    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    const event = await this.findOne(id);
    if (file) {
      const imageUrl = await this.filesService.uploadImage(
        file.buffer,
        file.originalname,
      );
      updateEventDto.imageUrl = imageUrl;
    }
    return this.prisma.event.update({
      where: { id: event.id },
      data: updateEventDto,
    });
  }

  async delete(id: string) {
    const event = await this.findOne(id);
    return this.prisma.event.delete({ where: { id: event.id } });
  }

  async registerToEvent(eventId: string, user: JwtPayload) {
    const event = await this.findOne(eventId);
    try {
      const host = await this.prisma.eventUser.findFirst({
        where: { eventId: event.id, role: 'HOST' },
      });

      if (!host) throw new ConflictException();

      const hostUser = await this.prisma.user.findUnique({
        where: { id: host.userId },
      });

      const attendeeUser = await this.prisma.user.findUnique({
        where: { id: user.sub },
      });

      if (!attendeeUser) throw new NotFoundException('attendee not found');
      if (!hostUser) throw new NotFoundException('host not found');

      const ticket = await this.ticketsService.createEventPdfTicket(
        event,
        hostUser,
        attendeeUser,
      );
      const ticketPath = await this.filesService.uploadImage(
        ticket,
        `${event.title}-ticket.pdf`,
      );

      const attendee = await this.eventUsersService.create({
        eventId: event.id,
        userId: user.sub,
        role: EventRole.ATTENDEE,
        ticketUrl: ticketPath,
      });

      await this.emailsService.sendEventRegistrationEmail(
        user.email,
        event.title,
        user.username,
        event.id,
        [{ filename: 'ticket.pdf', path: ticketPath }],
      );
      return attendee;
    } catch (error) {
      console.error('Error registering to event:', error);
      throw new ConflictException('User is already registered for this event');
    }
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
