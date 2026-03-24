import { EventRole } from '../../generated/prisma/enums';

export class CreateEventUsersDto {
  eventId!: string;
  userId!: string;
  role!: EventRole;
  ticketUrl!: string;
}
