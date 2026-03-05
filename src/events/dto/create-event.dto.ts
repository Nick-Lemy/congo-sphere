import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(24)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  description!: string;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsDateString()
  startDate!: Date;

  @IsDateString()
  endDate!: Date;
}
