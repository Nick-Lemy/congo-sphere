import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    try {
      if (file) {
        const avatarUrl = await this.filesService.uploadImage(file);
        createUserDto.avatarUrl = avatarUrl;
      }
      return this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      console.error('Error while creating user, ', error);
      throw new InternalServerErrorException('Failed to create user');
    }
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
