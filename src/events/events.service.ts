import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtPayload } from '../common/types/jtw.type';
import { EventUsersService } from '../event-users/event-users.service';
import { EventRole } from '../generated/prisma/enums';
import { FileService } from '../file/file.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventUsersService: EventUsersService,
    private readonly fileService: FileService,
  ) {}

  async create(
    currentUser: JwtPayload,
    createEventDto: CreateEventDto,
    file: Express.Multer.File,
  ) {
    try {
      const imageUrl = await this.fileService.uploadImage(file);
      const event = await this.prisma.event.create({
        data: { ...createEventDto, imageUrl },
      });
      await this.eventUsersService.create({
        eventId: event.id,
        userId: currentUser.sub,
        role: EventRole.HOST,
      });
      return event;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw new InternalServerErrorException('Failed to create event');
    }
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
    try {
      const event = await this.findOne(id);
      if (!event) throw new NotFoundException();
      if (file) {
        const imageUrl = await this.fileService.uploadImage(file);
        updateEventDto.imageUrl = imageUrl;
      }
      return this.prisma.event.update({
        where: { id: event.id },
        data: updateEventDto,
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async delete(id: string) {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException();
    return this.prisma.event.delete({ where: { id: event.id } });
  }
}
