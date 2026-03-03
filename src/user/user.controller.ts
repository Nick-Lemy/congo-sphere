import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Retrieve a list of all users',
    description: 'Get a list of all registered users',
  })
  @Get('')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve a single user by their unique identifier',
    description: 'Get the details of a specific user using their ID',
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
  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Update an existing user',
    description: 'Update the details of an existing user',
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
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
