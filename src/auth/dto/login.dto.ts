import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'verone.mankou@example.com',
    type: String,
  })
  @ValidateIf((o: LoginDto) => !o.username)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Username of the user',
    example: 'verone_mankou',
    type: String,
  })
  @ValidateIf((o: LoginDto) => !o.email)
  @IsString()
  @Length(3, 20)
  username?: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsStrongPassword()
  @IsString()
  password!: string;
}
