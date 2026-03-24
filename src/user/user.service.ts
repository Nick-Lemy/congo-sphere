import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesService } from '../files/files.service';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly emailService: EmailsService,
  ) {}

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    if (file) {
      const avatarUrl = await this.filesService.uploadImage(
        file.buffer,
        file.originalname,
      );
      createUserDto.avatarUrl = avatarUrl;
    }
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    try {
      await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
    return newUser;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
