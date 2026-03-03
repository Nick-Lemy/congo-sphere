import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: new (...args: any[]) => T) {}
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          console.log(
            'Data is an empty array, returning empty array without transformation.',
          );
          if (data.length === 0) {
            return [];
          }
          return data.map((item) =>
            plainToInstance(this.dto, item, { excludeExtraneousValues: true }),
          );
        }
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
