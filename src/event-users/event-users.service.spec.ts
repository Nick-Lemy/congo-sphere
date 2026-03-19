import { Test, TestingModule } from '@nestjs/testing';
import { EventUsersService } from './event-users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EventUsersService', () => {
  let service: EventUsersService;
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
        EventUsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventUsersService>(EventUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
