import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { EmailAttachment } from '../common/types/email.type';

@Injectable()
export class EmailsService {
  constructor() {}
  private createEmailTransporter() {
    return createTransport({
      service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: EmailAttachment[],
  ) {
    const transporter = this.createEmailTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      attachments,
    });
  }
}
