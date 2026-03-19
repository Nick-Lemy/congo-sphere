import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEventDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MaxLength(24)
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(30)
  description?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  location?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
