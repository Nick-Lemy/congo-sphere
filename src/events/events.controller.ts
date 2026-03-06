import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { type JwtPayload } from '../common/types/jtw.type';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get('')
  findAll() {
    return this.eventsService.findAll();
  }

  @Post('')
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: JwtPayload,
  ) {
    this.eventsService.create(user, createEventDto);
  }
}
