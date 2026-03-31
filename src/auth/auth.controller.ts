import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { CurrentUser } from './current-user.decorator';
import { type JwtPayload } from '../common/types/jtw.type';
import { AuthGuard } from './auth.guard';
import { SerializeInterceptor } from '../common/interceptors/serialize.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
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
  @ApiConsumes('multipart/form-data')
  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(new SerializeInterceptor(ResponseUserDto))
  register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.authService.register(createUserDto, file);
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
  @UseInterceptors(new SerializeInterceptor(ResponseUserDto))
  @UseGuards(AuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    return await this.authService.getCurrentUser(user.sub);
  }

  @ApiOperation({
    summary: 'Get current user information',
    description: 'Retrieve information about the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mail sent sucessfully',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get('forgot-password')
  async forgotPassword(@Query('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({
    summary: 'Get current user information',
    description: 'Retrieve information about the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully!',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(new SerializeInterceptor(ResponseUserDto))
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.authService.resetPassword(resetPasswordDto, user.sub);
  }
}
