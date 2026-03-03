import { ResponseUserDto } from '../../user/dto/response-user.dto';

export function validateRequest(user: ResponseUserDto) {
  return user.role === 'ADMIN';
}
