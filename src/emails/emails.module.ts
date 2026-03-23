import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';

@Module({
  providers: [EmailsService],
  imports: [],
})
export class EmailsModule {}
