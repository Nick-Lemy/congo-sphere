import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Tech Conference 2024 - Updated',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MaxLength(24)
  title?: string;

  @ApiProperty({
    description: 'Description of the event',
    example:
      'Join us for an exciting tech conference where industry leaders will share insights on the latest trends in technology. This event will feature keynote speakers, panel discussions, and networking opportunities.',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(30)
  description?: string;

  @ApiProperty({
    description: 'Location of the event',
    example: 'San Francisco, CA',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Start date of the event',
    example: '2023-10-15T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({
    description: 'End date of the event',
    example: '2023-10-15T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Event image file',
  })
  file?: any;

  @ApiProperty({
    description: 'Detailed description of the event',
    example:
      'Join us for an exciting tech conference where industry leaders will share insights on the latest trends in technology. This event will feature keynote speakers, panel discussions, and networking opportunities.',
  })
  imageUrl?: string;
}
