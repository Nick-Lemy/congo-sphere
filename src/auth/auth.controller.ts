import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { CurrentUser } from './current-user.decorator';
import { type JwtPayload } from '../common/types/jtw.type';
import { AuthGuard } from './auth.guard';
import { SerializeInterceptor } from '../common/interceptors/serialize.interceptor';

@ApiTags('Authentication')
@UseInterceptors(new SerializeInterceptor(ResponseUserDto))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({
    summary: 'Authenticate a user and return a JWT access token',
    description:
      'Authenticate a user using their email or username and password, and return a JWT access token for authorized access to protected resources.',
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Get current user information',
    description: 'Retrieve information about the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user information retrieved successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    return await this.authService.getCurrentUser(user.sub);
  }
}
