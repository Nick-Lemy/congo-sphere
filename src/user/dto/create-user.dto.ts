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
}
