import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return the created user', async () => {
      const newUser: CreateUserDto = {
        email: 'random.user@example.com',
        name: 'Random User',
        password: 'Ramdom#1234',
        username: 'ramdom_user2025',
      };
      const expectedUser: ResponseUserDto = {
        id: 'some-uuid',
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        role: 'USER',
      };
      mockPrismaService.user.create.mockResolvedValue(expectedUser);
      const result = await service.create(newUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: newUser,
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: ResponseUserDto[] = [
        {
          id: '1',
          email: 'a@example.com',
          name: 'A',
          username: 'a_user',
          role: 'USER',
        },
        {
          id: '2',
          email: 'b@example.com',
          name: 'B',
          username: 'b_user',
          role: 'USER',
        },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
    });
    it('should return an empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user when a valid id is provided', async () => {
      const user: ResponseUserDto = {
        id: '1',
        email: 'a@example.com',
        name: 'A',
        username: 'a_user',
        role: 'USER',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(user.id);
      expect(result).toEqual(user);
    });
    it('should throw NotFoundException when user with given id does not exist', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(service.findOne('random-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // describe('findOneByEmail', () => {
  //   it('should return a user when a valid email is provided');
  //   it(
  //     'should throw NotFoundException when user with given email does not exist',
  //   );
  // });

  // describe('findOneByUsername', () => {
  //   it('should return a user when a valid username is provided');
  //   it(
  //     'should throw NotFoundException when user with given username does not exist',
  //   );
  // });

  // describe('update', () => {
  //   it('should update and return the updated user');
  //   it('should only update the fields provided in the dto');
  // });

  // describe('delete', () => {
  //   it('should delete a user and return the deleted user');
  // });
});
