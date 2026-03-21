import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) ?? ,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      }),
    }),
  ],
})
export class EmailsModule {}
