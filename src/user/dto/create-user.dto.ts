import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Verone Mankou',
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'verone_mankou',
    type: String,
  })
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username!: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'verone.mankou@example.com',
    type: String,
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsString()
  @IsStrongPassword()
  password!: string;

  @ApiPropertyOptional({
    description: 'Role of the user (USER or ADMIN)',
    example: 'USER',
    enum: UserRole,
  })
  role?: UserRole = UserRole.ADMIN;

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
