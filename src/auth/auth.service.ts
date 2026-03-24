import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtPayload } from '../common/types/jtw.type';
import { User } from '../generated/prisma/client';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
  ) {}

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const { password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    createUserDto.password = hashedPassword;
    return this.userService.create(createUserDto, file);
  }

  async getCurrentUser(userId: string) {
    return this.userService.findOne(userId);
  }

  async login(loginDto: LoginDto) {
    const { email, username, password } = loginDto;

    const user = email
      ? await this.userService.findOneByEmail(email)
      : username
        ? await this.userService.findOneByUsername(username)
        : null;
    if (!user) throw new BadRequestException();
    const isCorrectPassword = await this.comparePassword(
      password,
      user.password,
    );
    if (!isCorrectPassword)
      throw new UnauthorizedException('Incorrect Password');

    const accessToken = await this.generateToken(user);
    return {
      access_token: accessToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    const token = await this.generateToken(user);
    await this.emailsService.sendForgotPasswordEmail(token, user.email);
    return { message: token };
  }

  async generateToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  private async hashPassword(password: string) {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  private async comparePassword(
    humanReadablePassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await compare(humanReadablePassword, hashedPassword);
    return isMatch;
  }
}
