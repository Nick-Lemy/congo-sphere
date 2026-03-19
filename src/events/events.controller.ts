import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { type JwtPayload } from '../common/types/jtw.type';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';

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

  @ApiOperation({
    summary: 'Get one event',
    description: "Get a single event's information form the event's id",
  })
  @ApiResponse({
    status: 200,
    description: 'Event got successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update an event',
    description: 'Update a single event by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Content updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({
    summary: 'Delete an event',
    description: 'Delete a single event by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Event deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found!',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
