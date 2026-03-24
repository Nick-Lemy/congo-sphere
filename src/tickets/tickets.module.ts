import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, FilesService],
  exports: [TicketsService],
})
export class TicketsModule {}
