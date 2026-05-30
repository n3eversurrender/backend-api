import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const res = http.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (res.headersSent) {
          return data;
        }
        return {
          statusCode: data?.statusCode,
          message: data?.message,
          data: data?.data,
        };
      }),
    );
  }
}
