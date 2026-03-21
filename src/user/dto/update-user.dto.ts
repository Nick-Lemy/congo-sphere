import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
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
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique username for the user',
    example: 'verone_mankou',
    type: String,
  })
  @IsString()
  @IsOptional()
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
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Password for the user account',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'User Profile image file',
  })
  file?: any;
}
