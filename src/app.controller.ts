import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health Check Endpoint',
    description: 'Endpoint to check if the application is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    content: {
      'application/json': {
        example: 'Hello World!',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
