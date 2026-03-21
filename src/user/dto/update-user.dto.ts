import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'Verone Mankou',
    type: String,
  })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique username for the user',
    example: 'verone_mankou',
    type: String,
  })
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'verone.mankou@example.com',
    type: String,
  })
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Password for the user account',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsString()
  @IsStrongPassword()
  password?: string;

  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'User Profile image file',
  })
  file?: any;
}
