import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsString()
  @IsStrongPassword()
  newPassword!: string;
}
