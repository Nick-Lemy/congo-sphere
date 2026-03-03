import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    default: 'Verone Mankou',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Unique username for the user',
    default: 'verone_mankou',
  })
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username!: string;

  @ApiProperty({
    description: 'Email address of the user',
    default: 'verone.mankou@example.com',
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password for the user account',
    default: 'SecurePassword123!',
  })
  @IsString()
  @IsStrongPassword()
  password!: string;
}
