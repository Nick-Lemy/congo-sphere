import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EventType } from '../../generated/prisma/enums';
import { TicketType } from '../../generated/prisma/client';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Tech Conference 2024',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(24)
  title!: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example:
      'Join us for an exciting tech conference where industry leaders will share insights on the latest trends in technology. This event will feature keynote speakers, panel discussions, and networking opportunities.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  description!: string;

  @ApiProperty({
    description: 'Location where the event will take place',
    example: '123 Main St, Anytown, USA',
  })
  @IsNotEmpty()
  @IsString()
  location!: string;

  @ApiProperty({
    description: 'Category of the event',
    example: 'Technology',
  })
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty({
    description: 'Type of the event',
    example: 'FREE',
    enum: EventType,
  })
  @IsEnum(EventType)
  eventType: EventType = EventType.FREE;

  @ApiPropertyOptional({
    description: 'List of ticket types for the event',
    example: [
      { name: 'General Admission', price: 0 },
      { name: 'VIP', price: 100 },
    ],
  })
  @IsOptional()
  @IsJSON({ message: 'ticketTypes must be a valid JSON string' })
  ticketTypes?: Pick<TicketType, 'name' | 'price'>[];

  @ApiProperty({
    description: 'Start date and time of the event',
    example: '2026-09-01T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @ApiProperty({
    description: 'End date and time of the event',
    example: '2026-09-01T18:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate!: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Event image file',
  })
  file?: any;
}
