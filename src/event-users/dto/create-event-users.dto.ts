import { IsBoolean, IsUUID } from 'class-validator';
import { EventRole } from '../../generated/prisma/enums';

export class CreateEventUsersDto {
  eventId!: string;
  userId!: string;
  role!: EventRole;
  ticketUrl!: string;

  @IsUUID()
  ticketTypeId?: string;

  @IsBoolean()
  isPaid?: boolean = false;
}
