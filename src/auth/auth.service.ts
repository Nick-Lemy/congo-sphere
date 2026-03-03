import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    createUserDto.password = hashedPassword;
    return this.userService.create(createUserDto);
  }
  async login(loginDto: LoginDto) {
    const { email, username, password } = loginDto;

    const user = email
      ? await this.userService.findOneByEmail(email)
      : username
        ? await this.userService.findOneByUsername(username)
        : null;
    if (!user) throw new BadRequestException();
    const isCorrectPassword = await this.comparePassword(password, user.password)
    if(!isCorrectPassword) throw new UnauthorizedException("Incorrect Password")
    return this.userService.create({ password: hashedPassword.  });
  }
  async hashPassword(password: string) {
    const salt = await genSalt();
    const hashedPassword = hash(password, salt);
    return hashedPassword;
  }
  async comparePassword(humanReadablePassword: string, hashedPassword: string ): Promise<boolean> {
    const isMatch = await compare(humanReadablePassword, hashedPassword)
    return isMatch
  }
}
