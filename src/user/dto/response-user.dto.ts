import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  username!: string;

  @Expose()
  name!: string;

  @Expose()
  createdAt!: Date;
}
