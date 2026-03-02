import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @IsStrongPassword()
  password!: string;
}
