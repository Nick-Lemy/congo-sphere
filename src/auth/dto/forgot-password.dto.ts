import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Account Email',
    example: 'randomuser@gmail.com',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
