import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { SerializeInterceptor } from '../common/interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseGuards(AdminGuard)
@UseInterceptors(new SerializeInterceptor(ResponseUserDto))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Retrieve a list of all users',
    description: 'Get a list of all registered users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [ResponseUserDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve a single user by their unique identifier',
    description: 'Get the details of a specific user using their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    type: String,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'The details of the user to create',
  })
  @ApiConsumes('multipart/form-data')
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.create(createUserDto, file);
  }

  @ApiOperation({
    summary: 'Update an existing user',
    description: 'Update the details of an existing user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    type: String,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update for the user',
  })
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete a user by their unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    type: String,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
