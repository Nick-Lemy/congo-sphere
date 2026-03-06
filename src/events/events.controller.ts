import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { type JwtPayload } from '../common/types/jtw.type';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: 'Get all events',
    description: 'Returns a list of all events',
  })
  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('')
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({
    summary: 'Create a new event',
    description: 'Creates a new event with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('')
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.eventsService.create(user, createEventDto);
  }
}
